import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    nav: {
      brand: "MOFANG AI",
      intro: "Introduction",
      platform: "Platform & Skills",
      showcase: "Deployed Solutions",
      ecosystem: "Creator Hub",
      vision: "Vision",
      partners: "Partners",
      init: "Initialize",
      home: "Home"
    },
    hero: {
      title1: "Intelligence,",
      title2: "Redefined.",
      desc: "Experience the next evolution of AI agents. Seamlessly integrated into your workflow, powering the future of human-machine collaboration.",
      deploy: "Deploy Agent"
    },
    intro: {
      title1: "Not just an assistant.",
      title2: "An autonomous partner.",
      desc: "MOFANG AI is designed from the ground up to be proactive, not just reactive. It anticipates your needs, orchestrates complex workflows, and learns from your interactions to become an indispensable part of your daily operations.",
      f1_title: "Cognitive Processing",
      f1_desc: "Advanced neural networks that understand context, nuance, and complex instructions with human-like comprehension.",
      f2_title: "Real-time Execution",
      f2_desc: "Lightning-fast response times powered by our proprietary edge-computing infrastructure.",
      f3_title: "Enterprise Security",
      f3_desc: "Military-grade encryption and strict data isolation ensuring your proprietary information remains yours.",
      sys_init: "> Initializing Generative UI...",
      sys_online: "> UI Engine online. Awaiting voice/text intent.",
      sys_await: "> Listening...",
      sys_user: "User: \"Generate a Q3 commodity quantitative analysis dashboard.\"",
      sys_nexus: "MOFANG AI: Intent recognized. Generating micro-app...",
      sys_done: "Dashboard generated. Real-time data feeds connected."
    },
    platform: {
      title: "Middle-Platform Architecture",
      desc: "A robust, scalable foundation designed to deploy, manage, and monitor AI skills across your entire organization.",
      hub_title: "Centralized Control Hub",
      hub_desc: "Monitor all agent activities, manage API keys, and orchestrate complex multi-agent workflows from a single, intuitive interface.",
      code_title: "Code Generation",
      code_desc: "Autonomous programming, refactoring, and bug fixing across 40+ languages.",
      data_title: "Data Analysis",
      data_desc: "Real-time processing of massive datasets with predictive modeling capabilities.",
      api_title: "API Integration",
      api_desc: "Seamless connection to external services to execute real-world actions.",
      custom_title: "Custom Skill Training",
      custom_desc: "Fine-tune the agent on your proprietary data to create highly specialized skills unique to your business needs."
    },
    showcase: {
      title: "Deployed Solutions",
      desc: "Explore our highly customized ToB and ToC projects driven by MOFANG AI.",
      tob: "Enterprise (ToB)",
      toc: "Consumer (ToC)",
      p1_title: "Commodity Quant Dashboard",
      p1_desc: "Auto-tracks multi-party market data to generate buy/sell signals.",
      p2_title: "Voice-to-Expense System",
      p2_desc: "Multi-person dictated travel expense auto-reimbursement.",
      p3_title: "Script Breakdown & Scheduling",
      p3_desc: "Intelligent script parsing and shooting schedule generation for film studios.",
      p4_title: "Infinite E-commerce Canvas",
      p4_desc: "Automated long-scroll image generation flow for e-commerce design.",
      skills: "100+",
      skills_label: "Core Skills",
      skills_desc: "Continuously expanding capabilities"
    },
    ecosystem: {
      title: "Creator Ecosystem",
      desc: "Build, share, and monetize your custom AI skills. A true GitHub for AI Agents.",
      card1_title: "Skill Marketplace",
      card1_desc: "Publish your vertical workflows to the platform.",
      card2_title: "Creator Economy",
      card2_desc: "Automated revenue sharing based on Token consumption with strict IP protection."
    },
    vision: {
      title1: "The Future of Work,",
      title2: "Arriving Today.",
      desc: "Imagine a world where mundane tasks vanish. Where your ideas are instantly prototyped, your data is continuously analyzed, and your focus remains purely on innovation. This is the lifestyle MOFANG AI enables.",
      v1_title: "Ambient Intelligence",
      v1_desc: "The agent operates seamlessly in the background, observing context and offering solutions before you even ask.",
      v2_title: "Frictionless Creation",
      v2_desc: "Go from thought to execution in minutes. Speak your intent, and watch complex systems build themselves.",
      v3_title: "Hyper-Personalization",
      v3_desc: "An AI that adapts to your unique workflow, learning your preferences, tone, and strategic goals over time."
    },
    partners: {
      title: "Trusted by industry pioneers"
    },
    contact: {
      title: "Initiate Connection",
      desc: "Leave your email and project goals. We can route the message to your designated mailbox and start an AI-assisted support thread instantly.",
      name: "Your name",
      company: "Company or team",
      placeholder: "Enter your transmission address (Email)",
      message: "What do you want to build or automate?",
      button: "Request Access Protocol",
      sandbox: "Open support console",
      secure: "Encrypted channel. 256-bit secure connection.",
      success: "Message sent. The operations team has been notified.",
      error: "Send failed. Please check your SMTP settings and try again.",
      assistantBadge: "AI Support",
      assistantTitle: "Smart service assistant",
      assistantDesc: "The site now supports AI customer-service conversations, persistent message storage, and instant mailbox alerts for every new lead or question.",
      assistantFeature1: "Realtime AI replies for visitors, with fallback responses when no model key is configured.",
      assistantFeature2: "Every visitor message is archived to the backend inbox so your team can follow up quickly.",
      assistantFeature3: "Support conversations can trigger email notifications to the operations mailbox."
    },
    ops: {
      eyebrow: "Back Office",
      title: "Operations console",
      desc: "Upload images and videos, send direct emails, and monitor the live support inbox from one place.",
      loginBadge: "Admin Access",
      loginTitle: "Protected operations login",
      loginDesc: "Only signed-in admins can access uploads, mail delivery, and visitor inbox data.",
      loginUser: "Admin username",
      loginPass: "Admin password",
      loginButton: "Sign in",
      loginError: "Login failed. Please check the admin account settings.",
      sessionExpired: "Your admin session expired. Please sign in again.",
      logout: "Sign out",
      storagePrefix: "Storage",
      uploadTitle: "Asset upload center",
      uploadDesc: "Upload marketing videos, product screenshots, and reference files directly to the backend.",
      uploadButton: "Upload selected files",
      uploadEmpty: "No assets uploaded yet.",
      mailTitle: "Direct email delivery",
      mailDesc: "Send a custom message to any target mailbox with one click.",
      mailTo: "Target email",
      mailSubject: "Subject",
      mailMessage: "Email content",
      mailButton: "Send email now",
      chatTitle: "Smart Customer Service",
      chatDesc: "Visitors can directly chat with the intelligent assistant and quickly receive automated replies.",
      inboxTitle: "Lead & conversation inbox",
      inboxDesc: "Review submitted leads and live customer-service conversations in one protected console.",
      inboxLeads: "Leads",
      inboxChats: "Chats",
      chatPlaceholder: "Ask about pricing, use cases, integrations, or deployment...",
      chatButton: "Send",
      inboxEmpty: "No visitor messages yet.",
      refresh: "Refresh inbox"
    },
    footer: {
      copyright: "© 2026 MOFANG AI Systems. All rights reserved.",
      privacy: "Privacy",
      terms: "Terms",
      status: "System Status"
    }
  },
  zh: {
    nav: {
      brand: "魔方AI",
      intro: "系统介绍",
      platform: "中台与技能",
      showcase: "部署案例",
      ecosystem: "创作者生态",
      vision: "未来愿景",
      partners: "合作伙伴",
      init: "系统初始化",
      home: "返回首页"
    },
    hero: {
      title1: "智能，",
      title2: "重新定义。",
      desc: "体验 AI 智能体的下一次进化。无缝集成到您的工作流中，驱动人机协作的未来。",
      deploy: "部署智能体"
    },
    intro: {
      title1: "不仅是助手。",
      title2: "更是自主的合作伙伴。",
      desc: "魔方AI 从底层设计为主动而非被动。它预测您的需求，编排复杂的工作流，并从您的交互中学习，成为您日常运营中不可或缺的一部分。",
      f1_title: "认知处理",
      f1_desc: "先进的神经网络，具有类人的理解力，能深刻理解上下文、细微差别和复杂指令。",
      f2_title: "实时执行",
      f2_desc: "由我们专有的边缘计算基础设施提供支持，实现闪电般的响应时间。",
      f3_title: "企业级安全",
      f3_desc: "军用级加密和严格的数据隔离，确保您的专有信息绝对安全。",
      sys_init: "> 正在初始化 Generative UI 引擎...",
      sys_online: "> UI 引擎在线。等待语音/文本意图输入。",
      sys_await: "> 正在聆听...",
      sys_user: "用户：“生成一个第三季度大宗商品量化分析看板。”",
      sys_nexus: "魔方AI：意图已识别。正在生成微应用面板...",
      sys_done: "看板已生成。实时数据流已接入。"
    },
    platform: {
      title: "智能中台架构",
      desc: "一个强大、可扩展的基础设施，旨在跨整个组织部署、管理和监控 AI 技能。",
      hub_title: "中央控制枢纽",
      hub_desc: "从单一且直观的界面监控所有智能体活动、管理 API 密钥并编排复杂的多智能体工作流。",
      code_title: "代码生成",
      code_desc: "支持 40 多种语言的自主编程、代码重构和错误修复。",
      data_title: "数据分析",
      data_desc: "实时处理海量数据集，具备强大的预测建模能力。",
      api_title: "API 集成",
      api_desc: "无缝连接外部服务，以执行现实世界中的复杂动作。",
      custom_title: "自定义技能训练",
      custom_desc: "使用您的专有数据微调智能体，创建完全满足您业务需求的独特专业技能。"
    },
    showcase: {
      title: "已部署方案",
      desc: "探索由 魔方AI 驱动的、高度定制化的 ToB 与 ToC 项目。",
      tob: "企业级 (ToB)",
      toc: "消费级 (ToC)",
      p1_title: "大宗商品量化分析看板",
      p1_desc: "自动追踪多方市场数据并生成买卖建议。",
      p2_title: "多人口述差旅自动报销系统",
      p2_desc: "通过语音输入，自动解析并生成差旅报销单。",
      p3_title: "剧本智能拆解与顺位表生成",
      p3_desc: "面向影视制作，一键解析剧本并排期。",
      p4_title: "无限长图自动化生成流",
      p4_desc: "面向电商设计，极简输入生成复杂详情页长图。",
      skills: "100+",
      skills_label: "核心技能",
      skills_desc: "能力持续扩展中"
    },
    ecosystem: {
      title: "共创生态系统",
      desc: "构建、分享并变现您的定制 AI 技能。打造 AI 智能体领域的 GitHub。",
      card1_title: "技能集市 (Skill Marketplace)",
      card1_desc: "开发者可将封装好的垂直工作流发布到平台。",
      card2_title: "创作者经济",
      card2_desc: "完善的版权保护机制，基于 Token 消耗实现自动化分成，让极客获得收益。"
    },
    vision: {
      title1: "工作的未来，",
      title2: "今日已至。",
      desc: "想象一个繁琐任务消失的世界。您的想法被瞬间原型化，您的数据被持续分析，您的注意力纯粹集中在创新上。这就是 魔方AI 带来的生活方式。",
      v1_title: "环境智能",
      v1_desc: "智能体在后台无缝运行，观察上下文并在您提出要求之前主动提供解决方案。",
      v2_title: "无摩擦创造",
      v2_desc: "在几分钟内从想法走向执行。说出您的意图，看着复杂的系统自行构建。",
      v3_title: "超级个性化",
      v3_desc: "一个适应您独特工作流的 AI，随着时间的推移不断学习您的偏好、语气和战略目标。"
    },
    partners: {
      title: "受行业先锋信任"
    },
    contact: {
      title: "发起连接",
      desc: "留下您的邮箱和项目目标，我们可以把消息直接发送到指定邮箱，并立即开启 AI 客服支持线程。",
      name: "您的姓名",
      company: "公司或团队",
      placeholder: "输入您的传输地址 (电子邮件)",
      message: "请描述您希望搭建的系统、场景或需求",
      button: "请求访问协议",
      sandbox: "打开支持控制台",
      secure: "加密通道。256 位安全连接。",
      success: "消息已发送，运营邮箱已收到通知。",
      error: "发送失败，请检查 SMTP 配置后重试。",
      assistantBadge: "AI 客服",
      assistantTitle: "智能支持助手",
      assistantDesc: "网站现已支持 AI 客服对话、留言持久化存档，以及每条新线索的邮箱即时提醒。",
      assistantFeature1: "访客可实时获得 AI 回复，未配置模型时也会自动降级到预设应答。",
      assistantFeature2: "所有访客留言都会写入后台收件箱，方便团队及时跟进。",
      assistantFeature3: "支持会话可自动触发运营邮箱通知。"
    },
    ops: {
      eyebrow: "运营后台",
      title: "内容与客服控制台",
      desc: "在一个界面里上传图片和视频、直发邮件，并查看智能客服留言。",
      loginBadge: "后台权限",
      loginTitle: "受保护的后台登录",
      loginDesc: "只有登录后的管理员才能访问素材上传、邮件发送和访客留言数据。",
      loginUser: "管理员账号",
      loginPass: "管理员密码",
      loginButton: "登录后台",
      loginError: "登录失败，请检查后台账号配置。",
      sessionExpired: "后台登录已过期，请重新登录。",
      logout: "退出登录",
      storagePrefix: "存储",
      uploadTitle: "素材上传中心",
      uploadDesc: "营销视频、产品图片、方案附件都可以直接上传到后台。",
      uploadButton: "上传所选文件",
      uploadEmpty: "暂时还没有上传素材。",
      mailTitle: "定向邮件发送",
      mailDesc: "输入目标邮箱即可直接发送邮件通知或商务跟进内容。",
      mailTo: "目标邮箱",
      mailSubject: "邮件主题",
      mailMessage: "邮件正文",
      mailButton: "立即发送邮件",
      chatTitle: "智能客服",
      chatDesc: "访客可直接与智能助手对话，并快速收到自动化回复。",
      inboxTitle: "留资与会话收件箱",
      inboxDesc: "在同一个受保护后台中查看表单留资和智能客服对话记录。",
      inboxLeads: "留资线索",
      inboxChats: "客服对话",
      chatPlaceholder: "可询问价格、场景、接口集成、落地周期等问题...",
      chatButton: "发送",
      inboxEmpty: "暂时还没有访客留言。",
      refresh: "刷新收件箱"
    },
    footer: {
      copyright: "© 2026 魔方AI 系统。保留所有权利。",
      privacy: "隐私政策",
      terms: "服务条款",
      status: "系统状态"
    }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('zh');

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[lang];
    for (const k of keys) {
      if (value[k] === undefined) return key;
      value = value[k];
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
