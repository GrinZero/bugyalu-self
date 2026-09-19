export const profile = {
  name: "「源心锁」",
  handle: "bugyalu",
  role: "全栈工程师",
  experience: "3 years",
  intro:
    "把复杂系统变成可以被理解、被使用、也值得被记住的东西。这里记录我的项目、实验和正在形成的观点。",
  availability: "Open to thoughtful collaborations",
  email: "bugyaluwang@qq.com",
  github: "https://github.com/GrinZero",
  githubLabel: "github.com/GrinZero",
  interests: [
    { icon: "👨🏻‍🍳", label: "小厨神", note: "试试冰淇淋，还是蒜泥白肉？" },
    { icon: "🏸", label: "羽毛球", note: "新手上路，祝我成功" },
    { icon: "🦉", label: "INTJ", note: "紫老头" },
  ],
};

export const now = {
  updated: "2026.9.19",
  paragraphs: ["正在找下一份工作，欢迎来聊。"],
};

export const stats = [
  { value: "20×", label: "dpdm-fast · Rust 重写让 CI 依赖检查 80s → 4.2s" },
  { value: "100", label: "自研 Agent 修复的 Sentry issues，27 个 PR 直接合并" },
  { value: "4.7%", label: "BugSpy 把 9% 的无法复现工单率压到一半" },
];

export interface HighlightItem {
  icon: string;
  text: string;
  link?: { label: string; href: string };
}

export const highlights: HighlightItem[] = [
  {
    icon: "🍃",
    text: "跨端全栈开发能力：Web(React)、Node.js、Hybrid App、Electron/Tauri，以及 Rust / Python。",
  },
  {
    icon: "🧙‍♀️",
    text: "深入前沿的解决方案研究员。自研 node-network-devtools 推动 Node 社区补齐网络调试缺失，深度参与官方 issue 与方案讨论；过去一年 Node 主干陆续落地网络调试能力并更新 CDP 协议。目前为 Node.js 贡献者（PR 已合并、多个 review 中）。",
    link: {
      label: "开源 · GitHub",
      href: "https://github.com/GrinZero/node-network-devtools",
    },
  },
  {
    icon: "🤖",
    text: "国内第一批 AI 使用者 & 萌时最早提出并实践 AI 的人。在公司内建立研发智能定位分析 Agent 和内部知识图谱，用 AI 驱动研发稳定性提升和提效。",
  },
  {
    icon: "🧪",
    text: "具备数据闭环能力。在 MoeGo 主导全链路性能治理和数据防劣化闭环治理，建立初步性能实验室。",
  },
  {
    icon: "🚗",
    text: "推动能力和执行力较强。25 年中旬主动为系统引入 BFF 并引领首次业务生产落地，推动 fintech、crm、erp 等团队接入，建设错误率指标监控，打通浏览器 trace 到微服务全链路。入职 MoeGo 一年绩效分别为 E 和 O。",
  },
  {
    icon: "🌟",
    text: "善于通过底层创新交付系统性解法。自研 24×14 存储的 rrweb 日志调试系统，让对应系统 9%(180/2000) 的无法复现工单率降到 4.7%(70/1500)。",
  },
];

export const skills = [
  { name: "TypeScript / JavaScript / CSS", level: "A+", note: "处理性能问题的基础能力" },
  { name: "Node.js", level: "A+", note: "官方的网络调试方案提供者" },
  { name: "React", level: "A+", note: "魔改成功 React 编译器" },
  { name: "AI / Agentic Workflows", level: "A", note: "国内第一批 ChatGPT 玩家 · Devin 深度用户" },
  { name: "React Native / Expo", level: "B+", note: "修复 Expo 持续三年的原生缺陷" },
  { name: "Rust", level: "B+", note: "落地两个应用" },
  { name: "Electron / Tauri", level: "C+", note: "学而不精", retired: true },
  { name: "Python", level: "C", note: "量化入门", retired: true },
  { name: "小程序", level: "C", note: "快忘光了", retired: true },
];

export interface WorkBlock {
  lead?: string;
  text: string;
  children?: string[];
  oss?: { label: string; href: string };
}

export interface WorkSection {
  icon: string;
  title: string;
  stack?: string;
  intro?: string;
  blocks: WorkBlock[];
}

export interface WorkEntry {
  company: string;
  role: string;
  period: string;
  intro?: string;
  sections: WorkSection[];
}

export const experience: WorkEntry[] = [
  {
    company: "MoeGo",
    role: "前端开发工程师",
    period: "2024.5 — 2026.4",
    sections: [
      {
        icon: "🔥",
        title: "AI 应用专项工程",
        stack: "codex / gemini + Weaviate + Express",
        intro:
          "为了推动 AI 在 MoeGo 各个流程中的提效和实际落地，以 LiteLLM 为基础向全公司开放免费 token，允许员工自行探索 AI 应用的落地。我在专项中推出了以下几个产品 / 解决方案。",
        blocks: [
          {
            lead: "研发智能定位分析 Agent",
            text: "基于 RAG 聚合 + 成熟 Agentic Runtime + 服务端流程编排的 AI Native Workflow Engine。起初为了解决历史信息沉淀在多个平台无法提供有效上下文的问题，在 RAG 知识图谱初步落地后，顺势拓展成可以帮助研发排查 CS 单以及修复 Sentry issues 的 Agent。",
            children: [
              "基于 Codex runtime 搭建公司级工单定位工作流，把一对一调查 QA/研发工作流沉淀成 SKILL：常见 CS 问题定位平均时间 1h → 10min，提效 90%。基于此拓展的 Sentry 修复 Agent 使修复时间 20min → 5min；截止离职共修复正好 100 个问题，修复建议有效率超过 70%，可以直接合并的 PR 27 个。",
              "搭建 RAG 知识图谱，建立 Slack 消息与 JIRA、GitHub、Sentry、Intercom、发布记录、记忆等实体的关系，通过 BM25 全文检索和向量化检索召回数据提供给公司多个 Agent。",
              "建立分步评估体系，按问题类型分桶评估 summary 抽取、实体关系抽取、检索、证据融合与最终 Agent 效果，基于问题分类、多路召回融合持续优化：关键证据 Recall@10 从 43% 提升到 72%，Recall@5 从 38% 提升到 60%。",
            ],
          },
          {
            lead: "Global Search 能力",
            text: "MoeGo 功能繁杂、难以索引。我推动了全局搜索能力在产品中的实际落地，支持 cmd+k 快速页面跳转，并规划常见 action 调整、AI 搜索等能力。这是 MoeGo 研发推动产品变更落地的首次建树，被列入公司 AI 化计划的核心组成之一。",
          },
        ],
      },
      {
        icon: "🧐",
        title: "MoeGo App / CApp",
        stack: "React Native + Next.js + Java / Swift",
        intro:
          "MoeGo App 是提供给宠物商家员工的 App，包含移动美容、预约管理、IM 消息等功能（ARR 16.94M $，UV 25k）；CApp 是给不同 Enterprise 商家定制的 C 端 App。我在 BApp 主要负责基建工作，在 CApp 则是核心业务 Owner。",
        blocks: [
          {
            lead: "App 热更新管理平台",
            text: "基于 Expo Update Server 协议定制的热更新管理平台，解决 MoeGo App 热更新场景无法回滚、A/B Testing 能力缺失、不支持多租户、运行时兼容性管理混乱、接入层基建不统一、发布不可审计、更新数据不可量化等痛点。",
          },
          {
            lead: "Brand Figma Plugin",
            text: "为解决 Brand App 多租户场景下定制化资源繁琐的设计和研发人力占用，设计并推动构建了设计-研发-上线的一体化协作链路。支持设计资源自动上传并落库，单个 App onboard 时间从最低一周下降到最短 2 小时、平均 2 天。",
          },
          {
            lead: "C App 业务支撑",
            text: "",
            children: [
              "主导 CApp 向 hybrid app 的技术转型，打通跨端鉴权和 UI 兼容，通过公共协议包规范 WebView/App 通信，在业务 DDL 重压前交付，上线后得到 T1 商家好评。",
              "主导 CApp 多商家能力的系统架构设计与建设，支持品牌级别的资源隔离（图标、字体、图片、配色等），已支持 4 家商家接入。",
              "首次在 MoeGo 引入原生开发，完成 Live Activity 能力建设，突破跨栈技术壁垒，显著提升 App 实时交互体验。",
              "为 Expo 修复 Android 通知点击 crash 的社区遗留原生缺陷，彻底根除稳定性问题。",
              "独立负责地图和 IM 模块开发，打通实时通信链路，提升 Mobile Groomer 与客户的沟通效率。",
            ],
          },
        ],
      },
      {
        icon: "🪄",
        title: "基础能力建设",
        stack: "TypeScript + Hono(Node.js) + Docker/k8s + Datadog + AWS",
        blocks: [
          {
            lead: "BFF 项目",
            text: "Backend for Frontend，由前端开发/使用的后端项目，为解决团队内在前端组装请求数据导致的业务复杂度而诞生。",
            children: [
              "搭建 MoeGo 首个 Node.js 服务，设计并实现多个脚手架脚本（连接 k8s 集群进行调试的交互式 CLI、create-route 模板 CLI），让研发接入无心智负担。",
              "将首个业务接口 /init 在 BFF 落地，用有效的结果向业务推广。截止离开 MoeGo，前后端团队均以 BFF 项目作为唯一流量入口进行开发。",
              "接入 Trace 对齐后端微服务，建设接口错误率、schema 对齐率、服务流量看板和日报，推进 owner 修复。",
              "实现基于 AWS 直传机制的大文件分片上传，支持分片上传、断点续传、并发上传、主线程隔离。SDK 侧统一构建，相比普通上传，上传耗时降低超 60%，存储空间节省超过 50%。",
            ],
          },
          {
            lead: "dpdm-fast",
            text: "团队 Lint 流程依赖 dpdm 做循环依赖检测，随代码规模增长耗时飙到 1 分钟以上。基于 Rust + swc 重写并开源，主仓检查耗时 80s → 4.2s，近 20 倍提升，覆盖 99% 原有测试用例。",
            oss: {
              label: "开源 · GitHub",
              href: "https://github.com/GrinZero/dpdm-fast",
            },
          },
          {
            lead: "BugSpy 24×7 问题回溯系统",
            text: "在复杂系统中，无法复现的缺陷一直是最难排查的问题类型之一，随着系统复杂度提高，这类工单的比例逐步上升。借鉴社区方案 PageSpy 的思路，设计并实现了支持 24 小时行为日志存储的故障排查系统。",
          },
          {
            lead: "前端项目健康度建设",
            text: "打造性能与错误红线，推动业务质量流程落地，根据团队需求实现自定义 lint 规则，并推动前端错误治理和性能预算实施。",
          },
        ],
      },
      {
        icon: "🚀",
        title: "业务性能优化专项",
        blocks: [
          { text: "紧急时刻介入 Web 端性能优化：首页表格加载 1.95s → 270ms，lodging view 日历加载 3s → 400ms，解决持续很久的日历动画卡顿以及其他子项优化。" },
          { text: "优化状态库 amos，引入 auto batching，提升大部分页面 LCP 200～500ms（平均 38%），并解决特定场景下批量渲染卡顿问题。" },
          { text: "优化 B App JS bundle：首屏加载缩短 400ms（13.3%），减少约 150MB 内存占用（17.4%），精准定位热更新下载缓慢缺陷，下载体积降低 50% 以上。" },
          { text: "schema 懒加载：通过 getter 和 proxy 实现懒加载优化。" },
          { text: "LCP 专项优化：P75 LCP 下降 2s+，P95 LCP 下降 5s+，降低超 50%。" },
          { text: "为巩固性能优化成果，设计并实现食尾蛇工作流，实现性能问题的源头溯源和自动评估。" },
        ],
      },
    ],
  },
  {
    company: "米哈游",
    role: "前端开发工程师",
    period: "2023.6 — 2024.5",
    sections: [
      {
        icon: "⚡",
        title: "WebVitals 性能可视化平台（Sniffing v1.7.5）",
        blocks: [
          { text: "参与 Sniffing 埋点系统及性能可视化平台的迭代升级，承担核心功能模块的前端重构任务。" },
          { text: "独立构建性能指标大盘、会话分析表格、字段管理工具等关键模块，优化项目依赖与构建流程。" },
          { text: "通过重构构建链路与性能组件，将页面启动耗时从秒级降低至毫秒级，打包产物缩小 20%，实现 v1.7.5 的按时高质量交付。" },
        ],
      },
      {
        icon: "🧠",
        title: "埋点协作平台 Sniffing Together（v1.8.5）",
        blocks: [
          { text: "负责埋点协作平台的前端开发与功能迭代，提升协作效率与使用体验。" },
          { text: "重构侧边栏结构与核心交互，包括折叠伸缩、项目卡片、版本卡片及全局参数能力等模块。" },
          { text: "主导完成 Vite 与 Ant Design 的版本升级，并在任务提前完成后主动承担全局参数模块改造。" },
          { text: "跨栈参与后端 Node.js 优化工作，针对 ClickHouse 查询进行调优，将多个查询语句执行时间从秒级降至毫秒级，在紧张工期内高质量交付 v1.8.5。" },
        ],
      },
      {
        icon: "📢",
        title: "运营公告平台 SDK（v1.0.0）",
        blocks: [
          { text: "负责运营公告平台前端 SDK 的架构设计与开发，为多业务线提供稳定高效的公告渲染能力。" },
          { text: "自研超微响应式渲染框架，支持灵活的公告样式与布局，增强开发体验。" },
          { text: "对打包体积进行深度优化，从 200+KB 压缩至 13KB，同时保证兼容性覆盖 IE10。" },
          { text: "引入指数退避策略优化拉取稳定性，最终实现稳定上线并获得较好反馈。" },
        ],
      },
      {
        icon: "🗂️",
        title: "OSS-SDK 文件上传工具链（v0.1.0）",
        blocks: [
          { text: "独立负责 OSS-SDK 的设计与开发，为用户提供一站式上传下载能力，兼容旧版 OSS 逻辑。" },
          { text: "实现分片上传、断点续传、有效帧提取、缩略图返回等能力，支持 Worker + WASM 架构执行 CRC32 计算。" },
          { text: "针对社区开源方案进行性能重构并封装为私有包，CRC32 算法性能提升 10%～25%。" },
          { text: "在高压工期下成功交付首版 SDK，显著提升产品在文件处理方面的可接入性与性能体验。" },
        ],
      },
    ],
  },
  {
    company: "腾讯",
    role: "前端开发实习生",
    period: "2022.1 — 2023.2",
    intro:
      "腾讯客户端性能分析平台（QAPM）是一款面向银行与集团内部使用的性能检测 SDK，前端基于 React + Redux + Saga 构建，支持多维数据可视化、行为分析与性能追踪。",
    sections: [
      {
        icon: "👀",
        title: "QAPM 项目开发与工程优化",
        blocks: [
          { text: "支持性能监控平台多个子模块开发，独立负责用户行为轨迹模块、项目详情页、跨时区时间展示方案。" },
          { text: "针对多图表页面性能问题，基于 IntersectionObserver 实现懒加载 hook，接入至 50+ 页面，显著改善滚动卡顿。" },
          { text: "主导前端工程优化：Webpack 打包体积 13.3MB → 2.7MB，首次启动时间 33.1s → 18.8s，HMR 缩短至 600ms。" },
          { text: "构建内部 CLI 工具链，升级 Babel 配置，引入 ESLint + Husky 流程，提升开发效率与质量保障。" },
          { text: "输出多份模块设计与开发文档，提升新人上手效率，推动团队技术知识沉淀。" },
        ],
      },
      {
        icon: "🏅",
        title: "其他贡献与表现",
        blocks: [
          { text: "支持腾讯 Mini 项目，指导学员实现前端自动化监控与图像压缩。" },
          { text: "获得中期考核「优」、终期考核「S」，获颁「部门力求上进奖」。" },
        ],
      },
    ],
  },
];

export const education = {
  degree: "物联网工程 · 本科",
  period: "2019.9 — 2023.6",
};

export const nav = [
  { label: "手记", href: "/writing/" },
  { label: "作品", href: "/projects/" },
  { label: "这个人", href: "/about/" },
];

export const seriesOf = (id: string) =>
  id.startsWith("devtools-")
    ? { label: "DevTools", color: "var(--s-devtools)" }
    : id.startsWith("agent-eng-")
      ? { label: "Agent 工程", color: "var(--s-agent)" }
      : id.startsWith("field-")
        ? { label: "Field", color: "var(--s-field)" }
        : { label: "手记", color: "var(--s-note)" };
