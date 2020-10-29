"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomString = void 0;
const tslib_1 = require("tslib");
const chance_1 = tslib_1.__importDefault(require("chance"));
const chance = new chance_1.default();
const CHARS_POOL = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
exports.getRandomString = () => `${chance.string({ pool: CHARS_POOL })}-${Date.now()}`;
