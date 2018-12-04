const got = require('got');
const Docs = require('../services/docs');

const isString = str => typeof str === 'string';
const isStringMaxLength = length => str => isString(str) && str.length <= length;
const matchRegex = regex => str => isString(str) && str.match(regex) !== null;
const isOneOf = (...values) => str => values.includes(str);
const is = isOneOf;
const all = (...fns) => async (...args) => {
    for (const fn of fns) {
        if (!await fn(...args)) return false;
    }
    return true;
};
const any = (...fns) => async (...args) => {
    for (const fn of fns) {
        if (await fn(...args)) return true;
    }
    return false;
};

const validators = {
    msgs: [
        {
            type: is('image'),
            url: async url => {
                if (typeof url !== 'string') return false;
                // validate image
                let res;
                try {
                    res = await got.head(url);
                } catch (err) {
                    return false;
                }
                if (!res.headers['content-type']) return false;
                if (!res.headers['content-type'].startsWith('image/')) return false;
                return true;
            }
        },
        {
            type: is('chara'),
            content: isStringMaxLength(10000),
            charaId: async (charaId, { namespace }) => {
                if (typeof charaId !== 'string') return false;
                return Docs.exists(namespace, 'charas', charaId)
            },
        },
        {
            type: isOneOf('narrator', 'ooc'),
            content: isStringMaxLength(10000),
        }
    ],
    charas: [
        {
            name: isStringMaxLength(30),
            color: matchRegex(/^#[0-9a-f]{6}$/g),
        }
    ],
    meta: [
        {
            title: isStringMaxLength(30),
            desc: any(is(undefined), isStringMaxLength(255)),
        }
    ]
};

module.exports = {
    async validate(namespace, collection, body) {
        // Only JS objects can be validated here
        if (typeof body !== 'object') throw new Error("Tried to validate a non-object")

        // Get the validator(s) for the specified collection
        const validatorGroup = validators[collection];
        if (!validatorGroup) throw new Error('Invalid collection');

        // Iterate through the array of possible validators for this collection
        // Only one of them has to succeed
        for (const possibleValidator of validatorGroup) {
            let failed = false;
            // Make sure every property passes its test
            for (const prop of Object.keys(possibleValidator)) {
                const propTester = possibleValidator[prop]
                const isPropValid = await propTester(body[prop], { namespace });
                if (isPropValid === true) {
                    continue;
                }
                else if (isPropValid === false) {
                    failed = true;
                    break;
                }
                else {
                    throw new Error("Validator working incorrectly");
                }
            }
            // If any property failed, try the next validator option
            if (failed) {
                continue;
            }
            // Make sure there's no extra properties
            if (!Object.keys(body).every(prop => possibleValidator[prop] != null)) {
                continue;
            }
            // This validator worked. Success
            return true;
        }
        // No validators in this group worked. Fail
        throw new Error('Invalid object');
    }
};