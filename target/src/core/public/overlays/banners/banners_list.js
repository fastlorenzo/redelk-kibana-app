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
exports.BannersList = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
/**
 * BannersList is a list of "banners". A banner something that is displayed at the top of Kibana that may or may not
 * disappear.
 *
 * Whether or not a banner can be closed is completely up to the author of the banner. Some banners make sense to be
 * static, such as banners meant to indicate the sensitivity (e.g., classification) of the information being
 * represented.
 */
exports.BannersList = ({ banners$ }) => {
    const [banners, setBanners] = react_1.useState([]);
    react_1.useEffect(() => {
        const subscription = banners$.subscribe(setBanners);
        return () => subscription.unsubscribe();
    }, [banners$]); // Only un/re-subscribe if the Observable changes
    if (banners.length === 0) {
        return null;
    }
    return (react_1.default.createElement("div", { className: "kbnGlobalBannerList" }, banners.map((banner) => (react_1.default.createElement(BannerItem, { key: banner.id, banner: banner })))));
};
const BannerItem = ({ banner }) => {
    const element = react_1.useRef(null);
    react_1.useEffect(() => banner.mount(element.current), [banner]); // Only unmount / remount if banner object changed.
    return (react_1.default.createElement("div", { "data-test-priority": banner.priority, className: "kbnGlobalBannerList__item", ref: element }));
};
