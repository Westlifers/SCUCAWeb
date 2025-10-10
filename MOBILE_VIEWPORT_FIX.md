# 移动端视口高度修复说明

## 问题描述

在移动端浏览器（特别是 iOS Safari 和部分 Android 浏览器）中，当使用 `100vh` 作为高度单位时，会遇到以下问题：

1. **地址栏占用空间**：浏览器地址栏会占用视口高度，导致实际可用空间小于 `100vh`
2. **底部导航栏溢出**：固定在底部的导航栏可能被遮挡或溢出屏幕
3. **动态变化**：当用户滚动页面时，地址栏可能显示/隐藏，导致视口高度动态变化

## 解决方案

采用了**三层回退机制**来确保最大兼容性：

### 1. CSS dvh 单位（首选方案）

使用现代 CSS 的 `dvh`（动态视口高度）单位，自动适应浏览器 UI 的显示/隐藏：

```css
height: calc(100dvh - 60px);
```

**优点**：
- 自动适应浏览器 UI 变化
- 性能最佳
- 无需 JavaScript

**支持范围**：
- iOS Safari 15.4+
- Chrome 108+
- Firefox 110+

### 2. CSS 自定义变量（回退方案 1）

通过 JavaScript 动态计算并设置 CSS 变量：

```css
height: calc(var(--viewport-height, 100vh) - 60px);
```

**优点**：
- 兼容性好
- 可动态更新
- 解决地址栏问题

### 3. 传统 vh 单位（最终回退）

作为最后的回退方案，确保所有浏览器都能正常显示（虽然可能有地址栏遮挡问题）。

## 实现细节

### JavaScript 动态计算（`main.ts`）

```typescript
// 修复移动端浏览器地址栏导致的视口高度问题
const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
};

// 初始化
setViewportHeight();

// 监听窗口大小变化（方向改变、键盘弹出等）
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(setViewportHeight, 100);
});
```

### CSS 变量定义（`css-vars.css`）

```css
:root {
    /* 视口高度变量 - 兼容移动端浏览器地址栏 */
    --vh: 1vh;
    --viewport-height: 100vh;
}
```

### 实际应用示例

```css
.cubing-mobile {
    /* 三层回退机制 */
    height: calc(100dvh - 60px);  /* 现代浏览器首选 */
    height: calc(var(--viewport-height, 100vh) - 60px);  /* JavaScript 回退 */
    /* 如果都不支持，使用传统 vh（已被覆盖） */
}
```

## 已修复的文件

### 核心布局
- ✅ `src/layout/index.vue` - 主布局容器和 main 区域
- ✅ `src/styles/css-vars.css` - CSS 变量定义
- ✅ `src/main.ts` - JavaScript 动态计算

### 移动端页面
- ✅ `src/views/week/mobile/cubing/cubingMobile.vue` - 周赛参赛页面
- ✅ `src/views/week/mobile/weekrank/weekRankMobile.vue` - 周赛排行页面

## 测试建议

### 测试场景

1. **iOS Safari**
   - iPhone 各种尺寸（特别是刘海屏和非刘海屏）
   - 横屏和竖屏切换
   - 滚动页面时地址栏显示/隐藏

2. **Android Chrome**
   - 各种屏幕尺寸
   - 全面屏手势
   - 地址栏自动隐藏

3. **其他浏览器**
   - 微信内置浏览器
   - QQ 浏览器
   - UC 浏览器

### 测试要点

- [ ] 底部导航栏始终可见
- [ ] 页面内容不会被遮挡
- [ ] 切换横竖屏正常工作
- [ ] 滚动时布局稳定
- [ ] 虚拟键盘弹出时布局正常

## 性能影响

1. **CSS dvh**：无性能影响（浏览器原生支持）
2. **JavaScript 计算**：
   - 仅在窗口大小变化时触发（已防抖，100ms）
   - 极小的计算开销
   - 不影响页面渲染性能

## 浏览器兼容性

| 浏览器 | 版本 | dvh 支持 | JS 回退 |
|--------|------|----------|---------|
| iOS Safari | 15.4+ | ✅ | ✅ |
| iOS Safari | < 15.4 | ❌ | ✅ |
| Chrome (Android) | 108+ | ✅ | ✅ |
| Chrome (Android) | < 108 | ❌ | ✅ |
| Firefox | 110+ | ✅ | ✅ |
| WeChat Browser | - | ❌ | ✅ |

## 后续优化建议

如果发现其他页面也有类似问题，可以批量替换：

1. 搜索 `100vh` 使用的地方
2. 根据是否是移动端页面决定是否需要修复
3. 应用相同的三层回退机制

## 相关资源

- [CSS Values and Units Module Level 4 - Viewport-percentage lengths](https://www.w3.org/TR/css-values-4/#viewport-relative-lengths)
- [Can I Use: dvh](https://caniuse.com/?search=dvh)
- [Mobile Safari and the Shrinking Viewport](https://stackoverflow.com/questions/37112218/css3-100vh-not-constant-in-mobile-browser)
