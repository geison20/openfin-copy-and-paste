const mongoose = require('mongoose');

const workspaceMetadataSchema = new mongoose.Schema({
    APIVersion: {
        type: String,
        required: true
    }
});

const browserSnapshotWindowSchema = new mongoose.Schema({}, { strict: false });

const browserSnapshotSchema = new mongoose.Schema({
    windows: [browserSnapshotWindowSchema]
});

const workspaceSchema = new mongoose.Schema({
    workspaceId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    metadata: {
        type: workspaceMetadataSchema,
        required: false
    },
    snapshot: {
        type: browserSnapshotSchema,
        required: true
    }
});

const Workspace = mongoose.model('Workspace', workspaceSchema);

module.exports = {
    Workspace
};
