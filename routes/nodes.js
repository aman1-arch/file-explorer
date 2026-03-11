const express = require('express');
const router = express.Router();
const Node = require('../models/Node');

// GET /api/nodes — root-level nodes
router.get('/', async (req, res) => {
  try {
    const roots = await Node.find({ parentId: null }).sort({ type: -1, name: 1 });
    res.json(roots);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/nodes/:parentId/children — lazy-load children
router.get('/:parentId/children', async (req, res) => {
  try {
    const children = await Node.find({ parentId: req.params.parentId }).sort({ type: -1, name: 1 });
    res.json(children);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/nodes — create a file or folder
router.post('/', async (req, res) => {
  try {
    const { name, type, parentId } = req.body;
    if (!name || !type) return res.status(400).json({ message: 'name and type are required' });
    const node = new Node({ name, type, parentId: parentId || null });
    await node.save();
    res.status(201).json(node);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/nodes/:id — delete node + all descendants
router.delete('/:id', async (req, res) => {
  try {
    await deleteRecursive(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

async function deleteRecursive(nodeId) {
  const children = await Node.find({ parentId: nodeId });
  for (const child of children) await deleteRecursive(child._id);
  await Node.findByIdAndDelete(nodeId);
}

module.exports = router;
