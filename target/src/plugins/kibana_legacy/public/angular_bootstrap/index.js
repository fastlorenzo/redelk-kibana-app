"use strict";
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAngularBootstrap = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const angular_1 = tslib_1.__importDefault(require("angular"));
// @ts-ignore
const bind_html_1 = require("./bind_html/bind_html");
// @ts-ignore
const tooltip_1 = require("./tooltip/tooltip");
const tooltip_popup_html_1 = tslib_1.__importDefault(require("./tooltip/tooltip_popup.html"));
const tooltip_html_unsafe_popup_html_1 = tslib_1.__importDefault(require("./tooltip/tooltip_html_unsafe_popup.html"));
exports.initAngularBootstrap = lodash_1.once(() => {
    /*
   * angular-ui-bootstrap
   * http://angular-ui.github.io/bootstrap/
  
   * Version: 0.12.1 - 2015-02-20
   * License: MIT
   */
    angular_1.default.module('ui.bootstrap', [
        'ui.bootstrap.tpls',
        'ui.bootstrap.bindHtml',
        'ui.bootstrap.tooltip',
    ]);
    angular_1.default.module('ui.bootstrap.tpls', [
        'template/tooltip/tooltip-html-unsafe-popup.html',
        'template/tooltip/tooltip-popup.html',
    ]);
    bind_html_1.initBindHtml();
    tooltip_1.initBootstrapTooltip();
    angular_1.default.module('template/tooltip/tooltip-html-unsafe-popup.html', []).run([
        '$templateCache',
        function ($templateCache) {
            $templateCache.put('template/tooltip/tooltip-html-unsafe-popup.html', tooltip_html_unsafe_popup_html_1.default);
        },
    ]);
    angular_1.default.module('template/tooltip/tooltip-popup.html', []).run([
        '$templateCache',
        function ($templateCache) {
            $templateCache.put('template/tooltip/tooltip-popup.html', tooltip_popup_html_1.default);
        },
    ]);
});
