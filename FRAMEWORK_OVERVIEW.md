# 声·命体 v3 融合框架总览

> 目标：将 gemini-frontend 的 Three.js 3D 视觉融入 shengmingti_proto_v3.html
> 原则：不修改 gemini-frontend/*，仅修改 shengmingti_proto_v3.html

---

## 📁 文件结构

```
dance_sync_esp/
├── shengmingti_proto_v3.html    ← 【唯一修改目标】
├── gemini-frontend/             ← 【参考文件，不修改】
│   ├── point.html               ← 第一章「点」参考
│   ├── line.html                ← 第二章「线」参考
│   └── face.html                ← 第三章「面」参考
├── CHAPTER_CONFIG.js            ← 提取的文案配置
└── backup/                      ← 修改前备份
    └── ...
```

---

## 🎭 文字/文案系统（100%保留）

### HTML 结构

```html
<!-- 1. 开场 Intro -->
<div id="intro-overlay" class="text-overlay">
  <div class="intro-main">声·命体</div>
  <div class="intro-sub">
    <span class="intro-line"></span>
    <span>Sound Lifeform</span>
    <span class="intro-line"></span>
  </div>
</div>

<!-- 2. 文案序列（发展中/高潮时显示） -->
<div id="narrative-overlay" class="text-overlay">
  <div class="narrative-cn">好奇是什么声音？</div>
  <div class="narrative-en">What does curiosity sound like?</div>
</div>

<!-- 3. 阶段指示器 -->
<div id="phase-indicator">第一章 · 开始</div>
```

### 文案内容（已提取到 CHAPTER_CONFIG.js）

| 阶段 | 中文标题 | 英文标题 | 发展部文案 | 高潮文案 |
|------|----------|----------|------------|----------|
| preface | - | - | 你有没有好奇过——声音从哪里来？ | - |
| ch1 | 好奇·探索 | Curiosity · Exploration | 好奇是什么声音？ | 没有逻辑，没有目的。只是好奇。 |
| ch2 | 连接·触碰 | Connection · Touch | 伸出手，世界就会回答你。 | 每一次触碰，都是一次对话。 |
| ch3 | 共鸣·共舞 | Resonance · Dance | 好奇是会传染的。 | 你，不想试试吗？ |
| ch4 | 回归·自我 | Return · Self | 当所有声音消失，你听见什么？ | - |
| ending | - | - | 刚才的声音里，有你的好奇吗？ | - |

---

## 🔧 状态管理系统（保留 + 扩展）

### 核心 STATE 对象

```javascript
const STATE = {
  // ─────────────────────────────────────────
  // 章节系统（保留）
  // ─────────────────────────────────────────
  chapter: 1,                    // 当前章节 1-4
  narrativePhase: 'intro',       // intro, preface, ch1, ch2, ch3, ch4, ending
  narrativeSubPhase: '',         // developing, climax
  narrativeTriggered: {          // 文案触发记录
    developing: false,
    climax: false
  },
  
  // ─────────────────────────────────────────
  // ESP32 传感器数据（保留）
  // ─────────────────────────────────────────
  mainEnergy: 0,                 // 主手能量 0-100
  subEnergy: 0,                  // 副手能量 0-100
  mainPeaked: false,             // 主手是否峰值
  subPeaked: false,              // 副手是否峰值
  
  // ─────────────────────────────────────────
  // 视觉过渡参数（保留 + 扩展）
  // ─────────────────────────────────────────
  morphProgress: 0,              // 形态演变进度 0-1
  targetProgress: 0,             // 目标进度
  
  // ════════════════════════════════════════
  // 【新增】Three.js 视觉状态
  // ════════════════════════════════════════
  // 第一章「点」状态
  pointStage: 0,                 // 0=原点, 1=球体, 2=流体, 3=炸裂
  
  // 第二章「线」状态  
  lineStage: 0,                  // 0=纯平, 1=脉冲, 2=发展, 3=高潮
  
  // 第三章「面」状态
  faceStage: 0,                  // 0=隐藏, 1=1面, 2=9面, 3=27体, 4=爆发
};
```

---

## 🎨 视觉系统改造计划

### 第一章「点」(Point) - 基于 gemini-frontend/point.html

**参考代码特征：**
- 使用 `THREE.IcosahedronGeometry` 创建球体网格
- 4 层星环系统（`EllipseCurve` + `LineLoop`）
- 800 个光子粒子系统（`BufferGeometry` + `Points`）
- 状态驱动的平滑过渡（Lerp）

**状态映射（ESP32 → 视觉）：**

| 状态 | 触发条件 | 视觉表现 |
|------|----------|----------|
| Stage 0 | 无连接 | 极小的原点 (scale=0.15) |
| Stage 1 | 主手已连接 | 球体放大 (scale=1.5)，微弱波动 |
| Stage 2 | mainEnergy > 50 | 流体波动增强 (noiseAmount=0.35)，旋转加速 |
| Stage 3 | 双手连接 + totalEnergy > 70 | 星环显现，光子炸裂 |

**视觉参数目标值：**
```javascript
const pointStageTargets = {
  0: { scale: 0.15, noiseAmount: 0.01, rotationSpeed: 0.001, 
       ringAlpha: 0.0, ringScale: 0.5, particleAlpha: 0.0, particleSpread: 0.0 },
  1: { scale: 1.5,  noiseAmount: 0.35, rotationSpeed: 0.006, 
       ringAlpha: 0.0, ringScale: 0.8, particleAlpha: 0.0, particleSpread: 0.0 },
  2: { scale: 1.5,  noiseAmount: 0.45, rotationSpeed: 0.008, 
       ringAlpha: 0.1, ringScale: 1.0, particleAlpha: 0.3, particleSpread: 2.0 },
  3: { scale: 1.1,  noiseAmount: 0.15, rotationSpeed: 0.015, 
       ringAlpha: 0.3, ringScale: 1.2, particleAlpha: 0.8, particleSpread: 5.0 }
};
```

---

## 🔌 ESP32 数据流

### 数据接收（保留现有逻辑）

```javascript
function onSensorData(idx, data) {
  const isMain = idx === 0;
  let ax = +data.ax, ay = +data.ay, az = +data.az;
  let gx = +data.gx, gy = +data.gy, gz = +data.gz;
  
  const accMag = Math.sqrt(ax*ax + ay*ay + az*az);
  const gyroMag = Math.sqrt(gx*gx + gy*gy + gz*gz);
  
  detectPeak(accMag, isMain);      // 峰值检测
  updateEnergy(accMag, gyroMag, isMain);  // 更新能量值
}
```

### 能量 → 视觉映射（第一章）

```javascript
function updateChapter1Visuals() {
  const hasMain = ctrl[0].connected;
  const hasSub = ctrl[1].connected;
  const totalE = (STATE.mainEnergy + STATE.subEnergy) / 2;
  
  let targetStage = 0;
  if (hasSub && totalE > 70) {
    targetStage = 3;  // 高潮：星环 + 光子
  } else if (hasMain && STATE.mainEnergy > 50) {
    targetStage = 2;  // 发展：流体波动增强
  } else if (hasMain) {
    targetStage = 1;  // 原初：球体放大
  }
  
  // 平滑过渡到目标阶段
  STATE.pointStage = lerp(STATE.pointStage, targetStage, 0.03);
}
```

---

## 📋 实施计划

### Phase 0: 框架准备（当前）
- ✅ 提取文案配置
- ✅ 整理状态管理系统
- ⏳ 等待确认

### Phase 1: 第一章「点」融合
1. 引入 Three.js CDN
2. 创建 Chapter1Point 类（基于 point.html）
3. 修改 VisualEngine 调用 Chapter1Point
4. 实现 ESP32 → 点视觉的状态映射
5. 保留所有文案系统

### Phase 2: 第二章「线」融合
1. 创建 Chapter2Line 类（基于 line.html）
2. 实现浮空岛地形系统
3. 轨道星体系统
4. ESP32 驱动逻辑

### Phase 3: 第三章「面」融合
1. 创建 Chapter3Face 类（基于 face.html）
2. 3x3x3 魔方系统
3. 网格空间与粒子喷射
4. ESP32 驱动逻辑

---

## ⚠️ 注意事项

1. **不修改 gemini-frontend/** - 仅作为参考，需要时直接复制代码到 v3 文件
2. **保留所有文字** - 开场、章节标题、发展中/高潮文案全部保留
3. **平滑过渡** - 使用 Lerp 或 GSAP 实现视觉状态的平滑切换
4. **性能优化** - 控制粒子数量，使用 requestAnimationFrame
5. **BLE 兼容** - 保持现有的 ESP32 连接逻辑不变

---

**请确认以上框架后，我将开始 Phase 1：第一章「点」的具体实现。**
