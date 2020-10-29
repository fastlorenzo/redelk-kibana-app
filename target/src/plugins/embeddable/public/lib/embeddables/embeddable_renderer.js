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
exports.EmbeddableRenderer = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const embeddable_root_1 = require("./embeddable_root");
const error_embeddable_1 = require("./error_embeddable");
function isWithEmbeddable(props) {
    return 'embeddable' in props;
}
function isWithFactory(props) {
    return 'factory' in props;
}
/**
 * Helper react component to render an embeddable
 * Can be used if you have an embeddable object or an embeddable factory
 * Supports updating input by passing `input` prop
 *
 * @remarks
 * This component shouldn't be used inside an embeddable container to render embeddable children
 * because children may lose inherited input, here is why:
 *
 * When passing `input` inside a prop, internally there is a call:
 *
 * ```ts
 * embeddable.updateInput(input);
 * ```
 * If you are simply rendering an embeddable, it's no problem.
 *
 * However when you are dealing with containers,
 * you want to be sure to only pass into updateInput the actual state that changed.
 * This is because calling child.updateInput({ foo }) will make foo explicit state.
 * It cannot be inherited from it's parent.
 *
 * For example, on a dashboard, the time range is inherited by all children,
 * unless they had their time range set explicitly.
 * This is how "per panel time range" works.
 * That action calls embeddable.updateInput({ timeRange }),
 * and the time range will no longer be inherited from the container.
 *
 * see: https://github.com/elastic/kibana/pull/67783#discussion_r435447657 for more details.
 * refer to: examples/embeddable_explorer for examples with correct usage of this component.
 *
 * @public
 * @param props - {@link EmbeddableRendererProps}
 */
exports.EmbeddableRenderer = (props) => {
    const { input, onInputUpdated } = props;
    const [embeddable, setEmbeddable] = react_1.useState(isWithEmbeddable(props) ? props.embeddable : undefined);
    const [loading, setLoading] = react_1.useState(!isWithEmbeddable(props));
    const [error, setError] = react_1.useState();
    const latestInput = react_1.default.useRef(props.input);
    react_1.useEffect(() => {
        latestInput.current = input;
    }, [input]);
    const factoryFromProps = isWithFactory(props) ? props.factory : undefined;
    const embeddableFromProps = isWithEmbeddable(props) ? props.embeddable : undefined;
    react_1.useEffect(() => {
        let canceled = false;
        if (embeddableFromProps) {
            setEmbeddable(embeddableFromProps);
            return;
        }
        // keeping track of embeddables created by this component to be able to destroy them
        let createdEmbeddableRef;
        if (factoryFromProps) {
            setEmbeddable(undefined);
            setLoading(true);
            factoryFromProps
                .create(latestInput.current)
                .then((createdEmbeddable) => {
                if (canceled) {
                    if (createdEmbeddable) {
                        createdEmbeddable.destroy();
                    }
                }
                else {
                    createdEmbeddableRef = createdEmbeddable;
                    setEmbeddable(createdEmbeddable);
                }
            })
                .catch((err) => {
                if (canceled)
                    return;
                setError(err?.message);
            })
                .finally(() => {
                if (canceled)
                    return;
                setLoading(false);
            });
        }
        return () => {
            canceled = true;
            if (createdEmbeddableRef) {
                createdEmbeddableRef.destroy();
            }
        };
    }, [factoryFromProps, embeddableFromProps]);
    react_1.useEffect(() => {
        if (!embeddable)
            return;
        if (error_embeddable_1.isErrorEmbeddable(embeddable))
            return;
        if (!onInputUpdated)
            return;
        const sub = embeddable.getInput$().subscribe((newInput) => {
            onInputUpdated(newInput);
        });
        return () => {
            sub.unsubscribe();
        };
    }, [embeddable, onInputUpdated]);
    return react_1.default.createElement(embeddable_root_1.EmbeddableRoot, { embeddable: embeddable, loading: loading, error: error, input: input });
};
