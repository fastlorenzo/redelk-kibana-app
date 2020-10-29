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
exports.ResizeChecker = void 0;
const tslib_1 = require("tslib");
const events_1 = require("events");
const lodash_1 = require("lodash");
const resize_observer_polyfill_1 = tslib_1.__importDefault(require("resize-observer-polyfill"));
function getSize(el) {
    return [el.clientWidth, el.clientHeight];
}
/**
 *  ResizeChecker receives an element and emits a "resize" event every time it changes size.
 */
class ResizeChecker extends events_1.EventEmitter {
    constructor(el, args = {}) {
        super();
        this.destroyed = false;
        this.expectedSize = null;
        this.el = el;
        this.observer = new resize_observer_polyfill_1.default(() => {
            if (this.expectedSize) {
                const sameSize = lodash_1.isEqual(getSize(el), this.expectedSize);
                this.expectedSize = null;
                if (sameSize) {
                    // don't trigger resize notification if the size is what we expect
                    return;
                }
            }
            this.emit('resize');
        });
        // Only enable the checker immediately if args.disabled wasn't set to true
        if (!args.disabled) {
            this.enable();
        }
    }
    enable() {
        if (this.destroyed) {
            // Don't allow enabling an already destroyed resize checker
            return;
        }
        // the width and height of the element that we expect to see
        // on the next resize notification. If it matches the size at
        // the time of starting observing then it we will be ignored.
        // We know that observer and el are not null since we are not yet destroyed.
        this.expectedSize = getSize(this.el);
        this.observer.observe(this.el);
    }
    /**
     *  Run a function and ignore all resizes that occur
     *  while it's running.
     */
    modifySizeWithoutTriggeringResize(block) {
        try {
            block();
        }
        finally {
            if (this.el) {
                this.expectedSize = getSize(this.el);
            }
        }
    }
    /**
     * Tell the ResizeChecker to shutdown, stop listenings, and never
     * emit another resize event.
     *
     * Cleans up it's listeners and timers.
     */
    destroy() {
        if (this.destroyed) {
            return;
        }
        this.destroyed = true;
        this.observer.disconnect();
        this.observer = null;
        this.expectedSize = null;
        this.el = null;
        this.removeAllListeners();
    }
}
exports.ResizeChecker = ResizeChecker;
