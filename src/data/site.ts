export const profile = {
  name: "「源心锁」",
  handle: "bugyalu",
  role: "全栈工程师",
  experience: "2023 — 2026",
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
  updated: "2026.11.07",
  paragraphs: ["正在找下一份工作，欢迎来聊。"],
};

export const stats = [
  { value: "76.6s → 4.2s", label: "dpdm-fast · B Web 循环依赖检查" },
  { value: "100", label: "研发 Agent 累计处理的 issues，产出 27 个可直接合并的 PR" },
  { value: "71% → 82%", label: "多源 RAG · 新架构 Context Recall@5" },
];

export interface HighlightItem {
  icon: string;
  text: string;
  link?: { label: string; href: string };
}

export const highlights: HighlightItem[] = [
  {
    icon: "🍃",
    text: "跨端与全栈工程实践：React、Node.js、React Native / Hybrid，结合 Rust 工具开发与 Java / Swift 原生能力解决业务和工程问题。",
  },
  {
    icon: "🧙‍♀️",
    text: "开源 node-network-devtools，以 CDP Server 将响应体、调用栈和 WebSocket 帧接入 Chrome DevTools。持续参与 Node.js 核心 Network Inspector 的修复与增强，已有修复获上游合并。",
    link: {
      label: "开源 · GitHub",
      href: "https://github.com/GrinZero/node-network-devtools",
    },
  },
  {
    icon: "🤖",
    text: "建设研发定位与修复 Agent、内部云端 QA Agent 和多源 RAG。围绕需求分析、用例评审、Golden Dataset 与分项评分，推动测试经验复用和持续回归。",
  },
  {
    icon: "🧪",
    text: "从接口、状态管理与渲染链路开展性能治理，并结合性能预算、错误红线和代码变更影响评估，将单点优化延伸到持续治理。",
  },
  {
    icon: "🚗",
    text: "从 0 到 1 建设 Node.js BFF 并推动跨团队接入；在客户端热更新平台中负责目标制定、PRD、任务拆解及实习生与外包协作。",
  },
  {
    icon: "🌟",
    text: "以 rrweb 和 IndexedDB 建设 24 小时用户行为回溯系统，关联 Intercom 工单、Sentry 错误和会话回放，为问题复现提供上下文。",
  },
  { icon: "🌍", text: "能独立使用英文进行技术协作，包括会议、书面技术方案与代码评审。" },
];

export const skillDomains = [
  {
    id: "frontend",
    evidence: { label: "性能优化实践", href: "#performance-engineering" },
    name: "前端工程",
    english: "Frontend",
    summary: "从复杂业务界面到跨端应用，深入渲染、性能与工程基础。",
    capabilities: [
      { name: "Web 应用与架构", detail: "React 组件与状态管理、响应式渲染、SDK 设计与工程化。" },
      { name: "性能分析与优化", detail: "Web Vitals、渲染调度、懒加载、包体积与内存优化。" },
      { name: "跨端与原生集成", detail: "React Native / Expo、Hybrid 通信、跨端鉴权与原生能力接入。" },
    ],
    stack: ["TypeScript", "JavaScript", "CSS", "React", "Next.js", "React Native", "Vite"],
  },
  {
    id: "backend",
    evidence: { label: "BFF 实践", href: "#bff-project" },
    name: "后端工程",
    english: "Backend",
    summary: "围绕业务构建 Node.js 服务，打通接口、数据与调试链路。",
    capabilities: [
      { name: "服务与接口设计", detail: "BFF 架构、接口聚合、Schema 对齐与多租户资源隔离。" },
      { name: "数据库与文件处理", detail: "PostgreSQL、Redis 应用实践，ClickHouse 查询调优，以及对象存储、分片上传与断点续传。" },
      { name: "协议与工具开发", detail: "Node.js 网络调试、CDP 协议集成、CLI 与 Rust 工具开发。" },
    ],
    stack: ["Node.js", "Hono", "Express", "PostgreSQL", "Redis", "ClickHouse", "AWS S3", "Rust"],
  },
  {
    id: "ai",
    evidence: { label: "Agent 落地实践", href: "#ai-engineering" },
    name: "AI 应用工程",
    english: "AI Engineering",
    summary: "让模型接入真实业务流程，用检索、证据和评估改进结果。",
    capabilities: [
      { name: "Agent 框架与 Harness", detail: "Mastra、pi-agent 与 Agent Harness 应用实践，Runtime 集成、服务端流程编排、故障定位与代码修复。" },
      { name: "RAG 与知识检索", detail: "Google Discovery Engine、多数据源并行召回、跨源引用关联、自适应多跳检索、RRF 与 LLM 重排。" },
      { name: "评估与持续改进", detail: "Golden Dataset、逐 Case Review、分项 Scorer 与 LLM-as-judge，分别评估检索精度、召回与回答忠实度。" },
    ],
    stack: ["Mastra", "Google Agent Search", "pi-agent", "Harness", "Codex", "Gemini", "Weaviate", "LiteLLM", "RAG", "Agent Skills"],
  },
  {
    id: "devops",
    evidence: null,
    name: "DevOps 与可观测性",
    english: "DevOps & Observability",
    summary: "把发布、监控、排障和质量检查连成可持续的工程流程。",
    capabilities: [
      { name: "部署与发布工具", detail: "容器化服务、集群调试工具、热更新回滚与运行时兼容性管理。" },
      { name: "全链路可观测性", detail: "浏览器到微服务的 Trace 串联、错误率监控、行为回放与故障回溯。" },
      { name: "工程质量与效率", detail: "CI 依赖检查提速、自定义 Lint 规则、性能预算与防劣化流程。" },
    ],
    stack: ["Docker", "Kubernetes", "AWS", "Datadog", "Sentry", "rrweb"],
  },
  {
    id: "product",
    evidence: null,
    name: "产品与体验设计",
    english: "Product & Experience",
    summary: "从实际使用问题出发，推动需求、交互与工程实现一起落地。",
    capabilities: [
      { name: "需求分析与方案设计", detail: "识别业务与协作痛点，拆解功能范围，推动工具和平台建设。" },
      { name: "信息组织与交互", detail: "全局搜索与快捷导航、复杂平台交互、性能数据可视化。" },
      { name: "设计与研发协作", detail: "Figma 插件、品牌资源配置与多租户应用的设计交付流程。" },
    ],
    stack: ["Figma Plugin", "Global Search", "数据可视化", "多品牌定制"],
  },
];

export interface WorkBlock {
  id?: string;
  lead?: string;
  text: string;
  children?: string[];
  oss?: { label: string; href: string };
}

export interface WorkSection {
  id?: string;
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
  "company": "MoeGo",
  "role": "前端开发工程师",
  "period": "2024.05 — 2026.08",
  "intro": "围绕 AI 应用、全栈平台、React Native 跨端业务、前端性能和研发效率开展工作，承担多个项目的技术方案设计、核心开发和落地推进。工作范围覆盖 Web/App、Node.js 服务端、研发工具、CI 与发布平台，并在客户端热更新管理平台中负责目标制定、PRD 编写、任务拆解及实习生、外包协作。",
  "sections": [
    {
      "icon": "🔥",
      "title": "AI Agent、评测与知识平台",
      "id": "ai-engineering",
      "blocks": [
        {
          "lead": "研发问题定位与修复 Agent",
          "text": "针对研发历史和问题线索分散在 Slack、Jira、GitHub、Sentry、Intercom 等系统，客服支持与研发需要反复检索、关联信息的问题，构建基于 Codex/Gemini Runtime、RAG、多源上下文和领域 Skill 的研发定位与修复 Agent。",
          "children": [
            "通过服务端编排和工具调用，将历史证据检索、问题分析与修复建议串联为工作流，为常见客服问题定位及 Sentry 问题修复提供支持。常见 CS 问题平均定位耗时从 1 小时缩短至 10 分钟，Sentry 问题修复耗时从约 20 分钟缩短至 5 分钟。截至离职，累计处理 100 个 issue，建议有效率超过 70%，产出 27 个可直接合并的 PR。"
          ]
        },
        {
          "lead": "云端 QA Agent 与运行架构",
          "text": "设计 API / Worker / Sandbox 服务器架构与沙箱执行隔离方案，推动内部 QA Agent 从 n8n 工作流向 TypeScript/Mastra 演进，落地 MoeGo 首个云端 Agent，并面向内部 QA 用户持续生产运行。",
          "children": [
            "围绕需求分析、用例评审和执行反馈组织 Agent 工作流，支持测试任务处理与团队经验复用，将 Agent 的运行架构、执行隔离和实际 QA 协作场景结合起来。"
          ]
        },
        {
          "lead": "QA Agent 评测体系与团队经验闭环",
          "text": "围绕内部 QA Agent 建设“需求分析—候选用例—逐条评审—修改反馈—分项评分—执行证据回流”的质量闭环，将个人 QA 经验持续沉淀为团队可复用经验，支持测试设计与 Agent 能力迭代。",
          "children": [
            "整理真实 QA 会话与执行轨迹，建设统一 Golden Dataset，并派生适配 Mastra、Datadog 的评测格式。结合逐 Case Review、修改反馈与分项 Scorer，从关键行为覆盖、禁止行为约束和执行轨迹可信度等维度组织回归评估，使评测能够定位具体用例和行为层面的问题。",
            "为评测实验建立工具调用边界：写操作采用 mock，读操作按明确分类接入；对未分类的新工具阻断实验构建或导入，避免工具扩展时意外执行真实写入。区分用于回归验证的 Golden Case 与经过审核的正式 QA 经验，保留样本来源和纳入、排除依据。",
            "Golden Dataset 与 Scorers 已合入主干。核心 QA Agent 持续服务内部 QA 用户，通过需求分析、用例评审和执行反馈推动团队经验复用；相关实践将 E2E 环节耗时从一个下午缩短至约 1 小时。"
          ]
        },
        {
          "lead": "多源 RAG、跨源关联检索与效果评估",
          "text": "搭建基于 Google Agent Search / Discovery Engine 的多源 RAG，为内部 Agent 提供跨系统证据检索能力。利用底层服务完成版面分块、索引与初步召回，在应用层建设多 datastore 并行召回、跨源引用关联、自适应多跳检索、跨查询 RRF 融合排序及 LLM 重排。",
          "children": [
            "建立分步骤的 LLM-as-judge 评测机制，围绕上下文召回、检索精度和回答忠实度持续迭代。在内部评估集上，将 Google Agent Search 新架构的 Context Recall@5 从初版 71% 提升至 82%；后续对照轮次中，Precision@5 从 48% 提升至 60%。在完整回答质量优化周期中，Answer Faithfulness 从 0.71 提升至 0.94。"
          ]
        },
        {
          "lead": "应用级 LLM 配置平台与运行链路可视化",
          "text": "设计并实现应用级、分阶段的 LLM Pipeline 配置平台，支持不同应用分别为答案生成、相关性判断与重排、查询优化、上下文路由等阶段配置 Provider、模型及调用参数。",
          "children": [
            "建立“请求级覆盖 > 应用级配置 > 环境默认值”的配置解析机制，按字段合并配置，并将 temperature、maxTokens、timeout 等参数传递至实际模型调用。调整调用点的模块级模型单例，按请求解析阶段配置，避免不同应用之间错误复用模型选择；同时处理阶段关闭后后续分支继续调用模型的问题。",
            "支持自定义 Provider、OpenAI-compatible 接口、连接测试与模型发现，建设凭据加密存储、界面掩码展示和 Provider 删除前的应用引用检查。",
            "以后端真实执行拓扑驱动 React Flow 可视化画布，展示各阶段的连接关系、配置摘要、继承来源及可配置、只读、锁定状态，让管理界面与实际运行能力保持一致。将 Embedding 的连接配置与凭据独立管理，约束应用侧修改模型和向量维度，维护检索索引兼容性。",
            "相关功能已合入主干，并完成 TypeScript、自动化测试与仓库检查。"
          ]
        },
        {
          "lead": "企业知识源平台与权限隔离",
          "text": "建设面向内部问答和 Agent 的知识源平台，将来源接入、同步管理、检索能力与消费应用解耦，支持用户自主添加飞书、Slack 知识源，并通过统一检索能力服务不同消费场景。",
          "children": [
            "以调用身份持有的 Token 绑定可访问知识源集合，建立来源级权限隔离，使不同应用和调用方在各自授权范围内检索内容。飞书、Slack 知识源接入与隔离核心能力已完成上线。",
            "完善知识源生命周期管理，区分上游原文、同步策略、同步状态和检索投影，明确“排除未来同步”“手动删除检索投影”与“上游原文删除”的不同语义。实现未被排除的已删除投影可重新索引，处理旧内容 hash 导致重建被跳过的问题；相关删除、排除与重建能力已通过回归验证并合入主干。",
            "推进管理端飞书文档树选择与首次同步入口，解除首次同步对历史同步状态的依赖，并联动刷新文档树、同步状态、运行记录与检索结果，完成本地验证。推进 Intercom 数据源接入，其数据库迁移与严格 TLS 连接已在测试环境验证。"
          ]
        }
      ]
    },
    {
      "icon": "🛠️",
      "title": "全栈平台与发布治理",
      "id": "platform-engineering",
      "blocks": [
        {
          "lead": "客户端热更新管理平台与发布治理",
          "text": "基于 Expo Update Server 协议建设客户端热更新管理平台，负责后端 API、CLI、CI 和业务接入，完成大部分管理后台开发，覆盖从发布工具到管理界面、服务端及业务应用的全栈链路。",
          "children": [
            "围绕原有发布流程的不足，建设回滚、A/B Testing、多租户、runtime 兼容、统一接入、审计和数据量化能力，统一 runtime 与 channel 管理。承担项目目标制定、PRD 编写和任务拆解，带领实习生与外包协作开发并推进交付。"
          ]
        },
        {
          "lead": "Node.js BFF 平台与跨团队接入",
          "text": "针对前端需要直接组装多个后端服务数据、业务逻辑分散及调试成本高的问题，从 0 到 1 搭建 Node.js BFF，以 TypeScript、Hono、Kubernetes 和 AWS 支撑服务开发与部署。",
          "children": [
            "建设初始化数据聚合接口、路由脚手架、K8s 调试 CLI 和全链路 Trace，配套错误率与流量看板，完善开发、调试和运行观测流程。推动 BFF 成为新开发业务的统一接入路径，降低前后端跨团队协作和接口接入成本。"
          ],
          "id": "bff-project"
        }
      ]
    },
    {
      "icon": "📱",
      "title": "跨端业务与品牌定制",
      "id": "mobile-engineering",
      "blocks": [
        {
          "lead": "React Native / Hybrid 架构与多商家业务",
          "text": "作为 CApp 核心业务 Owner，主导 Hybrid 技术转型，处理跨端鉴权、Web/App 通信、UI 兼容和多商家品牌资源隔离等问题。",
          "children": [
            "基于 React Native、Next.js 和 WebView，以公共协议包统一 WebView/App 通信与鉴权机制，结合 Java、Swift 原生能力支持跨端业务。建设图标、字体、图片与配色的品牌级隔离能力，支持多商家应用定制，在业务交付节点前完成上线，支持 4 家商家接入。"
          ]
        },
        {
          "lead": "Figma 插件与商户品牌定制自动化",
          "text": "针对商户定制字体、主题、图标和图片需要设计与前端反复手工处理的问题，设计并实现 Figma 插件，串联可视化配置、自然语言改图、CDN 上传及配置入库流程。",
          "children": [
            "将品牌素材处理与应用配置连接起来，推动 MVP 投入实际使用，使单 App onboard 周期从原先最低一周缩短至平均 2 天，最快可在 2 小时内完成。"
          ]
        },
        {
          "lead": "原生移动能力、通知稳定性、地图与即时通信",
          "text": "在 React Native 业务中引入 Swift、Java 原生开发能力，建设 Live Activity，支持移动端实时状态展示；定位并修复 Expo Android 通知点击引发的崩溃问题。",
          "children": [
            "独立负责地图与 IM 模块开发，打通移动美容师与客户之间的实时通信链路，覆盖跨端业务与原生能力集成。"
          ]
        },
        {
          "lead": "品牌应用双向消息与外部服务集成",
          "text": "参与品牌应用双向消息及相关增强功能开发，针对商家依赖 SMS、后端开发人力有限的情况，调研并复用外部 API，支持业务功能交付，减少对新增后端接口开发的依赖。",
          "children": []
        }
      ]
    },
    {
      "icon": "🧪",
      "title": "性能、稳定性与研发效率",
      "id": "performance-engineering",
      "blocks": [
        {
          "lead": "BugSpy 用户行为回溯与问题复现平台",
          "text": "针对线上问题难以复现、客服与研发需要反复沟通收集线索的问题，设计并实现基于 rrweb 与 IndexedDB 的用户行为回溯系统，保留最近 24 小时的行为日志，并连接 Intercom 工单与 Sentry 错误平台。",
          "children": [
            "通过端侧行为记录、浏览器本地存储和会话回放，为研发排查提供问题发生前后的操作上下文，将用户反馈、错误信息与行为轨迹关联起来，支持线上问题复现和故障定位。"
          ]
        },
        {
          "lead": "核心业务页面性能专项",
          "text": "在客户关键业务节点，针对首页表格加载慢、日历交互卡顿等问题，一周内从接口聚合、状态管理、渲染重排重绘和动画链路开展分层定位与治理。",
          "children": [
            "将首页表格加载耗时从 1.95 秒优化至 270 毫秒，将日历加载耗时从 3 秒优化至 400 毫秒，改善核心业务页面的加载和交互体验。"
          ]
        },
        {
          "lead": "状态管理优化、LCP 治理与性能预算",
          "text": "在内部状态管理库中引入 auto batching，治理批量状态更新引发的重复渲染；通过 schema getter/proxy 懒加载减少非必要初始化开销，并结合性能预算和错误红线推进持续治理。",
          "children": [
            "状态管理相关优化使多页面 LCP 改善 200—500 毫秒，平均改善约 38%。在进一步的 LCP 专项治理中，P75 降低超过 2 秒，P95 降低超过 5 秒，降幅超过 50%，将性能优化从单点修复推进到持续指标治理。"
          ]
        },
        {
          "lead": "React Native App 首屏、内存与热更新体积优化",
          "text": "围绕 B App 的 JS Bundle 开展专项优化，定位首屏依赖、内存占用和热更新下载链路的问题，改善移动端加载与资源使用。",
          "children": [
            "专项优化后，首屏耗时减少约 400 毫秒，降幅约 13.3%；内存占用减少约 150MB，降幅约 17.4%；热更新下载体积降低超过 50%。"
          ]
        },
        {
          "lead": "Rust 静态依赖分析工具与 CI 提效",
          "text": "针对原有 dpdm 循环依赖检查耗时超过一分钟、影响团队 CI 反馈效率的问题，基于 Rust 与 SWC 重写静态依赖分析工具 dpdm-fast，覆盖 99% 的原有测试并接入 CI。",
          "children": [
            "将 B Web 循环依赖检查耗时从 76.6 秒降至 4.2 秒，将 B App 检查耗时从 46.7 秒降至 3.28 秒，改善 30 多名前端开发者的日常检查与持续集成体验。"
          ],
          "oss": {
            "label": "GitHub",
            "href": "https://github.com/GrinZero/dpdm-fast"
          }
        },
        {
          "lead": "代码变更性能影响评估与退化溯源",
          "text": "针对性能指标能够发现退化、却难以追溯具体代码变更的问题，设计并实现面向代码提交的性能影响评估工作流。",
          "children": [
            "在 dpdm-fast 中实现符号级路由依赖分析，结合 Git Diff、模块复杂度、AI 文件评分与遗传算法，对代码提交的潜在性能影响范围进行分析和评分，并用于高风险模块的预警与评估，将性能治理延伸至代码变更阶段。"
          ]
        }
      ]
    },
    {
      "icon": "🧩",
      "title": "产品能力与通用 SDK",
      "id": "product-engineering",
      "blocks": [
        {
          "lead": "大文件分片上传与统一 SDK",
          "text": "参与建设统一大文件上传 SDK，支持 AWS 直传、Multipart Upload、断点续传和并发上传，通过 Worker 将相关处理与主线程隔离，统一业务侧接入方式。",
          "children": [
            "在项目原有业务对比口径下，实现上传耗时降低超过 60%、存储占用降低超过 50%，支持大文件上传链路的性能优化与能力复用。"
          ]
        },
        {
          "lead": "全局搜索与产品导航能力",
          "text": "针对产品功能较多、页面入口分散、用户查找路径较长的问题，推动 Cmd+K 全局搜索与页面跳转能力落地，改善功能入口的可发现性。",
          "children": [
            "结合产品使用场景规划高频 Action 与 AI Search，将全局搜索纳入后续 AI 化方向。"
          ]
        },
        {
          "lead": "Web 图片压缩 SDK",
          "text": "针对 B Web 缺乏统一图片压缩能力、社区方案在性能与接入成本方面不满足需求的问题，调研并自研图片压缩 SDK，提供统一、低接入成本的图片处理能力，并接入实际业务。",
          "children": []
        }
      ]
    }
  ]
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
    period: "2021.12 — 2023.02",
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
  degree: "深圳技术大学 · 物联网工程 · 本科",
  period: "2019.9 — 2023.6",
};

export const nav = [
  { label: "手记", href: "/writing/" },
  { label: "作品", href: "/projects/" },
  { label: "这个人", href: "/about/" },
];

export const writingTopics = [
  { id: "agent", label: "AI / Agent", color: "var(--s-agent)" },
  { id: "devtools", label: "DevTools", color: "var(--s-devtools)" },
  { id: "infra", label: "系统工程", color: "var(--s-field)" },
  { id: "notes", label: "实践手记", color: "var(--s-note)" },
];

export const seriesOf = (id: string) =>
  writingTopics[id.startsWith("agent-eng") ? 0 : id.startsWith("devtools-") ? 1 : id.startsWith("infra-") ? 2 : 3];
