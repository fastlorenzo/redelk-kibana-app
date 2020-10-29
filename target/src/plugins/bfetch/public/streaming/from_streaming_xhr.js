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
exports.fromStreamingXhr = void 0;
const rxjs_1 = require("rxjs");
/**
 * Creates observable from streaming XMLHttpRequest, where each event
 * corresponds to a streamed chunk.
 */
exports.fromStreamingXhr = (xhr) => {
    const subject = new rxjs_1.Subject();
    let index = 0;
    const processBatch = () => {
        const { responseText } = xhr;
        if (index >= responseText.length)
            return;
        subject.next(responseText.substr(index));
        index = responseText.length;
    };
    xhr.onprogress = processBatch;
    xhr.onreadystatechange = () => {
        // Older browsers don't support onprogress, so we need
        // to call this here, too. It's safe to call this multiple
        // times even for the same progress event.
        processBatch();
        // 4 is the magic number that means the request is done
        if (xhr.readyState === 4) {
            // 0 indicates a network failure. 400+ messages are considered server errors
            if (xhr.status === 0 || xhr.status >= 400) {
                subject.error(new Error(`Batch request failed with status ${xhr.status}`));
            }
            else {
                subject.complete();
            }
        }
    };
    return subject;
};
