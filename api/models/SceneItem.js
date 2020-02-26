'use strict';

const path = require('path');

const { BaseModel } = require('./BaseModel');

class SceneItem extends BaseModel {
    // Table name is the only required property.
    static get tableName() {
        return 'scene_items';
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
        item: {
            relation: BaseModel.BelongsToOneRelation,
            modelClass: path.join(__dirname, 'Item'),
            join: {
                from: 'scene_items.item_id',
                to: 'items.id'
            }
        },
    }
}

module.exports = {
    SceneItem
};
