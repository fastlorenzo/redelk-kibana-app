"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultEmbeddableFactoryProvider = void 0;
exports.defaultEmbeddableFactoryProvider = (def) => {
    const factory = {
        isContainerType: def.isContainerType ?? false,
        canCreateNew: def.canCreateNew ? def.canCreateNew.bind(def) : () => true,
        getDefaultInput: def.getDefaultInput ? def.getDefaultInput.bind(def) : () => ({}),
        getExplicitInput: def.getExplicitInput
            ? def.getExplicitInput.bind(def)
            : () => Promise.resolve({}),
        createFromSavedObject: def.createFromSavedObject ??
            ((savedObjectId, input, parent) => {
                throw new Error(`Creation from saved object not supported by type ${def.type}`);
            }),
        create: def.create.bind(def),
        type: def.type,
        isEditable: def.isEditable.bind(def),
        getDisplayName: def.getDisplayName.bind(def),
        savedObjectMetaData: def.savedObjectMetaData,
    };
    return factory;
};
