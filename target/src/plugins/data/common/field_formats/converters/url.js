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
exports.UrlFormat = void 0;
const i18n_1 = require("@kbn/i18n");
const lodash_1 = require("lodash");
const utils_1 = require("../utils");
const types_1 = require("../../kbn_field_types/types");
const field_format_1 = require("../field_format");
const types_2 = require("../types");
const templateMatchRE = /{{([\s\S]+?)}}/g;
const allowedUrlSchemes = ['http://', 'https://'];
const URL_TYPES = [
    {
        kind: 'a',
        text: i18n_1.i18n.translate('data.fieldFormats.url.types.link', {
            defaultMessage: 'Link',
        }),
    },
    {
        kind: 'img',
        text: i18n_1.i18n.translate('data.fieldFormats.url.types.img', {
            defaultMessage: 'Image',
        }),
    },
    {
        kind: 'audio',
        text: i18n_1.i18n.translate('data.fieldFormats.url.types.audio', {
            defaultMessage: 'Audio',
        }),
    },
];
const DEFAULT_URL_TYPE = 'a';
class UrlFormat extends field_format_1.FieldFormat {
    constructor(params) {
        super(params);
        this.textConvert = (value) => this.formatLabel(value);
        this.htmlConvert = (rawValue, options = {}) => {
            const { field, hit } = options;
            const { parsedUrl } = this._params;
            const { basePath, pathname, origin } = parsedUrl || {};
            const url = lodash_1.escape(this.formatUrl(rawValue));
            const label = lodash_1.escape(this.formatLabel(rawValue, url));
            switch (this.param('type')) {
                case 'audio':
                    return `<audio controls preload="none" src="${url}">`;
                case 'img':
                    // If the URL hasn't been formatted to become a meaningful label then the best we can do
                    // is tell screen readers where the image comes from.
                    const imageLabel = label === url ? `A dynamically-specified image located at ${url}` : label;
                    return this.generateImgHtml(url, imageLabel);
                default:
                    const inWhitelist = allowedUrlSchemes.some((scheme) => url.indexOf(scheme) === 0);
                    if (!inWhitelist && !parsedUrl) {
                        return url;
                    }
                    let prefix = '';
                    /**
                     * This code attempts to convert a relative url into a kibana absolute url
                     *
                     * SUPPORTED:
                     *  - /app/kibana/
                     *  - ../app/kibana
                     *  - #/discover
                     *
                     * UNSUPPORTED
                     *  - app/kibana
                     */
                    if (!inWhitelist) {
                        // Handles urls like: `#/discover`
                        if (url[0] === '#') {
                            prefix = `${origin}${pathname}`;
                        }
                        // Handle urls like: `/app/kibana` or `/xyz/app/kibana`
                        else if (url.indexOf(basePath || '/') === 0) {
                            prefix = `${origin}`;
                        }
                        // Handle urls like: `../app/kibana`
                        else {
                            const prefixEnd = url[0] === '/' ? '' : '/';
                            prefix = `${origin}${basePath || ''}/app${prefixEnd}`;
                        }
                    }
                    let linkLabel;
                    if (hit && hit.highlight && hit.highlight[field.name]) {
                        linkLabel = utils_1.getHighlightHtml(label, hit.highlight[field.name]);
                    }
                    else {
                        linkLabel = label;
                    }
                    const linkTarget = this.param('openLinkInCurrentTab') ? '_self' : '_blank';
                    return `<a href="${prefix}${url}" target="${linkTarget}" rel="noopener noreferrer">${linkLabel}</a>`;
            }
        };
        this.compileTemplate = lodash_1.memoize(this.compileTemplate);
    }
    getParamDefaults() {
        return {
            type: DEFAULT_URL_TYPE,
            urlTemplate: null,
            labelTemplate: null,
            width: null,
            height: null,
        };
    }
    formatLabel(value, url) {
        const template = this.param('labelTemplate');
        if (url == null)
            url = this.formatUrl(value);
        if (!template)
            return url;
        return this.compileTemplate(template)({
            value,
            url,
        });
    }
    formatUrl(value) {
        const template = this.param('urlTemplate');
        if (!template)
            return value;
        return this.compileTemplate(template)({
            value: encodeURIComponent(value),
            rawValue: value,
        });
    }
    compileTemplate(template) {
        // trim all the odd bits, the variable names
        const parts = template.split(templateMatchRE).map((part, i) => (i % 2 ? part.trim() : part));
        return function (locals) {
            // replace all the odd bits with their local var
            let output = '';
            let i = -1;
            while (++i < parts.length) {
                if (i % 2) {
                    if (locals.hasOwnProperty(parts[i])) {
                        const local = locals[parts[i]];
                        output += local == null ? '' : local;
                    }
                }
                else {
                    output += parts[i];
                }
            }
            return output;
        };
    }
    generateImgHtml(url, imageLabel) {
        const isValidWidth = !isNaN(parseInt(this.param('width'), 10));
        const isValidHeight = !isNaN(parseInt(this.param('height'), 10));
        const maxWidth = isValidWidth ? `${this.param('width')}px` : 'none';
        const maxHeight = isValidHeight ? `${this.param('height')}px` : 'none';
        return `<img src="${url}" alt="${imageLabel}" style="width:auto; height:auto; max-width:${maxWidth}; max-height:${maxHeight};">`;
    }
}
exports.UrlFormat = UrlFormat;
UrlFormat.id = types_2.FIELD_FORMAT_IDS.URL;
UrlFormat.title = i18n_1.i18n.translate('data.fieldFormats.url.title', {
    defaultMessage: 'Url',
});
UrlFormat.fieldType = [
    types_1.KBN_FIELD_TYPES.NUMBER,
    types_1.KBN_FIELD_TYPES.BOOLEAN,
    types_1.KBN_FIELD_TYPES.DATE,
    types_1.KBN_FIELD_TYPES.IP,
    types_1.KBN_FIELD_TYPES.STRING,
    types_1.KBN_FIELD_TYPES.MURMUR3,
    types_1.KBN_FIELD_TYPES.UNKNOWN,
    types_1.KBN_FIELD_TYPES.CONFLICT,
];
UrlFormat.urlTypes = URL_TYPES;
// console.log(UrlFormat);
