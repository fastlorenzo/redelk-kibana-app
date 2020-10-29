"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimechartHeader = void 0;
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
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
const i18n_1 = require("@kbn/i18n");
function TimechartHeader({ from, to, options, onChangeInterval, stateInterval, showScaledInfo, bucketIntervalDescription, bucketIntervalScale, }) {
    const [interval, setInterval] = react_1.useState(stateInterval);
    react_1.useEffect(() => {
        setInterval(stateInterval);
    }, [stateInterval]);
    const handleIntervalChange = (e) => {
        setInterval(e.target.value);
        onChangeInterval(e.target.value);
    };
    return (react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "s", responsive: true, justifyContent: "center", alignItems: "center" },
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiToolTip, { content: i18n_1.i18n.translate('discover.howToChangeTheTimeTooltip', {
                        defaultMessage: 'To change the time, use the global time filter above',
                    }), delay: "long" },
                    react_1.default.createElement(eui_1.EuiText, { "data-test-subj": "discoverIntervalDateRange", size: "s" }, `${from} - ${to} ${interval !== 'auto'
                        ? i18n_1.i18n.translate('discover.timechartHeader.timeIntervalSelect.per', {
                            defaultMessage: 'per',
                        })
                        : ''}`))),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiSelect, { "aria-label": i18n_1.i18n.translate('discover.timechartHeader.timeIntervalSelect.ariaLabel', {
                        defaultMessage: 'Time interval',
                    }), compressed: true, id: "dscResultsIntervalSelector", "data-test-subj": "discoverIntervalSelect", options: options
                        .filter(({ val }) => val !== 'custom')
                        .map(({ display, val }) => {
                        return {
                            text: display,
                            value: val,
                            label: display,
                        };
                    }), value: interval, onChange: handleIntervalChange, append: showScaledInfo ? (react_1.default.createElement(eui_1.EuiIconTip, { id: "discoverIntervalIconTip", content: i18n_1.i18n.translate('discover.bucketIntervalTooltip', {
                            defaultMessage: 'This interval creates {bucketsDescription} to show in the selected time range, so it has been scaled to {bucketIntervalDescription}.',
                            values: {
                                bucketsDescription: bucketIntervalScale && bucketIntervalScale > 1
                                    ? i18n_1.i18n.translate('discover.bucketIntervalTooltip.tooLargeBucketsText', {
                                        defaultMessage: 'buckets that are too large',
                                    })
                                    : i18n_1.i18n.translate('discover.bucketIntervalTooltip.tooManyBucketsText', {
                                        defaultMessage: 'too many buckets',
                                    }),
                                bucketIntervalDescription,
                            },
                        }), color: "warning", size: "s", type: "alert" })) : undefined })))));
}
exports.TimechartHeader = TimechartHeader;
