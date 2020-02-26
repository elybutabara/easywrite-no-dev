'use strict';

const path = require('path');

const { BaseModel } = require('./BaseModel');

class SceneVersion extends BaseModel {
    // Table name is the only required property.
    static get tableName() {
        return 'scene_versions';
    }

    static get idColumn() { return ["id"]; }

    static relationMappings = {
        scene: {
            relation: BaseModel.BelongsToOneRelation,
            modelClass: path.join(__dirname, 'Scene'),
            join: {
                from: 'scene_versions.scene_id',
                to: 'scenes.id'
            }
        }
    }
}

module.exports = {
    SceneVersion
};
