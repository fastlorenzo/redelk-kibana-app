"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoverIndexPattern = void 0;
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
const react_2 = require("@kbn/i18n/react");
const change_indexpattern_1 = require("./change_indexpattern");
/**
 * Component allows you to select an index pattern in discovers side bar
 */
function DiscoverIndexPattern({ indexPatternList, selectedIndexPattern, setIndexPattern, }) {
    const options = (indexPatternList || []).map((entity) => ({
        id: entity.id,
        title: entity.attributes.title,
    }));
    const { id: selectedId, title: selectedTitle } = selectedIndexPattern || {};
    const [selected, setSelected] = react_1.useState({
        id: selectedId,
        title: selectedTitle || '',
    });
    react_1.useEffect(() => {
        const { id, title } = selectedIndexPattern;
        setSelected({ id, title });
    }, [selectedIndexPattern]);
    if (!selectedId) {
        return null;
    }
    return (react_1.default.createElement("div", { className: "dscIndexPattern__container" },
        react_1.default.createElement(react_2.I18nProvider, null,
            react_1.default.createElement(change_indexpattern_1.ChangeIndexPattern, { trigger: {
                    label: selected.title,
                    title: selected.title,
                    'data-test-subj': 'indexPattern-switch-link',
                    className: 'dscIndexPattern__triggerButton',
                }, indexPatternId: selected.id, indexPatternRefs: options, onChangeIndexPattern: (id) => {
                    const indexPattern = options.find((pattern) => pattern.id === id);
                    if (indexPattern) {
                        setIndexPattern(id);
                        setSelected(indexPattern);
                    }
                } }))));
}
exports.DiscoverIndexPattern = DiscoverIndexPattern;
