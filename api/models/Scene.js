'use strict';

const path = require('path');

const { BaseModel } = require('./BaseModel');

class Scene extends BaseModel {
    // Table name is the only required property.
    static get tableName() {
        return 'scenes';
    }

    static get idColumn() { return ["id"]; }

    static relationMappings = {
        scene_version: {
            relation: BaseModel.HasManyRelation,
            modelClass: path.join(__dirname, 'SceneVersion'),
            join: {
                from: 'scenes.id',
                to: 'scene_versions.scene_id'
            }
        },
        scene_character: {
            relation: BaseModel.HasManyRelation,
            modelClass: path.join(__dirname, 'SceneCharacter'),
            join: {
                from: 'scenes.id',
                to: 'scene_characters.scene_id'
            }
        },
        scene_location: {
            relation: BaseModel.HasManyRelation,
            modelClass: path.join(__dirname, 'SceneLocation'),
            join: {
                from: 'scenes.id',
                to: 'scene_locations.scene_id'
            }
        },
        scene_item: {
            relation: BaseModel.HasManyRelation,
            modelClass: path.join(__dirname, 'SceneItem'),
            join: {
                from: 'scenes.id',
                to: 'scene_items.scene_id'
            }
        }
    }
}

module.exports = {
    Scene
};
