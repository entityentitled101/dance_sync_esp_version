// ═══════════════════════════════════════════════════════════════════════════════
// 声·命体 - 章节文案配置框架
// ═══════════════════════════════════════════════════════════════════════════════
// 
// 这是从 shengmingti_proto_v3.html 中提取的完整章节配置
// 包含所有阶段的中英文文案、标题、字幕
//
// 结构说明：
// - preface: 开场前引导
// - ch1-ch4: 四个章节（点/线/面/螺旋）
// - ending: 结尾
//
// 每个章节包含：
// - title: 中文标题
// - subtitle: 英文标题  
// - text: 章节主文案 (preface/ending 使用)
// - textDeveloping: 发展部文案 (单手/低能量状态)
// - textClimax: 高潮文案 (双手/高能量状态)

const CHAPTER_CONFIG = {
  // ─────────────────────────────────────────────────────────────────────────────
  // 开场前引导（全黑背景时显示）
  // ─────────────────────────────────────────────────────────────────────────────
  preface: {
    title: '',
    subtitle: '',
    text: { 
      cn: "你有没有好奇过——声音从哪里来？", 
      en: "Have you ever wondered where sound comes from?" 
    }
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // 第一章：点 (Point) - 好奇·探索
  // 对应 gemini-frontend/point.html 的视觉
  // ─────────────────────────────────────────────────────────────────────────────
  ch1: {
    title: "好奇·探索",
    subtitle: "Curiosity · Exploration",
    textDeveloping: { 
      cn: "好奇是什么声音？", 
      en: "What does curiosity sound like?" 
    },
    textClimax: { 
      cn: "没有逻辑，没有目的。只是好奇。", 
      en: "No logic, no purpose. Just curiosity." 
    }
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // 第二章：线 (Line) - 连接·触碰
  // 对应 gemini-frontend/line.html 的视觉
  // ─────────────────────────────────────────────────────────────────────────────
  ch2: {
    title: "连接·触碰",
    subtitle: "Connection · Touch",
    textDeveloping: { 
      cn: "伸出手，世界就会回答你。", 
      en: "Reach out, and the world answers." 
    },
    textClimax: { 
      cn: "每一次触碰，都是一次对话。", 
      en: "Every touch is a conversation." 
    }
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // 第三章：面 (Face) - 共鸣·共舞
  // 对应 gemini-frontend/face.html 的视觉
  // ─────────────────────────────────────────────────────────────────────────────
  ch3: {
    title: "共鸣·共舞",
    subtitle: "Resonance · Dance",
    textDeveloping: { 
      cn: "好奇是会传染的。", 
      en: "Curiosity is contagious." 
    },
    textClimax: { 
      cn: "你，不想试试吗？", 
      en: "Don't you want to try?" 
    }
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // 第四章：螺旋 - 回归·自我
  // （待开发）
  // ─────────────────────────────────────────────────────────────────────────────
  ch4: {
    title: "回归·自我",
    subtitle: "Return · Self",
    textDeveloping: { 
      cn: "当所有声音消失，你听见什么？", 
      en: "When all sounds fade, what do you hear?" 
    },
    textClimax: { 
      cn: "", 
      en: "" 
    }
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // 结尾
  // ─────────────────────────────────────────────────────────────────────────────
  ending: {
    title: "",
    subtitle: "",
    text: { 
      cn: "刚才的声音里，有你的好奇吗？", 
      en: "Was your curiosity among those sounds?" 
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 阶段指示器文案映射
// ═══════════════════════════════════════════════════════════════════════════════
const PHASE_INDICATOR_MAP = {
  'preface': '',
  'ch1': '好奇·探索 · Curiosity · Exploration',
  'ch2': '连接·触碰 · Connection · Touch', 
  'ch3': '共鸣·共舞 · Resonance · Dance',
  'ch4': '回归·自我 · Return · Self',
  'ending': '螺旋 · 回归·自我'
};

// ═══════════════════════════════════════════════════════════════════════════════
// 开场动画文案
// ═══════════════════════════════════════════════════════════════════════════════
const INTRO_TEXT = {
  main: "声·命体",
  sub: "Sound Lifeform"
};

// 导出配置（如果在模块化环境中使用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CHAPTER_CONFIG, PHASE_INDICATOR_MAP, INTRO_TEXT };
}
