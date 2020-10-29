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
exports.useEditorFormState = void 0;
const react_1 = require("react");
const initialFormState = {
    validity: {},
    touched: false,
    invalid: false,
};
function useEditorFormState() {
    const [formState, setFormState] = react_1.useState(initialFormState);
    const setValidity = react_1.useCallback((modelName, value) => {
        setFormState((model) => {
            const validity = {
                ...model.validity,
                [modelName]: value,
            };
            return {
                ...model,
                validity,
                invalid: Object.values(validity).some((valid) => !valid),
            };
        });
    }, []);
    const resetValidity = react_1.useCallback(() => {
        setFormState(initialFormState);
    }, []);
    const setTouched = react_1.useCallback((touched) => {
        setFormState((model) => ({
            ...model,
            touched,
        }));
    }, []);
    return {
        formState,
        setValidity,
        setTouched,
        resetValidity,
    };
}
exports.useEditorFormState = useEditorFormState;
