'use strict';

const path = require('path');

const { BaseModel } = require('./BaseModel');

class Chapter extends BaseModel {
    // Table name is the only required property.
    static get tableName() {
        return 'chapters';
    }

    static relationMappings = {
        chapter_version: {
            relation: BaseModel.HasManyRelation,
            modelClass: path.join(__dirname, 'ChapterVersion'),
            join: {
                from: 'chapters.id',
                to: 'chapter_versions.chapter_id'
            }
        }
    };
}

module.exports = {
    Chapter
};
