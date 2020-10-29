"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertCert = exports.readPkcs12Truststore = exports.readPkcs12Keystore = void 0;
const node_forge_1 = require("node-forge");
const fs_1 = require("fs");
/**
 * Reads a private key and certificate chain from a PKCS12 key store.
 *
 * @remarks
 * The PKCS12 key store may contain the following:
 * - 0 or more certificates contained in a `certBag` (OID
 *  1.2.840.113549.1.12.10.1.3); if a certificate has an associated
 *  private key it is treated as an instance certificate, otherwise it is
 *  treated as a CA certificate
 * - 0 or 1 private keys contained in a `keyBag` (OID
 *  1.2.840.113549.1.12.10.1.1) or a `pkcs8ShroudedKeyBag` (OID
 *  1.2.840.113549.1.12.10.1.2)
 *
 * Any other PKCS12 bags are ignored.
 *
 * @privateRemarks
 * This intentionally does not allow for a separate key store password and
 * private key password. In conventional implementations, these two values
 * are expected to be identical, so we do not support other configurations.
 *
 * @param path The file path of the PKCS12 key store
 * @param password The optional password of the key store and private key;
 * if there is no password, this may be an empty string or `undefined`,
 * depending on how the key store was generated.
 * @returns the parsed private key and certificate(s) in PEM format
 */
exports.readPkcs12Keystore = (path, password) => {
    const p12base64 = fs_1.readFileSync(path, 'base64');
    const p12Der = node_forge_1.util.decode64(p12base64);
    const p12Asn1 = node_forge_1.asn1.fromDer(p12Der);
    const p12 = node_forge_1.pkcs12.pkcs12FromAsn1(p12Asn1, password);
    const keyObj = getKey(p12);
    const { ca, cert } = getCerts(p12, keyObj?.publicKeyData);
    return { ca, cert, key: keyObj?.key };
};
/**
 * Reads a certificate chain from a PKCS12 trust store.
 *
 * @remarks
 * The PKCS12 trust store may contain the following:
 * - 0 or more certificates contained in a `certBag` (OID
 *  1.2.840.113549.1.12.10.1.3); all are treated as CA certificates
 *
 * Any other PKCS12 bags are ignored.
 *
 * @param path The file path of the PKCS12 trust store
 * @param password The optional password of the trust store; if there is
 * no password, this may be an empty string or `undefined`, depending on
 * how the trust store was generated.
 * @returns the parsed certificate(s) in PEM format
 */
exports.readPkcs12Truststore = (path, password) => {
    const p12base64 = fs_1.readFileSync(path, 'base64');
    const p12Der = node_forge_1.util.decode64(p12base64);
    const p12Asn1 = node_forge_1.asn1.fromDer(p12Der);
    const p12 = node_forge_1.pkcs12.pkcs12FromAsn1(p12Asn1, password);
    const keyObj = getKey(p12);
    const { ca } = getCerts(p12, keyObj?.publicKeyData);
    return ca;
};
const doesPubKeyMatch = (a, b) => {
    if (a && b) {
        return a.n.compareTo(b.n) === 0 && a.e.compareTo(b.e) === 0;
    }
    return false;
};
const getCerts = (p12, pubKey) => {
    // OID 1.2.840.113549.1.12.10.1.3 (certBag)
    const bags = getBags(p12, node_forge_1.pki.oids.certBag);
    let ca;
    let cert;
    if (bags && bags.length) {
        const certs = bags.map(exports.convertCert).filter((x) => x !== undefined);
        cert = certs.find((x) => doesPubKeyMatch(x.publicKeyData, pubKey))?.cert;
        ca = certs.filter((x) => !doesPubKeyMatch(x.publicKeyData, pubKey)).map((x) => x.cert);
        if (ca.length === 0) {
            ca = undefined;
        }
    }
    return { ca, cert };
};
exports.convertCert = (bag) => {
    const cert = bag.cert;
    if (cert) {
        const pem = node_forge_1.pki.certificateToPem(cert);
        const key = cert.publicKey;
        const publicKeyData = {
            n: key.n,
            e: key.e,
        };
        return {
            cert: pem,
            publicKeyData,
        };
    }
    return undefined;
};
const getKey = (p12) => {
    // OID 1.2.840.113549.1.12.10.1.1 (keyBag) || OID 1.2.840.113549.1.12.10.1.2 (pkcs8ShroudedKeyBag)
    const bags = [
        ...(getBags(p12, node_forge_1.pki.oids.keyBag) || []),
        ...(getBags(p12, node_forge_1.pki.oids.pkcs8ShroudedKeyBag) || []),
    ];
    if (bags && bags.length) {
        if (bags.length > 1) {
            throw new Error(`Keystore contains multiple private keys.`);
        }
        const key = bags[0].key;
        if (key) {
            const pem = node_forge_1.pki.privateKeyToPem(key);
            const publicKeyData = {
                n: key.n,
                e: key.e,
            };
            return {
                key: pem,
                publicKeyData,
            };
        }
    }
    return undefined;
};
const getBags = (p12, bagType) => {
    const bagObj = p12.getBags({ bagType });
    const bags = bagObj[bagType];
    if (bags && bags.length) {
        return bags;
    }
    return undefined;
};
