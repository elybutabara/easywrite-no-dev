'use strict';

const { BaseModel } = require('./BaseModel');

class Relation extends BaseModel {
    // Table name is the only required property.
    static get tableName() {
        return 'relations';
    }
}

module.exports = {
    Relation
};
