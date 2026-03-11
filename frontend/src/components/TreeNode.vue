<template>
  <li class="tree-node">
    <div
      class="node-row"
      :class="{ 'node-row--selected': isSelected }"
      :style="{ paddingLeft: depth * 16 + 8 + 'px' }"
      @click="handleClick"
    >
      <!-- Toggle arrow for folders -->
      <span v-if="node.type === 'folder'" class="toggle-icon">
        <svg v-if="isOpen" width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <path d="M0 3l5 5 5-5H0z"/>
        </svg>
        <svg v-else width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <path d="M3 0l5 5-5 5V0z"/>
        </svg>
      </span>
      <span v-else class="toggle-icon"></span>

      <!-- Icon -->
      <span class="node-icon">
        <template v-if="node.type === 'folder'">
          {{ isOpen ? '📂' : '📁' }}
        </template>
        <template v-else>{{ fileIcon(node.name) }}</template>
      </span>

      <span class="node-name">{{ node.name }}</span>

      <!-- Delete button -->
      <button class="delete-btn" @click.stop="$emit('delete', node._id)" title="Delete">✕</button>
    </div>

    <!-- Children (lazy loaded) -->
    <ul v-if="isOpen && node.type === 'folder'" class="children-list">
      <li v-if="loading" class="loading-item" :style="{ paddingLeft: (depth + 1) * 16 + 8 + 'px' }">
        Loading...
      </li>
      <template v-else>
        <TreeNode
          v-for="child in children"
          :key="child._id"
          :node="child"
          :depth="depth + 1"
          @delete="$emit('delete', $event)"
          @refresh="fetchChildren"
        />
        <li v-if="children.length === 0" class="empty-item" :style="{ paddingLeft: (depth + 1) * 16 + 8 + 'px' }">
          (empty folder)
        </li>
      </template>
    </ul>
  </li>
</template>

<script setup>
import { ref } from 'vue';
import { getChildren } from '../api/nodes';

const props = defineProps({
  node: { type: Object, required: true },
  depth: { type: Number, default: 0 },
});

const emit = defineEmits(['delete', 'refresh']);

const isOpen = ref(false);
const isSelected = ref(false);
const loading = ref(false);
const children = ref([]);
const loaded = ref(false); // Lazy-load flag

async function fetchChildren() {
  loading.value = true;
  try {
    const { data } = await getChildren(props.node._id);
    children.value = data;
    loaded.value = true;
  } catch (e) {
    console.error('Failed to fetch children:', e);
  } finally {
    loading.value = false;
  }
}

async function handleClick() {
  isSelected.value = true;
  if (props.node.type === 'folder') {
    isOpen.value = !isOpen.value;
    // Lazy load: only fetch once on first open
    if (isOpen.value && !loaded.value) {
      await fetchChildren();
    }
  }
  setTimeout(() => (isSelected.value = false), 300);
}

function fileIcon(name) {
  const ext = name.split('.').pop().toLowerCase();
  const icons = {
    js: '🟨', vue: '💚', ts: '🔷', json: '📋',
    md: '📝', html: '🌐', css: '🎨', png: '🖼️',
    jpg: '🖼️', ico: '🔖', txt: '📄',
  };
  return icons[ext] || '📄';
}

// Expose for parent refresh
defineExpose({ fetchChildren });
</script>

<style scoped>
.tree-node { list-style: none; }

.node-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px 4px 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s;
  user-select: none;
}
.node-row:hover { background: #313244; }
.node-row--selected { background: #45475a; }

.toggle-icon { width: 12px; flex-shrink: 0; color: #7f849c; }
.node-icon { font-size: 14px; }
.node-name { flex: 1; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.delete-btn {
  opacity: 0;
  background: none;
  border: none;
  color: #f38ba8;
  cursor: pointer;
  font-size: 11px;
  padding: 2px 4px;
  border-radius: 3px;
  transition: opacity 0.15s, background 0.15s;
}
.node-row:hover .delete-btn { opacity: 1; }
.delete-btn:hover { background: #f38ba820; }

.children-list { list-style: none; }
.loading-item, .empty-item { font-size: 12px; color: #7f849c; padding: 3px 0; }
</style>
