const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const Node = require('../models/Node');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/file-explorer';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await Node.deleteMany({});
  console.log('Cleared existing nodes');

  // Root folders
  const src = await Node.create({ name: 'src', type: 'folder', parentId: null });
  const public_ = await Node.create({ name: 'public', type: 'folder', parentId: null });
  await Node.create({ name: 'README.md', type: 'file', parentId: null });
  await Node.create({ name: 'package.json', type: 'file', parentId: null });

  // src children
  const components = await Node.create({ name: 'components', type: 'folder', parentId: src._id });
  const api = await Node.create({ name: 'api', type: 'folder', parentId: src._id });
  await Node.create({ name: 'App.vue', type: 'file', parentId: src._id });
  await Node.create({ name: 'main.js', type: 'file', parentId: src._id });

  // components children
  await Node.create({ name: 'TreeNode.vue', type: 'file', parentId: components._id });
  await Node.create({ name: 'Sidebar.vue', type: 'file', parentId: components._id });
  await Node.create({ name: 'FileIcon.vue', type: 'file', parentId: components._id });

  // api children
  await Node.create({ name: 'nodes.js', type: 'file', parentId: api._id });

  // public children
  await Node.create({ name: 'index.html', type: 'file', parentId: public_._id });
  await Node.create({ name: 'favicon.ico', type: 'file', parentId: public_._id });

  console.log('✅ Database seeded successfully!');
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
