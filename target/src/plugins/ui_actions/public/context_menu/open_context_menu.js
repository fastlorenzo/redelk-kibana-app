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
exports.ContextMenuSession = exports.openContextMenu = exports.createInteractionPositionTracker = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const events_1 = require("events");
const react_dom_1 = tslib_1.__importDefault(require("react-dom"));
let activeSession = null;
const CONTAINER_ID = 'contextMenu-container';
/**
 * Tries to find best position for opening context menu using mousemove and click event
 * Returned position is relative to document
 */
function createInteractionPositionTracker() {
    let lastMouseX = 0;
    let lastMouseY = 0;
    const lastClicks = [];
    const MAX_LAST_CLICKS = 10;
    /**
     * Track both `mouseup` and `click`
     * `mouseup` is for clicks and brushes with mouse
     * `click` is a fallback for keyboard interactions
     */
    document.addEventListener('mouseup', onClick, true);
    document.addEventListener('click', onClick, true);
    document.addEventListener('mousemove', onMouseUpdate, { passive: true });
    document.addEventListener('mouseenter', onMouseUpdate, { passive: true });
    function onClick(event) {
        lastClicks.push({
            el: event.target,
            mouseX: event.clientX,
            mouseY: event.clientY,
        });
        if (lastClicks.length > MAX_LAST_CLICKS) {
            lastClicks.shift();
        }
    }
    function onMouseUpdate(event) {
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }
    return {
        resolveLastPosition: () => {
            const lastClick = [...lastClicks]
                .reverse()
                .find(({ el }) => el && document.body.contains(el));
            if (!lastClick) {
                // fallback to last mouse position
                return {
                    x: lastMouseX,
                    y: lastMouseY,
                };
            }
            const { top, left, bottom, right } = lastClick.el.getBoundingClientRect();
            const mouseX = lastClick.mouseX;
            const mouseY = lastClick.mouseY;
            if (top <= mouseY && bottom >= mouseY && left <= mouseX && right >= mouseX) {
                // click was inside target element
                return {
                    x: mouseX,
                    y: mouseY,
                };
            }
            else {
                // keyboard edge case. no cursor position. use target element position instead
                return {
                    x: left + (right - left) / 2,
                    y: bottom,
                };
            }
        },
    };
}
exports.createInteractionPositionTracker = createInteractionPositionTracker;
const { resolveLastPosition } = createInteractionPositionTracker();
function getOrCreateContainerElement() {
    let container = document.getElementById(CONTAINER_ID);
    let { x, y } = resolveLastPosition();
    y = y + window.scrollY;
    x = x + window.scrollX;
    if (!container) {
        container = document.createElement('div');
        container.style.left = x + 'px';
        container.style.top = y + 'px';
        container.style.position = 'absolute';
        // EUI tooltip uses 9000
        // have to make it larger to display menu on top of tooltips from charts
        container.style.zIndex = '9999';
        container.id = CONTAINER_ID;
        document.body.appendChild(container);
    }
    else {
        container.style.left = x + 'px';
        container.style.top = y + 'px';
    }
    return container;
}
/**
 * A FlyoutSession describes the session of one opened flyout panel. It offers
 * methods to close the flyout panel again. If you open a flyout panel you should make
 * sure you call {@link ContextMenuSession#close} when it should be closed.
 * Since a flyout could also be closed without calling this method (e.g. because
 * the user closes it), you must listen to the "closed" event on this instance.
 * It will be emitted whenever the flyout will be closed and you should throw
 * away your reference to this instance whenever you receive that event.
 * @extends EventEmitter
 */
class ContextMenuSession extends events_1.EventEmitter {
    /**
     * Closes the opened flyout as long as it's still the open one.
     * If this is not the active session anymore, this method won't do anything.
     * If this session was still active and a flyout was closed, the 'closed'
     * event will be emitted on this FlyoutSession instance.
     */
    close() {
        if (activeSession === this) {
            const container = document.getElementById(CONTAINER_ID);
            if (container) {
                react_dom_1.default.unmountComponentAtNode(container);
                this.emit('closed');
            }
        }
    }
}
exports.ContextMenuSession = ContextMenuSession;
/**
 * Opens a flyout panel with the given component inside. You can use
 * {@link ContextMenuSession#close} on the return value to close the flyout.
 *
 * @param flyoutChildren - Mounts the children inside a fly out panel
 * @return {FlyoutSession} The session instance for the opened flyout panel.
 */
function openContextMenu(panels, props = {}) {
    // If there is an active inspector session close it before opening a new one.
    if (activeSession) {
        activeSession.close();
    }
    const container = getOrCreateContainerElement();
    const session = (activeSession = new ContextMenuSession());
    const onClose = () => {
        if (props.onClose) {
            props.onClose();
        }
        session.close();
    };
    react_dom_1.default.render(react_1.default.createElement(eui_1.EuiPopover, { className: "embPanel__optionsMenuPopover", button: container, isOpen: true, closePopover: onClose, panelPaddingSize: "none", anchorPosition: "downRight", withTitle: true, ownFocus: true },
        react_1.default.createElement(eui_1.EuiContextMenu, { initialPanelId: "mainMenu", panels: panels, "data-test-subj": props['data-test-subj'] })), container);
    return session;
}
exports.openContextMenu = openContextMenu;
