const mongoose = require('mongoose');

/**
 * Self-referencing schema:
 * - name: display name of the file/folder
 * - type: 'file' | 'folder'
 * - parentId: null for root items, ObjectId reference for nested items
 */
const nodeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['file', 'folder'],
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Node',
      default: null,
    },
  },
  { timestamps: true }
);

// Index for fast lookup by parentId
nodeSchema.index({ parentId: 1 });

module.exports = mongoose.model('Node', nodeSchema);
