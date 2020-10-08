import Chance from 'chance';

const chance = new Chance();
const CHARS_POOL = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

export const getRandomString = () => `${chance.string({pool: CHARS_POOL})}-${Date.now()}`;
