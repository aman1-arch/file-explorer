<template>
  <div class="app">
    <Sidebar />
    <main class="main-content">
      <div class="welcome">
        <div class="welcome-icon">🗂️</div>
        <h1>Recursive File Explorer</h1>
        <p>Select a file or folder from the sidebar to explore.</p>
        <div class="tech-badges">
          <span>MongoDB</span>
          <span>Express.js</span>
          <span>Vue 3</span>
          <span>Node.js</span>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue';
</script>

<style scoped>
.app { display: flex; width: 100%; height: 100vh; }
.main-content {
  flex: 1; display: flex; align-items: center; justify-content: center;
  background: #1e1e2e;
}
.welcome { text-align: center; color: #6c7086; }
.welcome-icon { font-size: 64px; margin-bottom: 16px; }
.welcome h1 { font-size: 22px; color: #cdd6f4; margin-bottom: 8px; font-weight: 500; }
.welcome p { font-size: 14px; margin-bottom: 24px; }
.tech-badges { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
.tech-badges span {
  background: #313244; color: #89b4fa; padding: 4px 12px;
  border-radius: 20px; font-size: 12px; font-weight: 500;
}
</style>
