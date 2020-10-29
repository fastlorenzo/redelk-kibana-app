"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorialService = void 0;
class TutorialService {
    constructor() {
        this.tutorialVariables = {};
        this.tutorialDirectoryNotices = {};
        this.tutorialDirectoryHeaderLinks = {};
        this.tutorialModuleNotices = {};
    }
    setup() {
        return {
            /**
             * Set a variable usable in tutorial templates. Access with `{config.<key>}`.
             */
            setVariable: (key, value) => {
                if (this.tutorialVariables[key]) {
                    throw new Error('variable already set');
                }
                this.tutorialVariables[key] = value;
            },
            /**
             * Registers a component that will be rendered at the top of tutorial directory page.
             */
            registerDirectoryNotice: (id, component) => {
                if (this.tutorialDirectoryNotices[id]) {
                    throw new Error(`directory notice ${id} already set`);
                }
                this.tutorialDirectoryNotices[id] = component;
            },
            /**
             * Registers a component that will be rendered next to tutorial directory title/header area.
             */
            registerDirectoryHeaderLink: (id, component) => {
                if (this.tutorialDirectoryHeaderLinks[id]) {
                    throw new Error(`directory header link ${id} already set`);
                }
                this.tutorialDirectoryHeaderLinks[id] = component;
            },
            /**
             * Registers a component that will be rendered in the description of a tutorial that is associated with a module.
             */
            registerModuleNotice: (id, component) => {
                if (this.tutorialModuleNotices[id]) {
                    throw new Error(`module notice ${id} already set`);
                }
                this.tutorialModuleNotices[id] = component;
            },
        };
    }
    getVariables() {
        return this.tutorialVariables;
    }
    getDirectoryNotices() {
        return Object.values(this.tutorialDirectoryNotices);
    }
    getDirectoryHeaderLinks() {
        return Object.values(this.tutorialDirectoryHeaderLinks);
    }
    getModuleNotices() {
        return Object.values(this.tutorialModuleNotices);
    }
}
exports.TutorialService = TutorialService;
