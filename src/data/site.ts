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
  updated: "2026.11.10",
  paragraphs: ["正在找下一份工作，欢迎来聊。"],
};

export const stats = [
  { value: "76.6s → 4.2s", label: "dpdm-fast · B Web 循环依赖检查" },
  { value: "100 / 27 PR", label: "研发 Agent 处理 issues 与可直接合并 PR" },
  { value: "38% → 82%", label: "多源 RAG · Context Recall@5 跃升" },
  { value: "30% → 3%", label: "Node.js BFF · 接入接口整体错误率压降" },
];

export interface HighlightItem {
  icon: string;
  text: string;
  link?: { label: string; href: string };
}

export const highlights: HighlightItem[] = [
  {
    icon: "🤖",
    text: "深度的 AI Native 工程思维与 Agent 架构能力：将设计配表（Figma AI 插件）、排障修 Bug（研发 Agent 产出 27 个可合并 PR）、测试验收（落地公司首个云端 QA Agent，将 E2E 从一下午缩至约 1 小时）到线上运维（OTA 监控触发 AI 自动回滚）全面 Agent 化；构建 Mastra 三层记忆与防过载 Processor 流水线、重构读写对称多源 RAG 与 CodeGraph / Skills 底座（赋能全公司核心 Agent，Recall@5 38%→82%），并将个人探索延伸至全天候屏幕记忆回溯、3D 角色自然动画重建（一下午产出多动作资产）与内置 Linux 的端侧具身智能。",
  },
  {
    icon: "🚗",
    text: "0 到 1 平台 Owner 与数据闭环治理：具备从痛点抽象、PRD 撰写、带队研发到跨团队推广落地的完整闭环能力；带领 1 名实习生与 1 名外包 1.5 个月交付多租户 OTA 平台（支撑 3 个 App 分钟级热更新与 AI 自动回滚），从 0 到 1 建设 Node.js BFF 覆盖全核心团队 70+ 路由，并通过 Trace 看板与每日群日报 @ 责任人机制将接口整体错误率从 30% 压降至 3%。",
  },
  {
    icon: "🍃",
    text: "无边界全栈与全端工程穿透：技术栈横跨 Web、React Native Hybrid、iOS / Android 原生、Electron / Tauri 桌面、NSH + QuickJS + Rust 端侧内置 Linux 容器及 Node.js / ClickHouse / PostgreSQL 后端；主导 Hybrid 转型与 Figma 插件将商户接入从 1 周缩至最快 2 小时、发版从超 1 周缩至 1 天，通过“接口拆分 + 流量回放 + Fallback”0 故障重构高耦合核心后端接口。",
  },
  {
    icon: "🦀",
    text: "极致性能工程与底层工具自研：习惯从 AST、CDP 协议、WASM 与状态库底层解决性能与工具链卡点；以 Rust / SWC 重写循环依赖检查将 CI 从 76.6s 降至 4.2s，主导前端、状态库与 ClickHouse MergeTree 慢查询治理使核心页加载与查询进入毫秒级、大盘 LCP 平均改善 38%。",
    link: {
      label: "dpdm-fast · GitHub",
      href: "https://github.com/GrinZero/dpdm-fast",
    },
  },
  {
    icon: "🧙‍♀️",
    text: "开源 node-network-devtools 填补 Node.js 服务端可视化网络抓包空白，以 HTTP/HTTPS 拦截与自建 CDP Server 将请求/响应体、Initiator 调用栈与 WebSocket 帧接入 Chrome DevTools；持续反哺 Node.js 官方核心仓库 Network Inspector，核心修复 PR 获上游合并。",
    link: {
      label: "node-network-devtools · GitHub",
      href: "https://github.com/GrinZero/node-network-devtools",
    },
  },
  {
    icon: "🌍",
    text: "英文与业务全链路协作：可独立开展英文技术会议、书面技术方案撰写和代码评审；具备客户 App 上架物料直接对接经验，功能上线后持续使用 PostHog / Datadog 观察埋点数据并驱动迭代。",
  },
];

export const skillDomains = [
  {
    id: "frontend",
    evidence: { label: "跨端与性能实践", href: "#mobile-engineering" },
    name: "全端与跨端工程",
    english: "Cross-Platform & Frontend",
    summary: "横跨 Web、React Native Hybrid、iOS / Android 原生、Electron / Tauri 桌面与 NSH 端侧容器，深入渲染、性能与跨端发行。",
    capabilities: [
      { name: "Web 与跨端应用架构", detail: "React / Next.js、React Native Hybrid 双向通信协议、多商户品牌资源隔离，以及 Electron → Tauri 桌面宿主重构与 NSH（QuickJS + Alpine Linux）端侧运行时。" },
      { name: "极致性能工程", detail: "Web Vitals / LCP 分位数治理、状态库 auto batching 与 proxy 懒加载、JS Bundle 与内存瘦身、IntersectionObserver 懒加载及性能预算防劣化。" },
      { name: "原生能力与自动化发行", detail: "Swift / Java 原生模块、Live Activity、BLE 硬件协议驱动，结合 Fastlane / TestFlight / App Store 审核与 Expo Updates OTA 分钟级热更新。" },
    ],
    stack: ["TypeScript", "React", "Next.js", "React Native", "Expo", "Electron", "Tauri", "NSH / QuickJS", "Swift", "Java", "Vite", "Webpack"],
  },
  {
    id: "backend",
    evidence: { label: "BFF 与后端治理", href: "#bff-project" },
    name: "后端与基础架构",
    english: "Backend & Infrastructure",
    summary: "围绕高可用与高性能构建 Node.js BFF、核心后端服务与底层工具链，打通数据库调优、大文件传输与协议调试。",
    capabilities: [
      { name: "Node.js BFF 与核心接口治理", detail: "从 0 到 1 建设 Hono BFF（70+ 路由），主导高频 metadata 批量合并，以及通过“接口拆分 + 流量回放比对 + Fallback”0 故障重构高耦合 getUserInfo 接口。" },
      { name: "数据库架构与 ClickHouse 调优", detail: "PostgreSQL（含 Advisory Lock + 乐观锁 CAS）、SQLite A/B 原子切换、Redis，以及 ClickHouse MergeTree 列式存储慢查询调优（秒级降至毫秒级）。" },
      { name: "底层协议与 Rust / WASM 工具", detail: "基于 Rust / SWC 重写 dpdm-fast（76.6s → 4.2s），自建 CDP Server 实现 Node.js 网络调试并反哺上游，Worker + WebAssembly 高吞吐文件分片上传。" },
    ],
    stack: ["Node.js", "Hono", "Express", "Rust", "SWC", "ClickHouse", "PostgreSQL", "Prisma", "SQLite", "Redis", "AWS S3", "CDP", "WebAssembly"],
  },
  {
    id: "ai",
    evidence: { label: "Agent 与 RAG 实践", href: "#ai-engineering" },
    name: "AI Native 与 Agent 工程",
    english: "AI Engineering",
    summary: "以 AI-First 重构研发、测试与运维全链路，构建具备长时记忆、防上下文过载、多跳检索与可信沙箱的生产级 Agent 系统。",
    capabilities: [
      { name: "Durable Agent 与三层记忆架构", detail: "Mastra Durable Agent、Pooled Sandbox 隔离、Working / Observational（后台提炼与反思压缩）/ User Memory 三层记忆，以及 InputProcessor 防上下文过载流水线。" },
      { name: "读写对称多源 RAG 与 CodeGraph", detail: "多源文档新鲜度分层与 LLM 富化、L0–L3 渐进改写、Google Agent Search + HopEngine 自适应多跳 + RRF + LLM Rerank（Recall@5 38%→82%），配套 CodeGraph 代码图谱与私有 Skills 网关。" },
      { name: "评估闭环与多模态 / 具身探索", detail: "Golden Dataset、分项 Scorer 与 LLM-as-judge 评测；延伸至屏幕 pHash + OCR/VLM 记忆回溯、DINOv2 + FK 3D 角色动画重建与端侧离线唤醒具身智能。" },
    ],
    stack: ["Mastra", "MCP", "RAG / HopEngine", "Google Agent Search", "CodeGraph", "Codex / Gemini", "pi-agent", "n8n", "DINOv2", "sherpa-onnx", "Agent Skills"],
  },
  {
    id: "devops",
    evidence: { label: "OTA 与可观测闭环", href: "#platform-engineering" },
    name: "DevOps 与可观测性",
    english: "DevOps & Observability",
    summary: "把多租户发布、AI 自动回滚、全链路 Trace、群日报追责和 CI 质量门禁连成数据驱动的治理闭环。",
    capabilities: [
      { name: "多租户 OTA 与 AI 自动回滚", detail: "基于 Expo Updates 协议以 runtimeVersion 严控原生兼容边界、channel 灰度隔离与 A/B Testing，完成 AI Native 监控适配实现异常触发 AI 紧急回滚。" },
      { name: "全链路可观测与错误率闭环", detail: "串联 Datadog / PostHog / Langfuse OTLP Trace、rrweb 24h 行为回放（BugSpy），通过接口看板与每日群日报自动 @ 责任人将 BFF 错误率从 30% 压至 3%。" },
      { name: "CI 提效与退化溯源", detail: "Rust 静态检查将 CI 提速 18 倍，结合符号级路由依赖、Git Diff 与遗传算法构建提交级性能影响面评分（食尾蛇工作流）。" },
    ],
    stack: ["Docker", "Kubernetes", "AWS", "Datadog", "PostHog", "Sentry", "Langfuse", "rrweb", "Fastlane", "Expo Updates"],
  },
  {
    id: "product",
    evidence: { label: "平台与自动化实践", href: "#mobile-engineering" },
    name: "产品 Owner 与工程提效",
    english: "Product & Ownership",
    summary: "从业务卡点出发制定目标与 PRD，带领团队推进平台落地，用自动化工具消除设计与研发之间的手工鸿沟。",
    capabilities: [
      { name: "0 到 1 立项与带队交付", detail: "承担 OTA 平台与多商户 App 目標制定、PRD 撰写、任务拆解及实习生/外包协作，1.5 个月交付多租户发布平台，兼顾交付期限与跨端一致性。" },
      { name: "设计研发一体化自动化", detail: "开发 Brand Figma Plugin 串联可视化配置、豆包 AI 自然语言改图、CDN 上传与配置入库，将单商户 onboard 从 1 周缩至最快 2 小时。" },
      { name: "复杂平台交互与客户协同", detail: "React Flow 真实拓扑可视化画布、Cmd+K 全局搜索与 AI Search 规划；直接对接海外客户 App 上架物料并基于埋点数据持续迭代。" },
    ],
    stack: ["PRD & 拆解", "Figma Plugin", "React Flow", "Global Search", "数据可视化", "多品牌定制", "英文技术协作"],
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
    company: "MoeGo",
    role: "全栈开发工程师",
    period: "2024.05 — 2026.08",
    intro:
      "围绕多商户 App、客户端发布平台（OTA）、Node.js BFF、后端核心系统与 AI 研发工作流开展全栈研发；承担数据库架构、接口性能优化与高可用治理，并在内部积极推进事后复盘机制。",
    sections: [
      {
        icon: "🔥",
        title: "AI Agent、三层记忆架构与多源 RAG 底座",
        id: "ai-engineering",
        stack: "Mastra · MCP · Google Agent Search · HopEngine · CodeGraph · PostgreSQL · Eval",
        blocks: [
          {
            lead: "云端 QA Agent（Qasey）：三层记忆架构、防上下文过载与 E2E 闭环",
            text: "针对手工编写评审用例与 E2E 验证耗时长（单次常需一个下午）、QA 个人经验难复用，且早期 n8n 工作流在长时运行中上下文极易过载的痛点，设计 API / Split Orchestration Worker / Pooled Sandbox 服务器拓扑与执行隔离，推动系统向 TypeScript / Mastra Durable Agent 演进，落地公司首个云端 Agent。",
            children: [
              "三层记忆体系：① 结构化 Working Memory 实时维护任务目标、覆盖边界与阻塞槽位；② Observational Memory 按 Token 水位自动触发轻量模型后台 Observation 提炼与 Reflection 反思压缩，支持跨会话分页 Recall 并严格隔离群聊共享与个人私有记忆；③ 基于 PostgreSQL Advisory Lock + Revision 乐观锁 CAS 实现跨会话 User Memory，安全沉淀长期测试偏好。",
              "防过载 Processor 流水线与 E2E 持久闭环：为彻底解决长时多轮调用中工具定义膨胀与大体积返回（如单次 Jira / PR 达 380k+ Token）撑爆上下文及静默超时问题，组装 InputProcessor 流水线——通过 ToolSearchProcessor（Top-K 动态按需挂载外部工具）、ToolCallFilter（跨轮次自动裁剪历史大体积原始工具输出，仅保留精简投影）、TokenLimiter 及到期前优雅收尾 Processor（预留窗口强制切 toolChoice: none 汇总结论）。",
              "结合支持 suspend / resume 的 E2E 持久工作流（冻结需求与 Base SHA → 隔离 Sandbox Author 编写与自检门禁 → Clean Verifier 全新工作区独立重放与录像采集 → QA 逐条审核及带反馈自动修复 → Draft PR 发布）与 Golden Dataset 回归评测，将 E2E 环节耗时从一个下午缩短至约 1 小时。",
            ],
          },
          {
            lead: "企业多源 RAG 与 AI 基础平台：读写对称检索、CodeGraph 与 Skills 分发",
            text: "针对原 RAG 引擎跨源召回率极低（接手时旧架构 Context Recall@5 仅 38%），且飞书、Slack、GitHub、Jira、Intercom 等多源知识孤岛、跨文档引用断裂的痛点，构建以 Context 为核心的读写对称架构。",
            children: [
              "读写对称检索与多跳精排：写路径统一摄取多源文档，引入新鲜度分层（hot/warm/cold）、生命周期管理与 LLM 富化（摘要、实体、潜在查询），私有 GCS 图文资产经无状态 HMAC 签名代理支持多模态检索；读路径设计 L0–L3 四级渐进降级预处理（实体识别、多语言改写、Mirror Text 假设回答段落），基于 Google Agent Search 多 Datastore 并行召回，叠加跨源 Reference 自适应多跳扩展（HopEngine）、跨 Query RRF 融合（k=60）、LLM Rerank 与相邻 Chunk 水合组装。",
              "通过 REST 与 MCP 统一服务内部全部核心 Agent（AskMoe 内部问答、客服 Agent、HR Agent、研发定位 Agent、QA Agent），内部 LLM-as-judge 评测中 Context Recall@5 由旧架构 38%、重构初版 60% 持续跃升至 71% → 82%，Answer Faithfulness 由 0.71 提升至 0.94。",
              "权限治理、可配置 Pipeline 与工程底座扩展：针对多 Agent 检索越权风险、失效文档难清理、模型配置分散及代码影响面难评估的痛点，实现调用方 Token 级知识源权限绑定、RBAC 申请流及文档手动删除 / exclude 重建控制；建设分阶段可配置 LLM Pipeline 管理台（React Flow 真实拓扑可视化）并接入 Datadog Agent Observability（run_id 评分反馈闭环）；开发基于不可变 Worktree 与 SQLite A/B Generation 原子切换的 CodeGraph 代码图谱（支持符号调用链与 Open PR 增量影响面分析 MCP 工具），以及带 OAuth/RBAC 与全链路日志脱敏的私有 Agent Skills 分发网关（支持 npx skills add/update 一键安全安装）。",
            ],
          },
          {
            lead: "研发定位与修复 Agent：跨系统证据聚合与自动修复",
            text: "针对研发历史散落在 Slack、Jira、GitHub、Sentry 与客服系统中导致排障链路极长的痛点，主导基于 Codex / Gemini Runtime、多源 RAG、领域 Skill 与 Tool Calling 的智能定位与修复工作流，自动聚合多源历史上下文并生成代码修复建议。",
            children: [
              "将常见客服问题平均定位时间从 1 小时缩短至 10 分钟，Sentry 问题处理从 20 分钟/项缩短至 5 分钟/项；截至离职累计处理 100 个 issue，建议有效率 >70%，产出 27 个可直接合并的 PR。",
            ],
          },
        ],
      },
      {
        icon: "🛠️",
        title: "全栈平台、高可用后端与闭环治理",
        id: "platform-engineering",
        stack: "TypeScript · Hono · Node.js · PostgreSQL · Expo Updates · Kubernetes · AWS · Datadog",
        blocks: [
          {
            lead: "客户端发布平台（OTA）：立项带队、兼容治理与 AI 秒级回滚",
            text: "针对客户端缺乏热更新、快速回滚、多租户隔离与发布审计的空白，制定平台目标、编写 PRD 并拆解任务，带领 1 名实习生与 1 名外包历时 1.5 个月交付完整版平台（个人负责后端 API、CLI、CI、业务接入及大部分管理后台），采用多租户架构支撑内部 3 个 App 接入使用。",
            children: [
              "兼容边界拦截与 AI 自动回滚：针对原生模块变更易引发热更新崩溃的风险，基于 Expo Updates 协议以 runtimeVersion 严格约束 Native 与 JS Bundle 兼容边界、以 channel 隔离灰度与多原生版本并行维护，补齐 A/B Testing 与发布审计；将热更新发布与回滚缩短至分钟级，成功拦截原生不兼容线上事故，并完成 AI Native 监控适配，实现异常触发后由 AI 快速执行紧急线上回滚。",
            ],
          },
          {
            id: "bff-project",
            lead: "Node.js BFF 平台：从 0 到 1 推广与接口错误率闭环治理",
            text: "针对前端直接组装多源后端数据复杂度高、跨团队联调成本大的痛点，基于 TypeScript / Hono / Kubernetes 落地首个 /init 聚合接口，配套路由脚手架与 K8s 调试 CLI 降低接入成本；截至离职，所有核心业务团队新需求统一经 BFF 接入，累计上线路由超 70 个。",
            children: [
              "可观测建设与错误率治理闭环：针对跨服务接口异常与契约偏移不透明、长期无人跟进导致错误率居高不下的痛点，接入与后端微服务对齐的全链路 Trace，建设接口错误率、schema 对齐率与服务流量看板，并通过每日群日报自动 @ 对应团队 Leader 或责任人跟进修复，推动接入接口整体错误率从约 30% 降至约 3%。",
            ],
          },
          {
            lead: "核心后端接口重构与统一上传 SDK：高可用治理与传输优化",
            text: "针对前端单页散落并发调用十余至二十余次 metadata 接口、消耗全站 Datadog 40%+ 配额，以及冷启动 getUserInfo 强耦合支付侧全量 Invoice 与外部 Stripe 查询导致严重慢查询与数据冗余缺失的技术债，主导前后端 metadata 自动合并与批量查询改造。",
            children: [
              "采用“接口拆分 + 流量回放比对 + 异常 Fallback 兜底”重构 getUserInfo，实现生产环境 0 故障平稳上线。",
              "大文件分片上传 SDK：针对业务大文件上传耗时长、弱网易中断、主线程阻塞及重复存储痛点，建设集成 AWS 直传、Multipart 分片断点续传、并发控制与 Worker 主线程隔离的统一 SDK；在业务对比口径下上传耗时降低 60%+、存储占用降低 50%+。",
            ],
          },
        ],
      },
      {
        icon: "📱",
        title: "多商户跨端架构、设计自动化与发行提效",
        id: "mobile-engineering",
        stack: "React Native · Next.js Hybrid · Swift · Java · Figma Plugin · Fastlane · TestFlight",
        blocks: [
          {
            lead: "多商户 App：Hybrid 架构转型与业务对齐",
            text: "作为客户端核心业务 Owner，针对客户强烈要求对齐 Web 端 Online Booking 完整功能、而纯原生开发进度滞后的瓶颈，主导 React Native + Next.js Hybrid 混合架构转型。",
            children: [
              "以公共协议统一 WebView / App 鉴权与双向通信，隔离字体、图标、图片与配色，快速补齐核心业务能力并按期交付 4 家商户。",
            ],
          },
          {
            lead: "设计研发自动化（Figma Plugin）与发版提效",
            text: "针对品牌资源依赖前端反复手工处理及多商户发版周期长（单次超 1 周）的痛点，独立开发 Figma Plugin 串联可视化配置、豆包 AI 自然语言改图、CDN 上传与配置入库，将单商户接入从最低 1 周缩短至平均 2 天、最快 2 小时。",
            children: [
              "覆盖 Native iOS（Swift）/ Android（Java）开发（建设 Live Activity 实时状态、地图与 IM 模块、修复通知点击崩溃），结合 Fastlane、TestFlight 与标准化客户上架物料对齐，将单次发版与物料处理耗时从超 1 周缩短至 1 天内，上线后持续通过 PostHog / Datadog 观察埋点数据。",
            ],
          },
        ],
      },
      {
        icon: "🧪",
        title: "Web / App 性能工程、可观测回溯与 Rust 工具链",
        id: "performance-engineering",
        stack: "Rust · SWC · WebVitals / LCP · rrweb · IndexedDB · Sentry",
        blocks: [
          {
            lead: "客户签单关键页面攻坚",
            text: "针对 T1 客户签单前核心页面加载慢、日历严重卡顿的紧急阻塞，一周内分层治理接口聚合、状态管理与渲染重排链路。",
            children: [
              "将首页表格加载从 1.95s 降至 270ms、日历从 3s 降至 400ms，保障关键客户顺利交付。",
            ],
          },
          {
            lead: "状态库防劣化与移动端瘦身",
            text: "针对复杂业务批量渲染与全量 schema 拖慢大盘性能，以及 App 首屏依赖膨胀导致内存高、热更新慢的痛点，在状态库引入 auto batching、schema getter/proxy 懒加载与性能预算红线。",
            children: [
              "使多页面 LCP 平均改善 38%（200–500ms），分位数专项中 P75 下降超 2s、P95 下降超 5s；治理 App 首屏依赖与 OTA 链路，使首屏耗时减少 400ms、内存降低约 150MB、热更新下载体积下降 50%+。",
            ],
          },
          {
            lead: "Rust 重写静态依赖检查（dpdm-fast）与性能退化溯源",
            text: "针对原 dpdm 循环依赖检查超 1 分钟、严重拖慢 30+ 名前端开发 CI 效率的痛点，使用 Rust 与 SWC 独立重写静态依赖分析工具，覆盖 99% 原有测试并接入生产 CI。",
            children: [
              "将 Web 检查耗时从 76.6s 降至 4.2s、App 从 46.7s 降至 3.28s；并在此基础上实现符号级路由依赖分析，结合 Git Diff、模块复杂度、AI 文件评分与遗传算法构建提交级性能影响面评估工作流（食尾蛇工作流）。",
            ],
            oss: {
              label: "GitHub",
              href: "https://github.com/GrinZero/dpdm-fast",
            },
          },
          {
            lead: "BugSpy 用户行为回溯与全局产品体验",
            text: "针对线上疑难缺陷难以复现、客服与研发反复沟通收集线索的痛点，基于 rrweb 与 IndexedDB 边缘存储设计保留最近 24 小时行为日志的回溯系统，打通 Intercom 工单与 Sentry 错误平台，提供故障前后的完整操作现场。",
            children: [
              "针对产品功能入口分散问题，推动 Cmd+K 全局搜索与快捷导航落地，并自研统一 Web 图片压缩 SDK 降低业务接入成本。",
            ],
          },
        ],
      },
    ],
  },
  {
    company: "米哈游",
    role: "前端开发工程师",
    period: "2023.06 — 2024.05",
    intro:
      "负责性能可视化平台（Sniffing WebVitals）与埋点协作平台的核心研发与跨栈 ClickHouse 慢查询深度调优，并独立设计超微运营公告 SDK 与 Worker + WASM 文件上传工具链。",
    sections: [
      {
        icon: "⚡",
        title: "性能可视化平台（Sniffing WebVitals）与埋点协作平台",
        stack: "React · Vite · Ant Design · Node.js · ClickHouse MergeTree",
        blocks: [
          {
            lead: "前端构建提速与核心模块重构",
            text: "针对性能监控平台前端构建启动缓慢、核心分析模块与埋点协作平台（Sniffing Together）交互待升级的痛点，重构 WebVitals 构建链路并独立交付指标大盘、单会话分析表格与字段管理。",
            children: [
              "同步主导埋点平台 Vite / Ant Design 架构升级与全局参数改造，使本地启动耗时从秒级降至毫秒级、构建产物缩减 20%。",
            ],
          },
          {
            lead: "Node.js + ClickHouse 列式存储慢查询深度调优",
            text: "针对性能可视化平台千万级监控上报数据下，指标大盘与多维分析的复杂查询处于秒级卡顿、高基数统计与多表关联易引发内存暴涨的痛点，跨栈深入 Node.js 服务端与 ClickHouse（MergeTree）底层开展 SQL 调优。",
            children: [
              "以 COUNT() 替代 COUNT(id) 并利用基于 simdjson 的 JSONExtractString 裁剪多余列块磁盘 IO；将查询 ORDER BY 严格对齐 MergeTree 建表主键排序键以消除全量内存重排序；以 IN 子查询/预过滤小表替代大表直接 LEFT JOIN 规避右表全量载入内存；并在大盘统计中以 uniqCombined 近似去重替代高开销精确 COUNT(DISTINCT)，将多个核心查询耗时从秒级降至毫秒级。",
            ],
          },
        ],
      },
      {
        icon: "📢",
        title: "运营公告 SDK 与对象存储工具链（OSS-SDK）",
        stack: "TypeScript · Micro-Reactive Runtime · Web Worker · WebAssembly · IE10",
        blocks: [
          {
            lead: "极限包体压缩与高吞吐校验",
            text: "针对游戏业务接入方要求严格兼容 IE10 且对宿主 SDK 体积高度敏感，以及大体积媒体资产上传校验阻塞主线程的痛点，从 0 到 1 设计运营公告 SDK 与 OSS-SDK。",
            children: [
              "自研微型响应式运行时与指数退避重试机制，将运营公告 SDK 包体从 200KB+ 极限压缩至 13KB 并稳定兼容 IE10。",
              "独立设计集成切片断点续传、视频有效帧截取与缩略图生成的 OSS-SDK，通过 Worker + WebAssembly 实现高性能 CRC32 校验，吞吐量较社区方案提升 10%–25%。",
            ],
          },
        ],
      },
    ],
  },
  {
    company: "腾讯",
    role: "前端开发实习生",
    period: "2021.12 — 2023.02",
    intro:
      "参与腾讯客户端性能分析平台（QAPM，面向银行与集团内部使用的性能检测平台）研发，主导前端工程化重构与多图表大屏渲染性能优化。",
    sections: [
      {
        icon: "👀",
        title: "QAPM 性能监控平台：工程化重构与多图表大屏性能优化",
        stack: "React · Redux · Saga · Webpack · Babel · IntersectionObserver",
        blocks: [
          {
            lead: "构建提速与大屏懒加载治理",
            text: "针对 QAPM 历史前端工程产物体积庞大、冷启动缓慢、缺乏代码质量门禁，以及单页数十个监控图表同时渲染导致严重卡顿的痛点，主导 Webpack / Babel 构建优化、自研内部 CLI 并引入 ESLint / Husky 质量流程。",
            children: [
              "使打包产物从 13.3MB 降至 2.7MB、首次启动从 33.1s 缩短至 18.8s（HMR 达 600ms）。",
              "独立负责用户行为轨迹、项目详情与跨时区方案，设计基于 IntersectionObserver 的通用懒加载 Hook 并推广覆盖 50+ 个监控页面，沉淀完整模块文档与新人指南；实习期间获中期考核「优」、终期考核「S」及「部门力求上进奖」。",
            ],
          },
        ],
      },
    ],
  },
];

export const education = {
  degree: "深圳技术大学 · 物联网工程 · 本科",
  period: "2019.09 — 2023.06",
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
