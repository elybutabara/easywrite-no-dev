'use strict';

const { BaseModel } = require('./BaseModel');

class Item extends BaseModel {
    // Table name is the only required property.
    static get tableName() {
        return 'items';
    }
}

module.exports = {
    Item
};
