# cubingPanel 加载 tempResult 问题修复

## 🐛 问题描述

`cubingPanel.vue` 在初始加载时没有读取 `tempResult`（临时成绩缓存），导致用户刷新页面后，之前已经完成但未提交的成绩丢失。

## 🔍 问题分析

### 对比 cubingMobile.vue

在 `cubingMobile.vue` 中，代码正确实现了加载缓存的逻辑：

```typescript
// 切换项目时清除表单
const clearForm = () => {
  let cacheOfThisEvent: CachedResult = {
    event: activeEvent.value,
    time_1: -1, time_2: -1, time_3: -1, time_4: -1, time_5: -1
  }
  // 遍历寻找是否有对应的缓存
  for (const cache of cachedResult) {
    if (cache.event == activeEvent.value) cacheOfThisEvent = cache
  }
  // 计算现在应该到哪一把了
  for (let i = 1; i <= 5; i++) {
    if (cacheOfThisEvent[`time_${i}`] === -1) {
      count.value = i
      if (count.value > maxScrambleCount.value) count.value = maxScrambleCount.value
      break
    }
    // 如果所有都完成了，count就是最大轮数
    if (i === maxScrambleCount.value) count.value = maxScrambleCount.value
  }
  // 把缓存成绩填进去
  for (let i = 1; i <= 5; i++) {
    if (cacheOfThisEvent[`time_${i}`] === -1) {
      state.resultForm[`time_${i}`] = ''
    }
    else {
      state.resultForm[`time_${i}`] = cacheOfThisEvent[`time_${i}`]==0?'DNF':convert_time_num2str(cacheOfThisEvent[`time_${i}`]).replace(/\s*/g,"")
    }
  }
}

watch(() => activeEvent.value, () => {
  clearForm()
})

// ✅ 关键：初始时也要清除表单（实际是加载缓存）
onMounted(() => {
  clearForm()
})
```

### cubingPanel.vue 的问题

在 `cubingPanel.vue` 中：

**之前的代码**：
```typescript
// ❌ 问题1：逻辑直接写在 watch 里，没有封装成函数
watch(() => props.activeEvent, () => {
  let cacheOfThisEvent: CachedResult = {
    event: props.activeEvent,
    time_1: -1, time_2: -1, time_3: -1, time_4: -1, time_5: -1
  }
  // ... 加载缓存的逻辑
})

// ❌ 问题2：没有 onMounted，初始加载时不会执行
// ❌ 问题3：没有导入 onMounted
```

**问题**：
1. 没有导入 `onMounted`
2. 没有将逻辑封装成 `clearForm()` 函数
3. 没有在 `onMounted` 中调用，导致**初始加载时缓存不会被读取**
4. 只有在切换项目时（`watch` 触发）才会加载缓存

## ✅ 解决方案

### 1. 导入 onMounted

```typescript
import {computed, onMounted, reactive, ref, watch} from "vue";
```

### 2. 封装 clearForm 函数

```typescript
const clearForm = () => {
  let cacheOfThisEvent: CachedResult = {
    event: props.activeEvent,
    time_1: -1, time_2: -1, time_3: -1, time_4: -1, time_5: -1
  }
  // 遍历寻找是否有对应的缓存
  for (const cache of cachedResult) {
    if (cache.event == props.activeEvent) cacheOfThisEvent = cache
  }
  // 计算现在应该到哪一把了
  for (let i = 1; i <= 5; i++) {
    if (cacheOfThisEvent[`time_${i}`] === -1) {
      count.value = i
      if (count.value > maxScrambleCount.value) count.value = maxScrambleCount.value
      break
    }
    // ✅ 添加：如果所有都完成了，count就是最大轮数
    if (i === maxScrambleCount.value) count.value = maxScrambleCount.value
  }
  // 把缓存成绩填进去
  for (let i = 1; i <= 5; i++) {
    if (cacheOfThisEvent[`time_${i}`] === -1) {
      state.resultForm[`time_${i}`] = ''
    }
    else {
      state.resultForm[`time_${i}`] = cacheOfThisEvent[`time_${i}`]==0?'DNF':convert_time_num2str(cacheOfThisEvent[`time_${i}`]).replace(/\s*/g,"")
    }
  }
}
```

### 3. 在 watch 中调用

```typescript
watch(() => props.activeEvent, () => {
  clearForm()
})
```

### 4. 在 onMounted 中调用

```typescript
// ✅ 初始时也要清除表单（加载缓存）
onMounted(() => {
  clearForm()
})
```

## 🔧 完整修改

### 修改内容

1. **导入 `onMounted`**
   ```typescript
   import {computed, onMounted, reactive, ref, watch} from "vue";
   ```

2. **提取 `clearForm` 函数**
   - 将 watch 中的逻辑提取成独立函数
   - 添加了缺失的逻辑：当所有成绩都完成时，设置 `count` 为最大值

3. **简化 watch**
   ```typescript
   watch(() => props.activeEvent, () => {
     clearForm()
   })
   ```

4. **添加 onMounted**
   ```typescript
   onMounted(() => {
     clearForm()
   })
   ```

## 🎯 效果

### 修复前
1. 用户完成第 1-3 次计时
2. 刷新页面
3. ❌ 成绩丢失，`count` 重置为 1
4. ❌ 表单清空

### 修复后
1. 用户完成第 1-3 次计时
2. 刷新页面
3. ✅ 从缓存加载成绩
4. ✅ `count` 正确设置为 4（下一次）
5. ✅ 表单中显示已完成的成绩

## 📊 代码对比

| 功能 | cubingMobile.vue | cubingPanel.vue (修复前) | cubingPanel.vue (修复后) |
|------|------------------|--------------------------|--------------------------|
| 导入 onMounted | ✅ | ❌ | ✅ |
| clearForm 函数 | ✅ | ❌ | ✅ |
| watch 触发 | ✅ | ✅ | ✅ |
| onMounted 触发 | ✅ | ❌ | ✅ |
| 初始加载缓存 | ✅ | ❌ | ✅ |

## 🧪 测试场景

### 场景 1: 正常流程
1. 打开页面
2. 完成第 1 次计时 → `postTempResult` 缓存
3. 完成第 2 次计时 → `postTempResult` 缓存
4. 刷新页面
5. ✅ 应该看到前 2 次成绩
6. ✅ count 应该显示 3/5

### 场景 2: 切换项目
1. 在项目 A 完成 2 次计时
2. 切换到项目 B
3. 在项目 B 完成 1 次计时
4. 切换回项目 A
5. ✅ 应该看到项目 A 的 2 次成绩

### 场景 3: 全部完成
1. 完成全部 5 次计时
2. 刷新页面
3. ✅ 应该看到全部 5 次成绩
4. ✅ count 应该显示 5/5
5. ✅ 应该显示提交按钮

## 💡 关键点

1. **命名的误导性**: 函数名叫 `clearForm`，但实际上是**加载缓存并填充表单**
2. **初始化很重要**: 组件挂载时必须调用一次，不能只依赖 watch
3. **watch 的局限**: watch 只在值**变化**时触发，初始值不会触发
4. **代码一致性**: cubingMobile 和 cubingPanel 应该保持相同的逻辑

## 🔄 相关函数

### getCompCachedResult
从服务器获取缓存的临时成绩：
```typescript
const cachedResult = await getCompCachedResult(props.comp)
```

### postTempResult
完成计时后保存临时成绩：
```typescript
await postTempResult({
  wos: props.comp,
  event: props.activeEvent,
  order: count.value,
  result: time,
})
```

## 📝 总结

这次修复解决了 `cubingPanel` 组件初始加载时不读取 `tempResult` 的问题。主要改动：

1. ✅ 导入 `onMounted`
2. ✅ 封装 `clearForm` 函数
3. ✅ 在 `onMounted` 中调用 `clearForm`
4. ✅ 添加完成所有计时后的 count 设置逻辑

现在 `cubingPanel` 和 `cubingMobile` 的逻辑完全一致，都能正确加载和保存临时成绩！
