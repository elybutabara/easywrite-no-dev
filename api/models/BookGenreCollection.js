'use strict';

const { BaseModel } = require('./BaseModel');

class BookGenreCollection extends BaseModel {
    // Table name is the only required property.
    static get tableName() {
        return 'book_genre_collections';
    }
}

module.exports = {
    BookGenreCollection
};
