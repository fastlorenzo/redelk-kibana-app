"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCalculateAutoTimeExpression = void 0;
const tslib_1 = require("tslib");
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
const moment_1 = tslib_1.__importDefault(require("moment"));
const time_buckets_1 = require("../buckets/lib/time_buckets");
const common_1 = require("../../../../common");
function getCalculateAutoTimeExpression(uiSettings) {
    return function calculateAutoTimeExpression(range) {
        const dates = common_1.toAbsoluteDates(range);
        if (!dates) {
            return;
        }
        const buckets = new time_buckets_1.TimeBuckets({
            'histogram:maxBars': uiSettings.get(common_1.UI_SETTINGS.HISTOGRAM_MAX_BARS),
            'histogram:barTarget': uiSettings.get(common_1.UI_SETTINGS.HISTOGRAM_BAR_TARGET),
            dateFormat: uiSettings.get('dateFormat'),
            'dateFormat:scaled': uiSettings.get('dateFormat:scaled'),
        });
        buckets.setInterval('auto');
        buckets.setBounds({
            min: moment_1.default(dates.from),
            max: moment_1.default(dates.to),
        });
        return buckets.getInterval().expression;
    };
}
exports.getCalculateAutoTimeExpression = getCalculateAutoTimeExpression;
