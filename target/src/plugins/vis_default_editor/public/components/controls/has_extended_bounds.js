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
exports.HasExtendedBoundsParamEditor = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../../../data/public");
const switch_1 = require("./switch");
const { isType } = public_1.search.aggs;
function HasExtendedBoundsParamEditor(props) {
    const { agg, setValue, value } = props;
    const minDocCount = react_1.useRef(agg.params.min_doc_count);
    react_1.useEffect(() => {
        if (minDocCount.current !== agg.params.min_doc_count) {
            // The "Extend bounds" param is only enabled when "Show empty buckets" is turned on.
            // So if "Show empty buckets" is changed, "Extend bounds" should reflect changes
            minDocCount.current = agg.params.min_doc_count;
            setValue(value && agg.params.min_doc_count);
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [agg.params.min_doc_count, setValue, value]);
    return (react_1.default.createElement(switch_1.SwitchParamEditor, Object.assign({}, props, { displayLabel: i18n_1.i18n.translate('visDefaultEditor.controls.extendedBoundsLabel', {
            defaultMessage: 'Extend bounds',
        }), displayToolTip: i18n_1.i18n.translate('visDefaultEditor.controls.extendedBoundsTooltip', {
            defaultMessage: 'Min and Max do not filter the results, but rather extend the bounds of the result set.',
        }), disabled: !props.agg.params.min_doc_count ||
            !(isType('number')(props.agg) || isType('date')(props.agg)) })));
}
exports.HasExtendedBoundsParamEditor = HasExtendedBoundsParamEditor;
