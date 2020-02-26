'use strict';

const path = require('path');

const { BaseModel } = require('./BaseModel');

class SceneLocation extends BaseModel {
    // Table name is the only required property.
    static get tableName() {
        return 'scene_locations';
    }

    static get idColumn() { return ["id"]; }

    static relationMappings = {
        scene: {
            relation: BaseModel.HasOneRelation,
            modelClass: path.join(__dirname, 'Scene'),
            join: {
                from: 'scene_items.scene_id',
                to: 'scenes.id'
            }
        },
        location: {
            relation: BaseModel.BelongsToOneRelation,
            modelClass: path.join(__dirname, 'Location'),
            join: {
                from: 'scene_locations.location_id',
                to: 'locations.id'
            }
        },
    }
}

module.exports = {
    SceneLocation
};
