"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedObjectLoader = void 0;
const string_utils_1 = require("./helpers/string_utils");
/**
 * The SavedObjectLoader class provides some convenience functions
 * to load and save one kind of saved objects (specified in the constructor).
 *
 * It is based on the SavedObjectClient which implements loading and saving
 * in an abstract, type-agnostic way. If possible, use SavedObjectClient directly
 * to avoid pulling in extra functionality which isn't used.
 */
class SavedObjectLoader {
    constructor(SavedObjectClass, savedObjectsClient, chrome) {
        this.savedObjectsClient = savedObjectsClient;
        this.chrome = chrome;
        this.type = SavedObjectClass.type;
        this.Class = SavedObjectClass;
        this.lowercaseType = this.type.toLowerCase();
        this.loaderProperties = {
            name: `${this.lowercaseType}s`,
            noun: string_utils_1.StringUtils.upperFirst(this.type),
            nouns: `${this.lowercaseType}s`,
        };
    }
    /**
     * Retrieve a saved object by id or create new one.
     * Returns a promise that completes when the object finishes
     * initializing.
     * @param opts
     * @returns {Promise<SavedObject>}
     */
    async get(opts) {
        // can accept object as argument in accordance to SavedVis class
        // see src/plugins/saved_objects/public/saved_object/saved_object_loader.ts
        // @ts-ignore
        const obj = new this.Class(opts);
        return obj.init();
    }
    urlFor(id) {
        return `#/${this.lowercaseType}/${encodeURIComponent(id)}`;
    }
    async delete(ids) {
        const idsUsed = !Array.isArray(ids) ? [ids] : ids;
        const deletions = idsUsed.map((id) => {
            // @ts-ignore
            const savedObject = new this.Class(id);
            return savedObject.delete();
        });
        await Promise.all(deletions);
        const coreNavLinks = this.chrome.navLinks;
        /**
         * Modify last url for deleted saved objects to avoid loading pages with "Could not locate..."
         */
        coreNavLinks
            .getAll()
            .filter((link) => link.linkToLastSubUrl &&
            idsUsed.find((deletedId) => link.url && link.url.includes(deletedId)) !== undefined)
            .forEach((link) => coreNavLinks.update(link.id, { url: link.baseUrl }));
    }
    /**
     * Updates source to contain an id and url field, and returns the updated
     * source object.
     * @param source
     * @param id
     * @returns {source} The modified source object, with an id and url field.
     */
    mapHitSource(source, id) {
        source.id = id;
        source.url = this.urlFor(id);
        return source;
    }
    /**
     * Updates hit.attributes to contain an id and url field, and returns the updated
     * attributes object.
     * @param hit
     * @returns {hit.attributes} The modified hit.attributes object, with an id and url field.
     */
    mapSavedObjectApiHits(hit) {
        return this.mapHitSource(hit.attributes, hit.id);
    }
    /**
     * TODO: Rather than use a hardcoded limit, implement pagination. See
     * https://github.com/elastic/kibana/issues/8044 for reference.
     *
     * @param search
     * @param size
     * @param fields
     * @returns {Promise}
     */
    findAll(search = '', size = 100, fields) {
        return this.savedObjectsClient
            .find({
            type: this.lowercaseType,
            search: search ? `${search}*` : undefined,
            perPage: size,
            page: 1,
            searchFields: ['title^3', 'description'],
            defaultSearchOperator: 'AND',
            fields,
        })
            .then((resp) => {
            return {
                total: resp.total,
                hits: resp.savedObjects.map((savedObject) => this.mapSavedObjectApiHits(savedObject)),
            };
        });
    }
    find(search = '', size = 100) {
        return this.findAll(search, size).then((resp) => {
            return {
                total: resp.total,
                hits: resp.hits.filter((savedObject) => !savedObject.error),
            };
        });
    }
}
exports.SavedObjectLoader = SavedObjectLoader;
