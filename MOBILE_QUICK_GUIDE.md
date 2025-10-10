# 移动端优化快速指南

## 访问路径

### 参赛页面
- 路由: `#/comp/mobile/week`
- 组件: `src/views/week/mobile/cubing/cubingMobile.vue`
- 功能: 周赛参赛、打乱查看、计时提交

### 排行榜页面
- 路由: `#/comp/mobile/weekrank`
- 组件: `src/views/week/mobile/weekrank/weekRankMobile.vue`
- 功能: 查看周赛排行榜、成绩详情

### 底部导航
- 组件: `src/layout/components/NavFooterMobile.vue`
- 入口: 
  - Grid 图标 → 参赛页面
  - Trophy 图标 → 排行榜页面
  - 深色模式开关

---

## 核心特性

### 参赛页面 (cubingMobile.vue)

#### 视觉特点
- 🎨 卡片化布局
- 🌈 渐变色图标和按钮
- ✨ 入场动画 (fadeIn)
- 💎 多层次阴影

#### 交互流程
1. 选择项目 (左右箭头 + 下拉选择)
2. 查看打乱 (卡片化显示 + 3D预览)
3. 点击大圆形按钮开始计时
4. 完成后自动进入下一次
5. 最后一次完成后显示提交按钮

#### 关键元素
- **头部卡片**: 项目选择器 + 进度显示
- **打乱卡片**: 项目徽章 + 2D/3D切换 + 打乱文字
- **3D预览**: 独立容器，响应式宽度
- **计时结果**: 超大字号 (48px) + 提交按钮
- **计时按钮**: 80x80px 圆形，渐变背景
- **成绩浮窗**: 右下角固定，显示所有成绩
- **已完成**: 头像 + 飞舞动画 + 完成徽章

#### 样式亮点
```css
/* 计时按钮 */
.timing-btn {
  width: 80px !important;
  height: 80px !important;
  background: linear-gradient(135deg, 
    var(--yougi-primary), var(--yougi-accent)) !important;
  box-shadow: 0 8px 24px rgba(64, 158, 255, 0.3) !important;
}

/* 当前成绩 */
.current-time {
  font-size: 48px;
  font-weight: 700;
  color: var(--yougi-primary);
  font-variant-numeric: tabular-nums;
}

/* 完成徽章 */
.finished-badge {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #67C23A, #85CE61);
  animation: pulse 2s ease-in-out infinite;
}
```

---

### 排行榜页面 (weekRankMobile.vue)

#### 视觉特点
- 🏆 卡片列表设计
- 🥇 前三名特殊样式
- 🎭 奖牌图标
- 📊 进度条可视化

#### 交互功能
1. 选择项目 (左右箭头 + 下拉选择)
2. 查看排行榜 (卡片列表，自动排序)
3. 点击箭头展开详细成绩
4. 查看每次成绩的可视化

#### 排名设计
| 排名 | 图标 | 颜色 | 效果 |
|------|------|------|------|
| 🥇 第1名 | 奖牌 | 金色渐变 | 金色发光 |
| 🥈 第2名 | 奖牌 | 银色渐变 | 银色发光 |
| 🥉 第3名 | 奖牌 | 铜色渐变 | 铜色发光 |
| 其他 | 数字 | 渐变文字 | 默认样式 |

#### 卡片结构
```
rank-card
├── rank-badge (排名标识)
├── player-info (用户信息)
│   ├── avatar (48px 头像)
│   └── player-details
│       ├── username
│       └── avg-score (平均成绩)
└── score-details (成绩详情)
    ├── score-header (展开/收起按钮)
    ├── progress-overview (进度条概览)
    └── detailed-scores (可展开)
        └── score-item × N
            ├── time-label
            ├── time-value
            └── time-bar
```

#### 样式亮点
```css
/* 第一名卡片 */
.rank-card:nth-child(1) {
  border-color: #FFD700;
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.25);
}

/* 金色徽章 */
.rank-badge.rank-1 {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
}

/* 最快成绩 */
.score-item.fastest .time-value {
  color: #67C23A;
}

/* 最慢成绩 */
.score-item.slowest .time-value {
  color: #F56C6C;
}
```

---

## 设计系统

### 配色
- **主色**: `var(--yougi-primary)` - 蓝色系
- **强调**: `var(--yougi-accent)` - 紫色系
- **成功**: `#67C23A` - 绿色
- **警告**: `#F56C6C` - 红色
- **金色**: `#FFD700` - 第一名
- **银色**: `#C0C0C0` - 第二名
- **铜色**: `#CD7F32` - 第三名

### 圆角
- **超大**: `var(--radius-2xl)` - 头部卡片
- **大**: `var(--radius-xl)` - 内容卡片
- **中**: `var(--radius-lg)` - 次要元素

### 阴影
- **标准**: `var(--shadow-md)`
- **强调**: `var(--shadow-lg)`
- **超强**: `var(--shadow-xl)`
- **自定义**: 彩色发光效果

### 字号
- **超大**: 48px - 当前成绩
- **特大**: 20px - 标题
- **大**: 18px - 平均成绩
- **中**: 16px - 用户名
- **小**: 14px - 次要信息
- **超小**: 13px - 提示文字

### 间距
- **页面边距**: 20px 16px
- **卡片间距**: 12px / 16px
- **内容间距**: 8px / 12px / 16px / 24px

---

## 动画效果

### 入场动画
```css
/* 淡入 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 上升淡入 */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 右侧滑入 */
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}
```

### 交互动画
```css
/* 悬停放大 */
.timing-btn:hover {
  transform: scale(1.05);
}

/* 点击缩小 */
.timing-btn:active {
  transform: scale(0.95);
}

/* 脉冲效果 */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

### 过渡动画
```css
/* 展开/收起 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
}

/* 进度条填充 */
.time-bar-fill {
  transition: width 0.3s ease;
}
```

---

## 响应式要点

### 容器高度
```css
.cubing-mobile,
.weekrank-mobile {
  min-height: calc(100vh - 60px);
  /* 60px = 底部导航栏高度 */
}
```

### 触摸目标
- **最小尺寸**: 40x40px (符合移动端规范)
- **按钮**: 48px+ (确保易点击)
- **头像**: 48px-96px (清晰可辨)

### 字体大小
- **最小**: 13px (保证可读性)
- **最大**: 48px (突出重点)
- **body**: 14-16px (舒适阅读)

---

## 开发技巧

### 图标使用
```typescript
import {
  ArrowLeft, ArrowRight,  // 导航
  Grid, Trophy,           // 功能图标
  Timer, CircleCheck,     // 状态图标
  Medal, List, Clock      // 装饰图标
} from '@element-plus/icons-vue';
```

### 状态管理
```typescript
// 展开状态
const expandedPlayers = ref<string[]>([])

// 切换展开
const toggleDetails = (username: string) => {
  const index = expandedPlayers.value.indexOf(username)
  if (index > -1) {
    expandedPlayers.value.splice(index, 1)
  } else {
    expandedPlayers.value.push(username)
  }
}
```

### 条件渲染
```vue
<!-- 参赛界面 -->
<div v-if="events_available.indexOf(activeEvent) > -1">
  <!-- 参赛相关内容 -->
</div>

<!-- 已完成界面 -->
<div v-else>
  <!-- 已完成相关内容 -->
</div>
```

### 数据处理
```typescript
// 排序 (DNF 当作无穷大)
const sort_avg_count_in_zero = (a: any, b: any) => {
  let timeA = a.avg === 0 ? Infinity : a.avg
  let timeB = b.avg === 0 ? Infinity : b.avg
  return timeA - timeB
}

// 获取项目次数
const getTimeCount = () => {
  return SPECIAL_EVENTS.indexOf(activeEvent.value) > -1 ? 3 : 5
}
```

---

## 性能优化

### CSS 性能
- ✅ 使用 `transform` 替代 `left/top`
- ✅ 使用 `opacity` 替代 `visibility`
- ✅ 避免 `width/height` 动画
- ✅ 使用 `will-change` 提示浏览器

### Vue 性能
- ✅ 使用 `v-show` 控制频繁切换
- ✅ 使用 `v-if` 控制条件渲染
- ✅ 为 `v-for` 提供唯一 `:key`
- ✅ 合理使用 `computed` 缓存

### 图片优化
- ✅ 固定尺寸避免重排
- ✅ 使用 `object-fit: cover`
- ✅ 懒加载头像图片

---

## 调试技巧

### 查看动画
```css
/* 临时禁用所有动画 */
* {
  animation-duration: 0s !important;
  transition-duration: 0s !important;
}
```

### 边框调试
```css
/* 查看布局结构 */
* {
  outline: 1px solid red;
}
```

### 性能监控
```javascript
// 在 DevTools Performance 面板
// 1. 点击 Record
// 2. 执行操作
// 3. 停止录制
// 4. 查看 FPS、渲染时间等
```

---

## 常见问题

### Q: 为什么移除 PK 入口？
A: 简化导航，专注周赛核心功能，提升用户体验。

### Q: 前三名的样式如何区分？
A: 通过边框颜色、阴影效果、奖牌图标区分。

### Q: 成绩如何判断最快最慢？
A: 过滤有效成绩，找出最小值和最大值，DNF 当作最慢。

### Q: 动画会不会影响性能？
A: 使用 GPU 加速的属性 (transform/opacity)，性能影响极小。

### Q: 如何适配不同屏幕？
A: 使用相对单位、flex 布局、媒体查询等响应式技术。

---

## 快速命令

```bash
# 开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 类型检查
npm run type-check

# 代码格式化
npm run format
```

---

## 相关文件

- `MOBILE_OPTIMIZATION_SUMMARY.md` - 详细优化文档
- `src/layout/components/NavFooterMobile.vue` - 底部导航
- `src/views/week/mobile/cubing/cubingMobile.vue` - 参赛页面
- `src/views/week/mobile/weekrank/weekRankMobile.vue` - 排行榜页面

---

**最后更新**: 2025年10月10日
