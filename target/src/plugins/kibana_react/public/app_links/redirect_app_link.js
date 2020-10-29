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
exports.RedirectAppLinks = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const useObservable_1 = tslib_1.__importDefault(require("react-use/lib/useObservable"));
const click_handler_1 = require("./click_handler");
/**
 * Utility component that will intercept click events on children anchor (`<a>`) elements to call
 * `application.navigateToUrl` with the link's href. This will trigger SPA friendly navigation
 * when the link points to a valid Kibana app.
 *
 * @example
 * ```tsx
 * <RedirectCrossAppLinks application={application}>
 *   <a href="/base-path/app/another-app/some-path">Go to another-app</a>
 * </RedirectCrossAppLinks>
 * ```
 *
 * @remarks
 * It is recommended to use the component at the highest possible level of the component tree that would
 * require to handle the links. A good practice is to consider it as a context provider and to use it
 * at the root level of an application or of the page that require the feature.
 */
exports.RedirectAppLinks = ({ application, children, className, ...otherProps }) => {
    const currentAppId = useObservable_1.default(application.currentAppId$, undefined);
    const containerRef = react_1.useRef(null);
    const clickHandler = react_1.useMemo(() => containerRef.current && currentAppId
        ? click_handler_1.createNavigateToUrlClickHandler({
            container: containerRef.current,
            navigateToUrl: application.navigateToUrl,
        })
        : undefined, [containerRef.current, application, currentAppId]);
    return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    react_1.default.createElement("div", Object.assign({ ref: containerRef, className: classnames_1.default(className, 'kbnRedirectCrossAppLinks'), onClick: clickHandler }, otherProps), children));
};
