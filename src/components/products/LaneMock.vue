<script setup lang="ts">
// 产品页轮播示意图：Lane 终端。本身就是深色 IDE 界面，页面上唯一的深色元素，
// 色值硬编码、不参与主题切换（设计决定）。纯装饰、静态文案，不做 i18n。
</script>

<template>
  <div class="mock" aria-hidden="true">
    <div class="titlebar">
      <span class="dot" /><span class="dot" /><span class="dot" />
      <span class="title">MintPop Lane</span>
      <span class="status"><span class="status-dot" />Route healthy</span>
    </div>
    <div class="body">
      <div class="sidebar">
        <div class="row row--active"><span class="row-dot row-dot--on" />lane-website</div>
        <div class="row"><span class="row-dot" />api-server</div>
        <div class="row"><span class="row-dot" />docs</div>
      </div>
      <div class="term">
        <div class="line line--mint">$ claude</div>
        <div class="line line--dim">route ready · quota linked</div>
        <div class="line">Welcome back — where to?</div>
        <div class="line line--mint">›</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mock {
  height: 348px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #0e1512;
  border: 1.5px solid #1e2a25;
  border-radius: 12px;
  box-shadow: 0 14px 34px rgba(11, 11, 12, 0.32);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.titlebar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 13px 16px;
  border-bottom: 1.5px solid #24322c;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: #3a4a43;
}

.title {
  margin-left: 8px;
  font-size: 12px;
  letter-spacing: 0.04em;
  color: #c6d2cd;
}

.status {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-sans);
  font-size: 11px;
  color: var(--accent);
}

.status-dot,
.row-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #3a4a43;
}

.status-dot,
.row-dot--on {
  background: var(--accent);
}

.body {
  flex: 1;
  display: flex;
}

.sidebar {
  flex: none;
  width: 35%;
  padding: 12px 10px;
  border-right: 1.5px solid #24322c;
  display: grid;
  gap: 6px;
  align-content: start;
}

.row {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 11px;
  font-size: 11px;
  color: #8a9994;
  white-space: nowrap;
}

.row--active {
  border-radius: 8px;
  background: #14201b;
  border: 1px solid #22322b;
  color: #e4ebe8;
}

.term {
  flex: 1;
  min-width: 0;
  padding: 16px;
  display: grid;
  gap: 9px;
  align-content: start;
  white-space: nowrap;
}

.line {
  font-size: 12px;
  color: #e4ebe8;
}

.line--mint {
  color: var(--accent);
}

.line--dim {
  font-size: 11px;
  color: #8a9994;
}
</style>
