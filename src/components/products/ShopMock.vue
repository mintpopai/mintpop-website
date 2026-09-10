<script setup lang="ts">
// 产品页轮播示意图：Shop 商店。纯装饰、静态文案，不做 i18n。浅色 UI，随主题走 token。
const ITEMS = [
  { width: '78%', price: '$19.90' },
  { width: '64%', price: '$29.90' },
  { width: '71%', price: '$25.00' },
]
</script>

<template>
  <div class="mock" aria-hidden="true">
    <div class="tabs">
      <span class="tab tab--active">Store</span>
      <span class="tab">My orders</span>
      <span class="login">Log in</span>
    </div>
    <div class="body">
      <div class="promo">
        <span class="promo-pill">Official · Instant · Support</span>
        <div class="promo-title">Every AI subscription,<br />one checkout.</div>
      </div>
      <div class="chips">
        <span class="chip chip--active">AI tools</span>
        <span class="chip">Memberships</span>
        <span class="chip">Licenses</span>
      </div>
      <div class="grid">
        <div v-for="item in ITEMS" :key="item.price" class="item">
          <div class="thumb" />
          <div class="item-body">
            <div class="skeleton" :style="{ width: item.width }" />
            <div class="row">
              <span class="price">{{ item.price }}</span>
              <span class="buy">Buy</span>
            </div>
          </div>
        </div>
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

.tab--active,
.login {
  display: inline-flex;
  align-items: center;
  height: 22px;
  border-radius: 999px;
  font-weight: 600;
}

.tab--active {
  padding: 0 10px;
  background: var(--surface-tile);
  color: var(--text);
}

/* Mint 填充上的 ink 文字：品牌规定，深色模式也不翻转 */
.login {
  margin-left: auto;
  padding: 0 12px;
  background: var(--accent);
  color: #0b0b0c;
}

.body {
  flex: 1;
  padding: 14px 18px;
}

.promo {
  border-radius: 10px;
  padding: 16px 18px;
  background: linear-gradient(120deg, var(--surface-tile) 0%, var(--surface-featured) 100%);
}

.promo-pill {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 11px;
  border-radius: 999px;
  background: var(--surface-card);
  font-size: 10px;
  font-weight: 600;
  color: var(--accent-deep);
}

.promo-title {
  margin-top: 12px;
  font-size: 19px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.01em;
}

.chips {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.chip {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  font-size: 11px;
  color: var(--text2);
}

.chip--active {
  border-color: transparent;
  background: var(--accent);
  color: #0b0b0c;
  font-weight: 600;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.item {
  border: 1px solid var(--border-default);
  border-radius: 8px;
  overflow: hidden;
}

.thumb {
  height: 52px;
  background: var(--surface-tile);
}

.item-body {
  padding: 8px 9px 9px;
}

.skeleton {
  height: 5px;
  border-radius: 999px;
  background: var(--muted);
  margin-bottom: 8px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.price {
  font-size: 12px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.buy {
  display: inline-flex;
  align-items: center;
  height: 18px;
  padding: 0 8px;
  border-radius: 5px;
  background: var(--accent);
  color: #0b0b0c;
  font-size: 9px;
  font-weight: 600;
}
</style>
