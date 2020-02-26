'use strict';

const { BaseModel } = require('./BaseModel');

class Character extends BaseModel {
    // Table name is the only required property.
    static get tableName() {
        return 'characters';
    }
}

module.exports = {
    Character
};
