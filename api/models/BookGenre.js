'use strict';

const { BaseModel } = require('./BaseModel');

class BookGenre extends BaseModel {
    // Table name is the only required property.
    static get tableName() {
        return 'book_genres';
    }
}

module.exports = {
    BookGenre
};
