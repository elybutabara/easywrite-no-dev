'use strict';

const { BaseModel } = require('./BaseModel');

class Location extends BaseModel {
    // Table name is the only required property.
    static get tableName() {
        return 'locations';
    }
}

module.exports = {
    Location
};
