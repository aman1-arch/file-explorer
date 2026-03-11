<template>
  <aside class="sidebar">
    <div class="sidebar__header">
      <span>📁 File Explorer</span>
      <button class="new-btn" @click="showModal = true" title="New file or folder">+</button>
    </div>

    <div class="sidebar__body">
      <ul v-if="nodes.length" class="root-list">
        <TreeNode
          v-for="node in nodes"
          :key="node._id"
          :node="node"
          :depth="0"
          @delete="handleDelete"
        />
      </ul>
      <p v-else class="empty-state">No files yet. Click + to create one.</p>
    </div>

    <!-- Create Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <h3>Create New</h3>
        <div class="modal-field">
          <label>Name</label>
          <input v-model="newName" placeholder="e.g. index.js" @keyup.enter="createItem" />
        </div>
        <div class="modal-field">
          <label>Type</label>
          <div class="type-toggle">
            <button :class="{ active: newType === 'file' }" @click="newType = 'file'">📄 File</button>
            <button :class="{ active: newType === 'folder' }" @click="newType = 'folder'">📁 Folder</button>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showModal = false">Cancel</button>
          <button class="btn-create" @click="createItem" :disabled="!newName.trim()">Create</button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TreeNode from './TreeNode.vue';
import { getRootNodes, createNode, deleteNode } from '../api/nodes';

const nodes = ref([]);
const showModal = ref(false);
const newName = ref('');
const newType = ref('file');

async function load() {
  try {
    const { data } = await getRootNodes();
    nodes.value = data;
  } catch (e) {
    console.error('Failed to load root nodes:', e);
  }
}

async function createItem() {
  if (!newName.value.trim()) return;
  try {
    await createNode({ name: newName.value.trim(), type: newType.value, parentId: null });
    newName.value = '';
    newType.value = 'file';
    showModal.value = false;
    await load();
  } catch (e) {
    console.error('Failed to create node:', e);
  }
}

async function handleDelete(id) {
  if (!confirm('Delete this item and all its contents?')) return;
  try {
    await deleteNode(id);
    await load();
  } catch (e) {
    console.error('Failed to delete node:', e);
  }
}

onMounted(load);
</script>

<style scoped>
.sidebar {
  width: 280px;
  min-width: 200px;
  background: #181825;
  border-right: 1px solid #313244;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #89b4fa;
  border-bottom: 1px solid #313244;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.new-btn {
  background: #313244;
  border: none;
  color: #cdd6f4;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  transition: background 0.15s;
}
.new-btn:hover { background: #45475a; }

.sidebar__body { flex: 1; overflow-y: auto; padding: 6px 0; }
.root-list { list-style: none; }
.empty-state { font-size: 12px; color: #7f849c; padding: 16px; text-align: center; }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0;
  background: #00000080;
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
}
.modal {
  background: #1e1e2e;
  border: 1px solid #45475a;
  border-radius: 10px;
  padding: 24px;
  width: 320px;
  display: flex; flex-direction: column; gap: 16px;
}
.modal h3 { color: #cdd6f4; font-size: 15px; }
.modal-field { display: flex; flex-direction: column; gap: 6px; }
.modal-field label { font-size: 12px; color: #7f849c; }
.modal-field input {
  background: #313244; border: 1px solid #45475a; color: #cdd6f4;
  padding: 8px 10px; border-radius: 6px; font-size: 13px; outline: none;
}
.modal-field input:focus { border-color: #89b4fa; }
.type-toggle { display: flex; gap: 8px; }
.type-toggle button {
  flex: 1; padding: 7px; background: #313244; border: 1px solid #45475a;
  color: #7f849c; border-radius: 6px; cursor: pointer; font-size: 13px;
  transition: all 0.15s;
}
.type-toggle button.active { background: #89b4fa20; border-color: #89b4fa; color: #89b4fa; }
.modal-actions { display: flex; gap: 8px; justify-content: flex-end; }
.btn-cancel {
  background: none; border: 1px solid #45475a; color: #7f849c;
  padding: 7px 14px; border-radius: 6px; cursor: pointer; font-size: 13px;
}
.btn-cancel:hover { background: #313244; }
.btn-create {
  background: #89b4fa; border: none; color: #1e1e2e;
  padding: 7px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;
}
.btn-create:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-create:not(:disabled):hover { background: #b4befe; }
</style>
