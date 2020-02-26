'use strict';

const path = require('path');

const { BaseModel } = require('./BaseModel');

class SceneCharacter extends BaseModel {
    // Table name is the only required property.
    static get tableName() {
        return 'scene_characters';
    }

    static get idColumn() { return ["id"]; }

    static relationMappings = {
        scene: {
            relation: BaseModel.BelongsToOneRelation,
            modelClass: path.join(__dirname, 'Scene'),
            join: {
                from: 'scene_characters.scene_id',
                to: 'scenes.id'
            }
        },
        character: {
            relation: BaseModel.BelongsToOneRelation,
            modelClass: path.join(__dirname, 'Character'),
            join: {
                from: 'scene_characters.character_id',
                to: 'characters.id'
            }
        },
    }
}

module.exports = {
    SceneCharacter
};
