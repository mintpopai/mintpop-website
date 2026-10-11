<script setup lang="ts">
// 产品页轮播示意图：API 控制台。纯装饰、静态文案，不做 i18n，不接真实数据。
// 浅色 UI，随主题走 token；数字一律 tabular-nums（基线：对齐数字是信任信号）。
</script>

<template>
  <div class="mock" aria-hidden="true">
    <div class="tabs">
      <span class="tab tab--active">Dashboard</span>
      <span class="tab">Plans</span>
      <span class="tab">Usage</span>
      <span class="tab">Keys</span>
      <span class="avatar" />
    </div>
    <div class="body">
      <div class="balance">
        <div class="balance-dots" />
        <div class="label">BALANCE · AVAILABLE</div>
        <div class="value">$382.44</div>
        <div class="underline" />
      </div>
      <div class="stats">
        <div class="stat">
          <div class="label">KEYS</div>
          <div class="num">9</div>
        </div>
        <div class="stat">
          <div class="label">REQUESTS</div>
          <div class="num">678</div>
        </div>
        <div class="stat">
          <div class="label">AVG</div>
          <div class="num">4.4s</div>
        </div>
      </div>
      <div class="plan">
        <div class="plan-head">
          <span class="plan-name">PRO plan</span>
          <span class="label">33 days left</span>
        </div>
        <div class="bar"><div class="fill" /></div>
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
  background: var(--surface-card);
  border: var(--border-width) solid var(--border-default);
  border-radius: 12px;
  box-shadow: var(--mock-shadow);
  color: var(--text);
  font-family: var(--font-sans);
}

.tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: var(--border-width) solid var(--border-default);
  font-size: 11px;
  color: var(--ph);
}

.tab--active {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  background: var(--surface-tile);
  font-weight: 600;
  color: var(--text);
}

.avatar {
  margin-left: auto;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: var(--accent);
}

.body {
  flex: 1;
  padding: 18px 20px 20px;
}

.balance {
  position: relative;
  overflow: hidden;
  background: var(--surface-tile);
  border: 1px solid var(--border-default);
  border-radius: 10px;
  padding: 16px 18px;
}

.balance-dots {
  position: absolute;
  top: 0;
  right: 0;
  width: 130px;
  height: 100%;
  background-image: radial-gradient(var(--accent-border) 1.4px, transparent 1.4px);
  background-size: 12px 12px;
  pointer-events: none;
}

.label {
  position: relative;
  font-size: 10px;
  letter-spacing: 0.04em;
  color: var(--ph);
  margin-bottom: 4px;
}

.value {
  position: relative;
  font: 500 34px var(--font-serif);
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.underline {
  position: relative;
  width: 54px;
  height: 3px;
  margin-top: 10px;
  border-radius: 999px;
  background: var(--accent);
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.stat {
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  padding: 10px 12px;
}

.stat .label {
  margin-bottom: 3px;
}

.num {
  font-size: 20px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.plan {
  margin-top: 12px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  padding: 12px;
}

.plan-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.plan-head .label {
  margin-bottom: 0;
}

.plan-name {
  font-size: 11px;
  font-weight: 600;
}

.bar {
  height: 5px;
  border-radius: 999px;
  background: var(--surface-tile);
  overflow: hidden;
}

.fill {
  width: 34%;
  height: 100%;
  border-radius: 999px;
  background: var(--accent);
}
</style>
