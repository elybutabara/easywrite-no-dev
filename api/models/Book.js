'use strict';

const { BaseModel } = require('./BaseModel');

class Book extends BaseModel {
    // Table name is the only required property.
    static get tableName() {
        return 'books';
    }
}

module.exports = {
    Book
};
