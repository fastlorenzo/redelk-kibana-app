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
exports.ThemeService = void 0;
const react_1 = require("react");
const rxjs_1 = require("rxjs");
const charts_1 = require("@elastic/charts");
const eui_charts_theme_1 = require("@elastic/eui/dist/eui_charts_theme");
class ThemeService {
    constructor() {
        /** Returns default charts theme */
        this.chartsDefaultTheme = eui_charts_theme_1.EUI_CHARTS_THEME_LIGHT.theme;
        this.chartsDefaultBaseTheme = charts_1.LIGHT_THEME;
        this._chartsTheme$ = new rxjs_1.BehaviorSubject(this.chartsDefaultTheme);
        this._chartsBaseTheme$ = new rxjs_1.BehaviorSubject(this.chartsDefaultBaseTheme);
        /** An observable of the current charts theme */
        this.chartsTheme$ = this._chartsTheme$.asObservable();
        /** An observable of the current charts base theme */
        this.chartsBaseTheme$ = this._chartsBaseTheme$.asObservable();
        /** A React hook for consuming the dark mode value */
        this.useDarkMode = () => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [value, update] = react_1.useState(false);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            react_1.useEffect(() => {
                const s = this.darkModeEnabled$.subscribe(update);
                return () => s.unsubscribe();
            }, []);
            return value;
        };
        /** A React hook for consuming the charts theme */
        this.useChartsTheme = () => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [value, update] = react_1.useState(this.chartsDefaultTheme);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            react_1.useEffect(() => {
                const s = this.chartsTheme$.subscribe(update);
                return () => s.unsubscribe();
            }, []);
            return value;
        };
        /** A React hook for consuming the charts theme */
        this.useChartsBaseTheme = () => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [value, update] = react_1.useState(this.chartsDefaultBaseTheme);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            react_1.useEffect(() => {
                const s = this.chartsBaseTheme$.subscribe(update);
                return () => s.unsubscribe();
            }, []);
            return value;
        };
    }
    /** An observable boolean for dark mode of kibana */
    get darkModeEnabled$() {
        if (!this._uiSettingsDarkMode$) {
            throw new Error('ThemeService not initialized');
        }
        return this._uiSettingsDarkMode$;
    }
    /** initialize service with uiSettings */
    init(uiSettings) {
        this._uiSettingsDarkMode$ = uiSettings.get$('theme:darkMode');
        this._uiSettingsDarkMode$.subscribe((darkMode) => {
            this._chartsTheme$.next(darkMode ? eui_charts_theme_1.EUI_CHARTS_THEME_DARK.theme : eui_charts_theme_1.EUI_CHARTS_THEME_LIGHT.theme);
            this._chartsBaseTheme$.next(darkMode ? charts_1.DARK_THEME : charts_1.LIGHT_THEME);
        });
    }
}
exports.ThemeService = ThemeService;
