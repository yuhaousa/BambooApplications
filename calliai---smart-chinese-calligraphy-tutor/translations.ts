import { Language } from './types';

export const translations = {
  en: {
    title: "CalliAI Master",
    subtitle: "Smart feedback on Stroke Order, Direction, and Connection.",
    characterLabel: "Character:",
    undo: "Undo",
    clear: "Clear",
    demo: "Demo",
    tracingOn: "Tracing On",
    tracingOff: "Tracing Off",
    analyzeBtn: "Check Order & Direction",
    analyzingBtn: "Checking Strokes...",
    analysisTitle: "Analysis",
    perfectStrokes: "Perfect Strokes",
    issuesFound: "Issues Found",
    scoreLabel: "Score",
    generalAssessment: "General Assessment",
    strokeDetails: "Stroke Details",
    actionRequired: "Action Required",
    allGood: "All Good!",
    allGoodDesc: "All strokes look correct!",
    errorLoading: "Analysis Failed",
    errorDesc: "We couldn't reach the AI Tutor. Please check your connection.",
    placeholder: "Write a character and press 'Check' to receive detailed analysis.",
    pleaseWrite: "Please write something first!",
    errorTypes: {
      DIRECTION: "Direction",
      ORDER: "Order",
      CONNECTION: "Connection",
      SHAPE: "Shape",
      NONE: "None"
    },
    tipsTitle: "Golden Rules of Calligraphy",
    tipsSubtitle: "Follow these standard stroke orders:",
    tips: [
      "Top to Bottom",
      "Left to Right",
      "Horizontal before Vertical",
      "Outside before Inside",
      "Center before Sides"
    ]
  },
  zh: {
    title: "书法大师 AI",
    subtitle: "智能分析笔画顺序、方向和连笔。",
    characterLabel: "汉字:",
    undo: "撤销",
    clear: "清除",
    demo: "演示",
    tracingOn: "描红开启",
    tracingOff: "描红关闭",
    analyzeBtn: "检查笔画与顺序",
    analyzingBtn: "正在分析...",
    analysisTitle: "分析结果",
    perfectStrokes: "完美笔画",
    issuesFound: "发现问题",
    scoreLabel: "得分",
    generalAssessment: "综合评价",
    strokeDetails: "笔画详情",
    actionRequired: "需要改进",
    allGood: "太棒了!",
    allGoodDesc: "所有笔画都正确！",
    errorLoading: "分析失败",
    errorDesc: "无法连接 AI 导师，请检查网络。",
    placeholder: "请书写汉字并点击“检查”以获取详细分析。",
    pleaseWrite: "请先书写汉字！",
    errorTypes: {
      DIRECTION: "笔画方向",
      ORDER: "笔画顺序",
      CONNECTION: "连笔错误",
      SHAPE: "形态结构",
      NONE: "无"
    },
    tipsTitle: "汉字笔顺口诀",
    tipsSubtitle: "书写时请遵循以下基本规则：",
    tips: [
      "从上到下",
      "从左到右",
      "先横后竖",
      "先外后内",
      "先中间后两边"
    ]
  },
  th: {
    title: "ปรมาจารย์ CalliAI",
    subtitle: "วิเคราะห์ลำดับขีด ทิศทาง และการเชื่อมต่อ",
    characterLabel: "ตัวอักษร:",
    undo: "ย้อนกลับ",
    clear: "ล้าง",
    demo: "สาธิต",
    tracingOn: "เปิดลายเส้น",
    tracingOff: "ปิดลายเส้น",
    analyzeBtn: "ตรวจสอบลำดับและทิศทาง",
    analyzingBtn: "กำลังตรวจสอบ...",
    analysisTitle: "ผลการวิเคราะห์",
    perfectStrokes: "ยอดเยี่ยม",
    issuesFound: "จุดที่ต้องแก้ไข",
    scoreLabel: "คะแนน",
    generalAssessment: "ประเมินภาพรวม",
    strokeDetails: "รายละเอียดลายเส้น",
    actionRequired: "ต้องปรับปรุง",
    allGood: "ดีมาก!",
    allGoodDesc: "ลายเส้นทั้งหมดถูกต้อง!",
    errorLoading: "การวิเคราะห์ล้มเหลว",
    errorDesc: "ไม่สามารถเชื่อมต่อ AI ได้ โปรดตรวจสอบอินเทอร์เน็ต",
    placeholder: "เขียนตัวอักษรแล้วกด 'ตรวจสอบ' เพื่อดูผลวิเคราะห์",
    pleaseWrite: "กรุณาเขียนตัวอักษรก่อน!",
    errorTypes: {
      DIRECTION: "ทิศทาง",
      ORDER: "ลำดับขีด",
      CONNECTION: "การเชื่อมต่อ",
      SHAPE: "รูปร่าง",
      NONE: "ไม่มี"
    },
    tipsTitle: "กฎทองของการเขียนพู่กัน",
    tipsSubtitle: "ปฏิบัติตามลำดับขีดมาตรฐานเหล่านี้:",
    tips: [
      "จากบนลงล่าง",
      "จากซ้ายไปขวา",
      "ขีดขวางก่อนขีดตั้ง",
      "ด้านนอกก่อนด้านใน",
      "ตรงกลางก่อนด้านข้าง"
    ]
  }
};

export const getTranslation = (lang: Language) => translations[lang];