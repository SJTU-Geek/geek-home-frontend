export type ProductStatus = '已发布' | '测试中' | '开发中' | '策划中'

export interface Product {
  /** 编号 */
  id: string
  /** 中文名称 */
  name: string
  /** 英文 / 副标题（可选，用于装饰） */
  subtitle?: string
  /** 状态 */
  status: ProductStatus
  /** 产品地址 */
  url?: string
  /** 一句话简介，用于卡片展示 */
  tagline: string
  /** 完整介绍（可多段） */
  description: string[]
  /** 核心特色 */
  features: { title: string; detail: string }[]
  /** 主图 / 多张图，第一张作为封面 */
  images: string[]
  /** 开发者，留空则展示占位符 */
  developers: string[]
  /** 主题强调色（hex），用于卡片细节 */
  accent: string
  /** 标签关键词 */
  tags: string[],
  /** 是否隐藏 */
  hidden: boolean
}

export const products: Product[] = [
  {
    id: 'campuse-achievements',
    name: '校园成就系统',
    subtitle: 'Campus Achievement',
    status: '已发布',
    url: 'https://geek.sjtu.edu.cn/badges/',
    tagline: '一套结构化、可视化的成长记录与激励机制平台。',
    description: [
      '校园成就系统旨在构建一套结构化、可视化的成长记录与激励机制平台，覆盖课业学习、社会实践、个人成长、体育运动、校园探索、生活趣事等成长维度，全面呈现学生在校期间的多元成长轨迹。',
      '系统内置数字徽章体系，用于标识学生在特定领域的达成成就。学生达到设定条件后即可获得对应数字徽章，例如首次进入即可解锁“学海新航”，第二课堂志愿服务时长超过 16 小时则可获得“公益先锋”。',
      '个人徽章墙采用重力感应视觉设计，已获得徽章会动态下落堆叠；点击任意徽章可查看详细信息并支持一键生成分享图片。后续还计划与校内资源兑换平台打通，建立基于徽章的激励兑换机制。'
    ],
    features: [
      { title: '成就体系分类清晰', detail: '涵盖六大类成长维度，分类明确。' },
      { title: '数据来源可信', detail: '对接校内多类信息系统，自动采集与实时更新。' },
      { title: '数字徽章呈现', detail: '每枚徽章独立设计、专属编号，兼具激励性与传播性。' },
      { title: '可视化成长轨迹', detail: '支持成就墙、分类汇总等多种视图。' },
      { title: '权威导出支撑', detail: '可导出个人成就报告，作为评奖评优数据支撑。' }
    ],
    images: ['https://notes.sjtu.edu.cn/uploads/upload_07986f0efb64a1d60bb41cdb48e7d9a8.png'],
    developers: [],
    accent: '#c8324a',
    tags: ['成就', '激励体系', '徽章', '校园成长'],
    hidden: false
  },
  {
    id: 'jbox-transfer',
    name: 'JboxTransfer 云盘迁移工具',
    subtitle: 'Jbox → New jCloud Migration',
    status: '已发布',
    url: 'https://pan.sjtu.edu.cn/jboxtransfer/',
    tagline: '交大云盘官方数据迁移工具，高效、安全、低门槛。',
    description: [
      'JboxTransfer 是交大云盘官方数据迁移工具，帮助校内师生高效、安全、便捷地将原 jBox 云盘文件迁移至新一代交大云盘。',
      '工具支持 Windows、macOS、Linux 等多平台运行，提供图形界面与命令行两种操作方式，满足不同用户需求。项目聚焦“高效率、高安全性、低操作门槛”三大目标。'
    ],
    features: [
      { title: '自动化迁移流程', detail: 'jAccount 授权后自动识别旧云盘文件结构，一键迁移或选择性迁移。' },
      { title: '后台静默运行', detail: '不占用本地磁盘空间，迁移过程中可继续使用计算机。' },
      { title: '任务管理与异常处理', detail: '内置任务列表，可暂停、恢复、取消，并提供详细错误信息。' },
      { title: '数据安全与隐私保护', detail: '所有数据仅在本地存储，无任何后门或数据收集。' }
    ],
    images: ['https://notes.sjtu.edu.cn/uploads/upload_654d22190c343c6c5d57f65f5839aef9.png'],
    developers: [],
    accent: '#3a7bd5',
    tags: ['云盘', '迁移工具', '跨平台'],
    hidden: false
  },
  {
    id: 'sjtu-wiki',
    name: 'SJTU Wiki 校园百科平台',
    subtitle: 'Student-led Campus Wiki',
    status: '已发布',
    url: 'https://sjtu-geek.github.io/SJTU-Wiki/',
    tagline: '由学生主导建设的非官方校园百科，构建持续更新的知识库。',
    description: [
      'SJTU Wiki 是一个由学生主导建设的非官方校园百科平台，旨在整合校内各类学习、生活、事务办理等信息资源，构建便捷、高效的信息导航系统。',
      '平台致力于打造一个由学生主导、持续更新的校园知识库，覆盖从入学准备到毕业就业的全周期信息支持。'
    ],
    features: [
      { title: '内容全面覆盖', detail: '涵盖学校简介、新生指南、信息服务、生活服务、本/研学习、校园文化等多板块。' },
      { title: '结构清晰易用', detail: '多级目录结构，支持快速导航，便于查找。' },
      { title: '协同编辑共建', detail: '鼓励用户参与编辑更新，共建共治的内容生态。' },
      { title: '智能问答（计划）', detail: '后续将引入大模型问答模块，支持自然语言查询。' }
    ],
    images: ['https://notes.sjtu.edu.cn/uploads/upload_f8c5868a089cfb1931c421bc1eb5f5f0.png'],
    developers: [],
    accent: '#0fa382',
    tags: ['百科', '知识库', '协同编辑'],
    hidden: false
  },
  {
    id: 'geek-home',
    name: '协会官网建设',
    subtitle: 'Geek Association Official Site',
    status: '策划中',
    url: 'https://geek.sjtu.edu.cn/',
    tagline: '思源极客协会对外形象、成果展示与合作对接的综合平台。',
    description: [
      '协会官网是“思源极客”学生信息技术协会对外展示组织形象、成果展示、合作对接的综合性平台。'
    ],
    features: [
      { title: '产品介绍', detail: '汇集协会主导或参与的重点项目，构建项目档案库。' },
      { title: '新闻发布', detail: '定期更新协会活动、项目进展和成员成果。' },
      { title: '协会介绍', detail: '介绍协会背景、组织架构与成员。' },
      { title: '招新通道', detail: '提供报名入口，吸引志同道合者加入。' }
    ],
    images: ['https://notes.sjtu.edu.cn/uploads/upload_e1def2691dd1448c5305efe020aefe4b.png'],
    developers: [],
    accent: '#a85a3a',
    tags: ['官网', '形象展示', '招新'],
    hidden: false
  },
  {
    id: 'literacy-enhancement',
    name: '学生 AI+ 素养提升计划',
    subtitle: 'AI Literacy Enhancement',
    status: '策划中',
    tagline: '面向全体在校学生的系统化人工智能素养提升项目。',
    description: [
      '“学生 AI+ 素养提升计划”由学生事务中心联合校团委、一门式学生服务中心、图书馆、网络信息中心、学生创新中心、计算机学院、人工智能学院等单位共同发起，由“思源极客”协会主导推进。',
      '计划以专题讲座为核心形式，构建多模块、多层次的内容体系，主要包括 AI 科普入门、AI+办公赋能、AI+创意生成、AI 智慧生态四大模块。',
      '通过组委会统筹协作、学生讲师团驱动、多平台推广宣传以及实训反馈闭环的实施机制，全面提升学生信息素养与人工智能应用能力，形成“受助—自助—助人”的良性循环。'
    ],
    features: [
      { title: 'AI 科普入门', detail: '人工智能基础、提示词工程、智能化工作流实践。' },
      { title: 'AI+ 办公赋能', detail: '能力提升、PPT 进阶、数据分析处理等场景应用。' },
      { title: 'AI+ 创意生成', detail: '图像生成、音视频与数字人创作、AI 课堂教学。' },
      { title: 'AI 智慧生态', detail: '搭建个人智能生态：智能体、自动化工作流、私有知识库。' }
    ],
    images: ['https://notes.sjtu.edu.cn/uploads/upload_0c1b1d2d4ddcbc8de7f180de7bd409f8.png'],
    developers: [],
    accent: '#6a4cc8',
    tags: ['AI', '素养教育', '讲座体系'],
    hidden: false
  },
  {
    id: 'jwb2.0',
    name: '交汇 OS',
    subtitle: 'Campus Notification Aggregator',
    status: '开发中',
    url: 'https://github.com/SJTU-Geek/SJTU-Home',
    tagline: '校园通知信息聚合与智能分发平台。',
    description: [
      '“交汇 OS”由“思源极客”协会联合网络信息中心开发，是一款校园智慧资讯订阅通知工具，旨在解决“校内信息来源分散、获取路径复杂、内容容易错过”的普遍问题。',
      '平台通过统一的信息聚合架构与可视化订阅机制，为全体师生提供定制化的校内资讯汇总与智能化推送服务。'
    ],
    features: [
      { title: '多源信息聚合', detail: '对接交大十余类内容源：教务、活动、就业、事务、天气、预约等。' },
      { title: '个性化订阅', detail: '按需选择内容，灵活启停通知源，精准推送。' },
      { title: '定时推送提醒', detail: '配合通知服务平台，实现交我办信息推送。' },
      { title: '界面简洁清晰', detail: '可视化订阅管理面板，体验友好。' }
    ],
    images: [
      'https://notes.sjtu.edu.cn/uploads/upload_3ca288a12128ef331bc5834a4aa585ea.png',
      'https://notes.sjtu.edu.cn/uploads/upload_b648f4f8417d80ef4f47b9df6587e99d.jpg',
      'https://notes.sjtu.edu.cn/uploads/upload_3b3f2320e1f810806f5b3fe392494db5.jpg',
      'https://notes.sjtu.edu.cn/uploads/upload_e9dabb55b829f795db36f52b0054f4d0.jpg',
      'https://notes.sjtu.edu.cn/uploads/upload_a64ddbf34326f44f8239d20bfb116682.jpg'
    ],
    developers: [],
    accent: '#1f7a8c',
    tags: ['通知聚合', '订阅', '智能推送'],
    hidden: false
  },
  {
    id: 'tongqu',
    name: '“同去网”重启计划',
    subtitle: 'Campus Co-activity Platform',
    status: '开发中',
    tagline: '校园自发组织活动与组队的安全、轻量平台。',
    description: [
      '十年前校内曾有官方活动组队服务平台“同去网”，可供学生自发组织非官方、小范围活动，后因系统迭代被“第二课堂”取代而逐渐淡出视线。',
      '当前学生组队信息多分散在群聊、朋友圈、校内论坛等非集成化渠道，信息传递碎片化、精准度低；外部第三方平台又存在身份认证、隐私和广告等隐患。',
      '随着学生活动组队需求日益丰富、数智校园建设需求日益深化，重启并升级“同去网”，构建一个安全、轻量、学生主导的自组织活动与组队平台，探索适用于校园自发组织的运营与治理机制，具有重要的现实意义和应用价值。'
    ],
    features: [
      { title: '校内身份安全', detail: '基于 jAccount 认证，规避外部平台隐私与广告问题。' },
      { title: '自发组队', detail: '面向日常学生活动，支持发布、看板、组队匹配。' },
      { title: '轻量学生主导', detail: '聚焦自发组织，区别于自上而下的活动报名。' },
      { title: '校园生态联动', detail: '探索与校内信息平台的数据互通与资源联动。' }
    ],
    images: [],
    developers: [],
    accent: '#d99543',
    tags: ['组队', '校园活动', '自组织'],
    hidden: false
  },
  {
    id: 'ai-counselor',
    name: 'AI 辅导员',
    subtitle: 'AI Counselor Assistant',
    status: '策划中',
    tagline: '基于大模型的校园事务智能问答系统。',
    description: [
      '“AI 辅导员”是基于语言大模型开发的校园事务智能问答系统，结合 DeepSeek API 接口与结构化知识库，面向学生与新入职教师提供具备语气风格控制与内容可信度保障的智能咨询服务。',
      '系统模拟辅导员角色，构建具备校园情境适应性的 AI 助理平台。'
    ],
    features: [
      { title: '校园问答咨询', detail: '覆盖选课、奖助、心理、学术规范、事务办理等高频咨询。' },
      { title: '新师培训助手', detail: '支持新进教师快速熟悉办公流程、系统操作与任务安排。' },
      { title: '人格设定与语气控制', detail: '通过身份标签与风格模板，保障回答温和、规范、有人情味。' },
      { title: '知识库与敏感词过滤', detail: '校内专属知识库结合敏感词规则，回复权威安全合规。' }
    ],
    images: [],
    developers: [],
    accent: '#7d6cc7',
    tags: ['AI', '问答', '辅导员'],
    hidden: false
  },
  {
    id: 'sjtu-mcp',
    name: '校园信息服务 MCP',
    subtitle: 'SJTU MCP Server',
    status: '开发中',
    url: 'https://github.com/SJTU-Geek/sjtu-mcp-server',
    tagline: 'AI 领域的“USB-C 接口”，让大模型一次接入交大校园服务。',
    description: [
      'MCP（Model Context Protocol）是人工智能领域的开放标准，旨在为各类大模型与外部数据源、工具和系统提供统一、可扩展的“上下文”对接方式。',
      '交大校园信息服务 MCP 旨在构建校园信息服务智能体，通过标准化接口将大模型与校园信息系统（如课表查询、图书馆预约、成绩分析等）深度对接。用户仅需自然语言指令即可完成复杂操作。',
      '系统将分散的校园服务整合为统一的 AI 交互入口，既保障了数据安全与本地化部署需求，又通过开源协议降低了使用门槛，为大模型在教育场景的落地提供了轻量化解决方案。'
    ],
    features: [
      { title: '人工智能应用落地', detail: '让大模型不再止步于对话，而是真正完成各种工作。' },
      { title: '校园生态智慧互联', detail: '通过大模型连接校园信息服务，实现数据流通与生态共享。' },
      { title: '统一协议降低门槛', detail: '通过 MCP 协议对接工具，一行命令即可启动私人智能体。' },
      { title: '开源社区共建生态', detail: '完全开源，任何人都可以贡献代码、扩展自己的系统。' }
    ],
    images: ['https://notes.sjtu.edu.cn/uploads/upload_5ad17ac3b2eead7966c0920c1bbb4345.png'],
    developers: [],
    accent: '#2e8b8b',
    tags: ['MCP', '大模型', '开源'],
    hidden: false
  },
  {
    id: 'campus-dominate',
    name: '交大“制霸”',
    subtitle: 'CampusDominate',
    status: '测试中',
    url: 'https://github.com/SJTU-Geek/CampusDominate',
    tagline: '一款超好玩的校园地图标记生成工具。',
    description: [
      '交大“制霸”是一款超好玩的地图标记生成工具，这里有超过 100 个交大闵行校区的区域等你前来打卡。',
      '你可以将去过的地区进行记录，标记过的地方会出现不同的颜色，代表到访的频率或熟悉程度。标记完成后，可一键生成图片，用于分享到社交软件。类似于百度地图、高德地图的足迹功能。'
    ],
    features: [
      { title: '熟悉校园环境', detail: '帮助新生熟悉校园，提高在交大的归属感。' },
      { title: '操作简单易用', detail: '只需在空白地图上点点点，即可生成属于自己的“制霸”地图。' },
      { title: '社交分享传播', detail: '一键生成图片分享至 QQ、微信，渠道多样、传播便捷。' }
    ],
    images: [],
    developers: [],
    accent: '#e07b59',
    tags: ['地图', '足迹', '社交分享'],
    hidden: false
  },
  {
    id: 'trailestone',
    name: 'Trailestone',
    subtitle: 'Trail + Milestone',
    status: '策划中',
    tagline: '里程碑式的轨迹：成员流动的纵向河流图。',
    description: [
      '项目名含义：Trail + Milestone，“里程碑式的轨迹”——强调 “trail” 本身具有里程碑般的重要性，用于记录企业、组织、家庭及其成员的变动轨迹或一系列重大事件。',
      '这是一个开源项目，构建一个成员（团队、企业、家族都可以）的流动树，类似一个纵向的桑基图（也称之为河流图），可记录每个成员加入时间、大事记、何时离开去了哪里等。',
      '通过接受 Markdown、JSON 等格式文本，或通过数据库来展示信息。'
    ],
    features: [
      { title: '河流图可视化', detail: '纵向桑基图直观呈现成员流动与重大事件。' },
      { title: '多源数据输入', detail: '支持 Markdown、JSON、数据库等多种数据来源。' },
      { title: '通用场景适配', detail: '可用于团队、企业、家族等多种成员组织。' },
      { title: '完全开源', detail: '欢迎社区参与共建。' }
    ],
    images: ['https://notes.sjtu.edu.cn/uploads/upload_d3c445bf7fa6aa43b11b15694d7dc433.jpg'],
    developers: [],
    accent: '#5d8a66',
    tags: ['可视化', '河流图', '开源'],
    hidden: false
  }
]
