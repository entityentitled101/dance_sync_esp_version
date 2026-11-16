# 《声·命体》- Sound Lifeform (Dimension Symphony v4.1)

这是一个基于 **ESP32-S3** 硬件传感器的体感音画互动系统。通过采集双手六轴运动数据，在浏览器端构建出一个从“点”到“线”再到“面”的多维交响视觉世界。

## 核心架构：维度交响 (Dimension Symphony)

本项目采用 **三维度 × 六阶段** 的叙事逻辑：
- **维度 (Dimension)**: 点 (Dot)、线 (Line)、面 (Face)。
- **阶段 (Stage)**: 0. 序幕 -> I. 动机 -> II. 发展 -> III. 高潮 -> IV. 解决 -> V. 尾声。

## 视觉风格：单色偏移 (Monochromatic Ghosting)
本项目遵循**单色极简主义**，取消了彩色色散。视觉动态由单色多级透明度重影（40% & 23%）构成，结合径向偏移模拟高级镜头的残影质感。

## 硬件要求
- **主手**: ESP32-S3 + MPU6050 (蓝牙名称: `ESP32`)
- **副手**: ESP32-mini + MPU6050 (蓝牙名称: `ESP32-mini`)

## 软件说明 (前端集成版)
- **核心主文件**: `shengmingti_proto_v3.html` (集成点线面全功能的最终入口)
- **配置中心**: `CHAPTER_CONFIG.js` (统一管理章节标题与文案)
- **实现细节参考**:
  - `dot-6stages.html`: 原初之点（粒子海与星轨）
  - `line-6stages.html`: 流转之线（增强型 Joy Division 地形）
  - `face-6stages.html`: 张力之面（几何魔方与穿梭）

## 如何运行
1. **硬件连接**: 开启 ESP32 传感器蓝牙。
2. **启动前端**: 浏览器打开 `shengmingti_proto_v3.html`。
3. **建立连接**: 点击 **CONNECT** 按钮配对。
4. **交互体验**: 通过挥动手部加速度，控制视觉演化速度。

---
*更多详细设计与技术踩坑: [声命体_视觉规划_合并版.md](file:///c:/Users/yifzo/Desktop/dance_sync_esp/%E5%A3%B0%E5%91%BD%E4%BD%93_%E8%A7%86%E8%A7%89%E8%A7%84%E5%88%92_%E5%90%88%E5%B9%B6%E7%89%88.md)*
