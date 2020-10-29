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
exports.QueryStringInput = exports.QueryStringInputUI = void 0;
const tslib_1 = require("tslib");
const react_1 = require("react");
const react_2 = tslib_1.__importDefault(require("react"));
const i18n_1 = require("@kbn/i18n");
const eui_1 = require("@elastic/eui");
const react_3 = require("@kbn/i18n/react");
const lodash_1 = require("lodash");
const autocomplete_1 = require("../../autocomplete");
const public_1 = require("../../../../kibana_react/public");
const fetch_index_patterns_1 = require("./fetch_index_patterns");
const language_switcher_1 = require("./language_switcher");
const query_1 = require("../../query");
const __1 = require("..");
const KEY_CODES = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    ENTER: 13,
    ESC: 27,
    TAB: 9,
    HOME: 36,
    END: 35,
};
class QueryStringInputUI extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            isSuggestionsVisible: false,
            index: null,
            suggestions: [],
            suggestionLimit: 50,
            selectionStart: null,
            selectionEnd: null,
            indexPatterns: [],
        };
        this.inputRef = null;
        this.services = this.props.kibana.services;
        this.componentIsUnmounting = false;
        this.getQueryString = () => {
            return query_1.toUser(this.props.query.query);
        };
        this.fetchIndexPatterns = async () => {
            const stringPatterns = this.props.indexPatterns.filter((indexPattern) => typeof indexPattern === 'string');
            const objectPatterns = this.props.indexPatterns.filter((indexPattern) => typeof indexPattern !== 'string');
            const objectPatternsFromStrings = (await fetch_index_patterns_1.fetchIndexPatterns(this.services.savedObjects.client, stringPatterns, this.services.uiSettings));
            this.setState({
                indexPatterns: [...objectPatterns, ...objectPatternsFromStrings],
            });
        };
        this.getSuggestions = async () => {
            if (!this.inputRef) {
                return;
            }
            const language = this.props.query.language;
            const queryString = this.getQueryString();
            const recentSearchSuggestions = this.getRecentSearchSuggestions(queryString);
            const hasQuerySuggestions = this.services.data.autocomplete.hasQuerySuggestions(language);
            if (!hasQuerySuggestions ||
                !Array.isArray(this.state.indexPatterns) ||
                lodash_1.compact(this.state.indexPatterns).length === 0) {
                return recentSearchSuggestions;
            }
            const indexPatterns = this.state.indexPatterns;
            const { selectionStart, selectionEnd } = this.inputRef;
            if (selectionStart === null || selectionEnd === null) {
                return;
            }
            try {
                if (this.abortController)
                    this.abortController.abort();
                this.abortController = new AbortController();
                const suggestions = (await this.services.data.autocomplete.getQuerySuggestions({
                    language,
                    indexPatterns,
                    query: queryString,
                    selectionStart,
                    selectionEnd,
                    signal: this.abortController.signal,
                })) || [];
                return [...suggestions, ...recentSearchSuggestions];
            }
            catch (e) {
                // TODO: Waiting on https://github.com/elastic/kibana/issues/51406 for a properly typed error
                // Ignore aborted requests
                if (e.message === 'The user aborted a request.')
                    return;
                throw e;
            }
        };
        this.getRecentSearchSuggestions = (query) => {
            if (!this.persistedLog) {
                return [];
            }
            const recentSearches = this.persistedLog.get();
            const matchingRecentSearches = recentSearches.filter((recentQuery) => {
                const recentQueryString = typeof recentQuery === 'object' ? query_1.toUser(recentQuery) : recentQuery;
                return recentQueryString.includes(query);
            });
            return matchingRecentSearches.map((recentSearch) => {
                const text = query_1.toUser(recentSearch);
                const start = 0;
                const end = query.length;
                return { type: autocomplete_1.QuerySuggestionTypes.RecentSearch, text, start, end };
            });
        };
        this.updateSuggestions = lodash_1.debounce(async () => {
            const suggestions = (await this.getSuggestions()) || [];
            if (!this.componentIsUnmounting) {
                this.setState({ suggestions });
            }
        }, 100);
        this.onSubmit = (query) => {
            if (this.props.onSubmit) {
                if (this.persistedLog) {
                    this.persistedLog.add(query.query);
                }
                this.props.onSubmit({ query: query_1.fromUser(query.query), language: query.language });
            }
        };
        this.onChange = (query) => {
            this.updateSuggestions();
            if (this.props.onChange) {
                this.props.onChange({ query: query_1.fromUser(query.query), language: query.language });
            }
        };
        this.onQueryStringChange = (value) => {
            this.setState({
                isSuggestionsVisible: true,
                index: null,
                suggestionLimit: 50,
            });
            this.onChange({ query: value, language: this.props.query.language });
        };
        this.onInputChange = (event) => {
            this.onQueryStringChange(event.target.value);
            if (event.target.value === '') {
                this.handleRemoveHeight();
            }
            else {
                this.handleAutoHeight();
            }
        };
        this.onClickInput = (event) => {
            if (event.target instanceof HTMLTextAreaElement) {
                this.onQueryStringChange(event.target.value);
            }
        };
        this.onKeyUp = (event) => {
            if ([KEY_CODES.LEFT, KEY_CODES.RIGHT, KEY_CODES.HOME, KEY_CODES.END].includes(event.keyCode)) {
                this.setState({ isSuggestionsVisible: true });
                if (event.target instanceof HTMLTextAreaElement) {
                    this.onQueryStringChange(event.target.value);
                }
            }
        };
        this.onKeyDown = (event) => {
            if (event.target instanceof HTMLTextAreaElement) {
                const { isSuggestionsVisible, index } = this.state;
                const preventDefault = event.preventDefault.bind(event);
                const { target, key, metaKey } = event;
                const { value, selectionStart, selectionEnd } = target;
                const updateQuery = (query, newSelectionStart, newSelectionEnd) => {
                    this.onQueryStringChange(query);
                    this.setState({
                        selectionStart: newSelectionStart,
                        selectionEnd: newSelectionEnd,
                    });
                };
                switch (event.keyCode) {
                    case KEY_CODES.DOWN:
                        if (isSuggestionsVisible && index !== null) {
                            event.preventDefault();
                            this.incrementIndex(index);
                            // Note to engineers. `isSuggestionVisible` does not mean the suggestions are visible.
                            // This should likely be fixed, it's more that suggestions can be shown.
                        }
                        else if ((isSuggestionsVisible && index == null) || this.getQueryString() === '') {
                            event.preventDefault();
                            this.setState({ isSuggestionsVisible: true, index: 0 });
                        }
                        break;
                    case KEY_CODES.UP:
                        if (isSuggestionsVisible && index !== null) {
                            event.preventDefault();
                            this.decrementIndex(index);
                        }
                        break;
                    case KEY_CODES.ENTER:
                        if (!this.props.bubbleSubmitEvent) {
                            event.preventDefault();
                        }
                        if (isSuggestionsVisible && index !== null && this.state.suggestions[index]) {
                            event.preventDefault();
                            this.selectSuggestion(this.state.suggestions[index]);
                        }
                        else {
                            this.onSubmit(this.props.query);
                            this.setState({
                                isSuggestionsVisible: false,
                            });
                        }
                        break;
                    case KEY_CODES.ESC:
                        event.preventDefault();
                        this.setState({ isSuggestionsVisible: false, index: null });
                        break;
                    case KEY_CODES.TAB:
                        this.setState({ isSuggestionsVisible: false, index: null });
                        break;
                    default:
                        if (selectionStart !== null && selectionEnd !== null) {
                            query_1.matchPairs({
                                value,
                                selectionStart,
                                selectionEnd,
                                key,
                                metaKey,
                                updateQuery,
                                preventDefault,
                            });
                        }
                        break;
                }
            }
        };
        this.selectSuggestion = (suggestion) => {
            if (!this.inputRef) {
                return;
            }
            const { type, text, start, end, cursorIndex } = suggestion;
            this.handleNestedFieldSyntaxNotification(suggestion);
            const query = this.getQueryString();
            const { selectionStart, selectionEnd } = this.inputRef;
            if (selectionStart === null || selectionEnd === null) {
                return;
            }
            const value = query.substr(0, selectionStart) + query.substr(selectionEnd);
            const newQueryString = value.substr(0, start) + text + value.substr(end);
            this.onQueryStringChange(newQueryString);
            this.setState({
                selectionStart: start + (cursorIndex ? cursorIndex : text.length),
                selectionEnd: start + (cursorIndex ? cursorIndex : text.length),
            });
            if (type === autocomplete_1.QuerySuggestionTypes.RecentSearch) {
                this.setState({ isSuggestionsVisible: false, index: null });
                this.onSubmit({ query: newQueryString, language: this.props.query.language });
            }
        };
        this.handleNestedFieldSyntaxNotification = (suggestion) => {
            if ('field' in suggestion &&
                suggestion.field.subType &&
                suggestion.field.subType.nested &&
                !this.services.storage.get('kibana.KQLNestedQuerySyntaxInfoOptOut')) {
                const { notifications, docLinks } = this.services;
                const onKQLNestedQuerySyntaxInfoOptOut = (toast) => {
                    if (!this.services.storage)
                        return;
                    this.services.storage.set('kibana.KQLNestedQuerySyntaxInfoOptOut', true);
                    notifications.toasts.remove(toast);
                };
                if (notifications && docLinks) {
                    const toast = notifications.toasts.add({
                        title: i18n_1.i18n.translate('data.query.queryBar.KQLNestedQuerySyntaxInfoTitle', {
                            defaultMessage: 'KQL nested query syntax',
                        }),
                        text: public_1.toMountPoint(react_2.default.createElement("div", null,
                            react_2.default.createElement("p", null,
                                react_2.default.createElement(react_3.FormattedMessage, { id: "data.query.queryBar.KQLNestedQuerySyntaxInfoText", defaultMessage: "It looks like you're querying on a nested field.\n                  You can construct KQL syntax for nested queries in different ways, depending on the results you want.\n                  Learn more in our {link}.", values: {
                                        link: (react_2.default.createElement(eui_1.EuiLink, { href: docLinks.links.query.kueryQuerySyntax, target: "_blank" },
                                            react_2.default.createElement(react_3.FormattedMessage, { id: "data.query.queryBar.KQLNestedQuerySyntaxInfoDocLinkText", defaultMessage: "docs" }))),
                                    } })),
                            react_2.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "flexEnd", gutterSize: "s" },
                                react_2.default.createElement(eui_1.EuiFlexItem, { grow: false },
                                    react_2.default.createElement(eui_1.EuiButton, { size: "s", onClick: () => onKQLNestedQuerySyntaxInfoOptOut(toast) },
                                        react_2.default.createElement(react_3.FormattedMessage, { id: "data.query.queryBar.KQLNestedQuerySyntaxInfoOptOutText", defaultMessage: "Don't show again" })))))),
                    });
                }
            }
        };
        this.increaseLimit = () => {
            this.setState({
                suggestionLimit: this.state.suggestionLimit + 50,
            });
        };
        this.incrementIndex = (currentIndex) => {
            let nextIndex = currentIndex + 1;
            if (currentIndex === null || nextIndex >= this.state.suggestions.length) {
                nextIndex = 0;
            }
            this.setState({ index: nextIndex });
        };
        this.decrementIndex = (currentIndex) => {
            const previousIndex = currentIndex - 1;
            if (previousIndex < 0) {
                this.setState({ index: this.state.suggestions.length - 1 });
            }
            else {
                this.setState({ index: previousIndex });
            }
        };
        this.onSelectLanguage = (language) => {
            // Send telemetry info every time the user opts in or out of kuery
            // As a result it is important this function only ever gets called in the
            // UI component's change handler.
            this.services.http.post('/api/kibana/kql_opt_in_telemetry', {
                body: JSON.stringify({ opt_in: language === 'kuery' }),
            });
            this.services.storage.set('kibana.userQueryLanguage', language);
            const newQuery = { query: '', language };
            this.onChange(newQuery);
            this.onSubmit(newQuery);
        };
        this.onOutsideClick = () => {
            if (this.state.isSuggestionsVisible) {
                this.setState({ isSuggestionsVisible: false, index: null });
            }
            this.handleBlurHeight();
            if (this.props.onChangeQueryInputFocus) {
                this.props.onChangeQueryInputFocus(false);
            }
        };
        this.onInputBlur = () => {
            this.handleBlurHeight();
            if (this.props.onChangeQueryInputFocus) {
                this.props.onChangeQueryInputFocus(false);
            }
            if (lodash_1.isFunction(this.props.onBlur)) {
                this.props.onBlur();
            }
        };
        this.onClickSuggestion = (suggestion) => {
            if (!this.inputRef) {
                return;
            }
            this.selectSuggestion(suggestion);
            this.inputRef.focus();
        };
        this.initPersistedLog = () => {
            const { uiSettings, storage, appName } = this.services;
            this.persistedLog = this.props.persistedLog
                ? this.props.persistedLog
                : query_1.getQueryLog(uiSettings, storage, appName, this.props.query.language);
        };
        this.onMouseEnterSuggestion = (index) => {
            this.setState({ index });
        };
        this.textareaId = eui_1.htmlIdGenerator()();
        this.handleAutoHeight = () => {
            if (this.inputRef !== null && document.activeElement === this.inputRef) {
                this.inputRef.style.setProperty('height', `${this.inputRef.scrollHeight}px`, 'important');
            }
        };
        this.handleRemoveHeight = () => {
            if (this.inputRef !== null) {
                this.inputRef.style.removeProperty('height');
            }
        };
        this.handleBlurHeight = () => {
            if (this.inputRef !== null) {
                this.handleRemoveHeight();
                this.inputRef.scrollTop = 0;
            }
        };
        this.handleOnFocus = () => {
            if (this.props.onChangeQueryInputFocus) {
                this.props.onChangeQueryInputFocus(true);
            }
            requestAnimationFrame(() => {
                this.handleAutoHeight();
            });
        };
    }
    componentDidMount() {
        const parsedQuery = query_1.fromUser(query_1.toUser(this.props.query.query));
        if (!lodash_1.isEqual(this.props.query.query, parsedQuery)) {
            this.onChange({ ...this.props.query, query: parsedQuery });
        }
        this.initPersistedLog();
        this.fetchIndexPatterns().then(this.updateSuggestions);
        window.addEventListener('resize', this.handleAutoHeight);
    }
    componentDidUpdate(prevProps) {
        const parsedQuery = query_1.fromUser(query_1.toUser(this.props.query.query));
        if (!lodash_1.isEqual(this.props.query.query, parsedQuery)) {
            this.onChange({ ...this.props.query, query: parsedQuery });
        }
        this.initPersistedLog();
        if (!lodash_1.isEqual(prevProps.indexPatterns, this.props.indexPatterns)) {
            this.fetchIndexPatterns().then(this.updateSuggestions);
        }
        else if (!lodash_1.isEqual(prevProps.query, this.props.query)) {
            this.updateSuggestions();
        }
        if (this.state.selectionStart !== null && this.state.selectionEnd !== null) {
            if (this.inputRef != null) {
                this.inputRef.setSelectionRange(this.state.selectionStart, this.state.selectionEnd);
            }
            this.setState({
                selectionStart: null,
                selectionEnd: null,
            });
            if (document.activeElement !== null && document.activeElement.id === this.textareaId) {
                this.handleAutoHeight();
            }
            else {
                this.handleRemoveHeight();
            }
        }
    }
    componentWillUnmount() {
        if (this.abortController)
            this.abortController.abort();
        this.updateSuggestions.cancel();
        this.componentIsUnmounting = true;
        window.removeEventListener('resize', this.handleAutoHeight);
    }
    render() {
        const isSuggestionsVisible = this.state.isSuggestionsVisible && {
            'aria-controls': 'kbnTypeahead__items',
            'aria-owns': 'kbnTypeahead__items',
        };
        const ariaCombobox = { ...isSuggestionsVisible, role: 'combobox' };
        return (react_2.default.createElement("div", { className: "euiFormControlLayout euiFormControlLayout--group kbnQueryBar__wrap" },
            this.props.prepend,
            react_2.default.createElement(eui_1.EuiOutsideClickDetector, { onOutsideClick: this.onOutsideClick },
                react_2.default.createElement("div", Object.assign({}, ariaCombobox, { style: { position: 'relative', width: '100%' }, "aria-label": i18n_1.i18n.translate('data.query.queryBar.comboboxAriaLabel', {
                        defaultMessage: 'Search and filter the {pageType} page',
                        values: { pageType: this.services.appName },
                    }), "aria-haspopup": "true", "aria-expanded": this.state.isSuggestionsVisible }),
                    react_2.default.createElement("div", { role: "search", className: "euiFormControlLayout__childrenWrapper kuiLocalSearchAssistedInput" },
                        react_2.default.createElement(eui_1.EuiTextArea, { placeholder: this.props.placeholder ||
                                i18n_1.i18n.translate('data.query.queryBar.searchInputPlaceholder', {
                                    defaultMessage: 'Search',
                                }), value: this.getQueryString(), onKeyDown: this.onKeyDown, onKeyUp: this.onKeyUp, onChange: this.onInputChange, onClick: this.onClickInput, onBlur: this.onInputBlur, onFocus: this.handleOnFocus, className: "kbnQueryBar__textarea", fullWidth: true, rows: 1, id: this.textareaId, autoFocus: this.props.onChangeQueryInputFocus ? false : !this.props.disableAutoFocus, inputRef: (node) => {
                                if (node) {
                                    this.inputRef = node;
                                }
                            }, autoComplete: "off", spellCheck: false, "aria-label": i18n_1.i18n.translate('data.query.queryBar.searchInputAriaLabel', {
                                defaultMessage: 'Start typing to search and filter the {pageType} page',
                                values: { pageType: this.services.appName },
                            }), "aria-autocomplete": "list", "aria-controls": this.state.isSuggestionsVisible ? 'kbnTypeahead__items' : undefined, "aria-activedescendant": this.state.isSuggestionsVisible && typeof this.state.index === 'number'
                                ? `suggestion-${this.state.index}`
                                : undefined, role: "textbox", "data-test-subj": this.props.dataTestSubj || 'queryInput' }, this.getQueryString())),
                    react_2.default.createElement(__1.SuggestionsComponent, { show: this.state.isSuggestionsVisible, suggestions: this.state.suggestions.slice(0, this.state.suggestionLimit), index: this.state.index, onClick: this.onClickSuggestion, onMouseEnter: this.onMouseEnterSuggestion, loadMore: this.increaseLimit }))),
            react_2.default.createElement(language_switcher_1.QueryLanguageSwitcher, { language: this.props.query.language, anchorPosition: this.props.languageSwitcherPopoverAnchorPosition, onSelectLanguage: this.onSelectLanguage })));
    }
}
exports.QueryStringInputUI = QueryStringInputUI;
exports.QueryStringInput = public_1.withKibana(QueryStringInputUI);
