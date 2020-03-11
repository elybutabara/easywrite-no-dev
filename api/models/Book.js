'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class Book extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'books'
  }

  static get idColumn () { return ['uuid'] }

    static relationMappings = {
      book_genre_collection: {
        relation: BaseModel.HasManyRelation,
        modelClass: path.join(__dirname, 'BookGenreCollection'),
        join: {
          from: 'books.id',
          to: 'book_genre_collections.book_id'
        }
      },
      genre: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: path.join(__dirname, 'BookGenre'),
        join: {
          from: 'books.id',
          through: {
            from: 'book_genre_collections.book_id',
            to: 'book_genre_collections.genre_id'
          },
          to: 'book_genres.id'
        }
      }
    };
}

module.exports = {
  Book
}
