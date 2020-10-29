"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectHeaderStyle = exports.buildCSS = void 0;
function buildCSS(maxHeight = 0, truncateGradientHeight = 15) {
    return `
.truncate-by-height {
  max-height: ${maxHeight > 0 ? `${maxHeight}px !important` : 'none'};
  display: inline-block;
}
.truncate-by-height:before {
  top:  ${maxHeight > 0 ? maxHeight - truncateGradientHeight : truncateGradientHeight * -1}px;
}
`;
}
exports.buildCSS = buildCSS;
function injectHeaderStyle(uiSettings) {
    const style = document.createElement('style');
    style.setAttribute('id', 'style-compile');
    document.getElementsByTagName('head')[0].appendChild(style);
    uiSettings.get$('truncate:maxHeight').subscribe((value) => {
        style.innerHTML = buildCSS(value);
    });
}
exports.injectHeaderStyle = injectHeaderStyle;
