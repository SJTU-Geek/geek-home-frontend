/** 甘特排期数据：与 products.ts 中的 Product.id 关联 */

export interface ScheduleTask {
  /** 简短标题（用于左侧列表） */
  title: string
  /** 详细说明（用于 tooltip / 副文本） */
  detail?: string
  /** 起始日期，inclusive，YYYY-MM-DD */
  start: string
  /** 结束日期，inclusive，YYYY-MM-DD */
  end: string
}

export interface ProductSchedule {
  /** 对应 Product.id */
  productId: string
  /** 项目展示名 */
  productName: string
  tasks: ScheduleTask[]
}

export const schedules: ProductSchedule[] = [
  {
    productId: 'campuse-achievements',
    productName: '校园成就系统',
    tasks: [
      {
        title: '代码接管',
        detail: '接管系统代码，撰写开发文档与接口规范，完成测试环境部署。',
        start: '2026-04-01',
        end: '2026-04-12'
      },
      {
        title: '首批逻辑校对',
        detail: '校对首批 16 个成就的判定逻辑，修正成就获取时间。',
        start: '2026-04-01',
        end: '2026-04-05'
      },
      {
        title: '规范化上线方案设计',
        detail: '设计“提案发起至多级审核”的自动化流程原型，基于 SSC 表单进行搭建。',
        start: '2026-04-06',
        end: '2026-05-03'
      },
      {
        title: '第二批成就上线',
        detail: '完成第二批成就的数据对接、开发与上线测试。',
        start: '2026-04-06',
        end: '2026-05-03'
      },
      {
        title: 'AI 自动化生图接入',
        detail: '打通 LogoMaker 工作流，自动生成成就底图及边框元素，缓解第三批海量成就上线的设计压力。',
        start: '2026-04-13',
        end: '2026-05-03'
      },
      {
        title: '第三批成就设计',
        detail: '开展第三批成就征集、筛选打分、数据对接。',
        start: '2026-05-04',
        end: '2026-05-31'
      },
      {
        title: '期末回顾',
        detail: '设计期末回顾页，推进宣发。',
        start: '2026-06-01',
        end: '2026-06-28'
      },
      {
        title: '第三批成就上线',
        detail: '正式上线第三批。',
        start: '2026-06-29',
        end: '2026-07-26'
      }
    ]
  },
  {
    productId: 'campus-dominate',
    productName: '交大“制霸”',
    tasks: [
      {
        title: '闵行校区数据校对',
        detail: '进一步校对建筑名称与官方对齐，增补校门、主干道路、桥洞等关键地标数据。',
        start: '2026-03-30',
        end: '2026-04-05'
      },
      {
        title: '校庆版面设计',
        detail: '结合校庆元素，补充各建筑历史名称，推出校庆版“交大制霸”版面并联合学联宣传推广。',
        start: '2026-03-30',
        end: '2026-04-05'
      },
      {
        title: '多校区地图绘制',
        detail: '启动并推进徐汇校区、医学院浦东校区地图绘制工作。',
        start: '2026-04-06',
        end: '2026-05-10'
      },
      {
        title: '新地图上线及文案整合',
        detail: '徐汇、浦东校区地图联调完毕正式上线，前端文案设计同步更新优化。',
        start: '2026-05-11',
        end: '2026-05-31'
      },
      {
        title: '游园会与迎新前瞻预研',
        detail: '构思并设计适用于 9 月中秋游园会及 26 级新生的“校园打卡”特别模式。',
        start: '2026-06-01',
        end: '2026-07-13'
      }
    ]
  },
  {
    productId: 'jwb2.0',
    productName: '交汇 OS',
    tasks: [
      {
        title: '学生事务场景聚焦',
        detail: '完成勤工助学、奖助学金查询等学生事务相关业务接口接入。',
        start: '2026-03-30',
        end: '2026-04-12'
      },
      {
        title: '双端系统开发',
        detail: '网页端与客户端核心业务框架并行搭建及测试，完成客户端与网页端的打包、签名与部署封装准备。',
        start: '2026-03-30',
        end: '2026-04-26'
      },
      {
        title: '底层数据通路扩展',
        detail: '接入“交大丢丢”失物招领提醒，进行体育场馆、第二课堂报名等功能测试，持续整合交大网站有效信息并扩充网站数量。',
        start: '2026-04-13',
        end: '2026-05-03'
      },
      {
        title: '系统上线',
        detail: '正式发布交汇 OS V1.0：Web 端提供基础功能，客户端提供完整系统功能。',
        start: '2026-05-04',
        end: '2026-05-18'
      },
      {
        title: '系统宣发及用户反馈调优',
        detail: '面向师生宣发，持续收集反馈并迭代优化体验。',
        start: '2026-05-04',
        end: '2026-07-27'
      },
      {
        title: '应用生态对接与工作流搭建',
        detail: '引入最新的 Skills 等智能体概念，挖掘业务需求搭建自动化工作流。',
        start: '2026-05-18',
        end: '2026-09-07'
      }
    ]
  },
  {
    productId: 'literacy-enhancement',
    productName: '学生 AI+ 素养提升计划',
    tasks: [
      {
        title: '问卷调研及课题定位',
        detail: '面向师生发放新一轮需求问卷，精准洞察当前师生最感兴趣的 AI 课题与高频痛点。',
        start: '2026-03-30',
        end: '2026-04-20'
      },
      {
        title: '往期讲座内容更新迭代',
        detail: '结合往期讲座反馈，对已有课件进行技术前沿更新与授课节奏优化。',
        start: '2026-03-30',
        end: '2026-04-12'
      },
      {
        title: 'OpenClaw 讲座内容与推送设计',
        detail: '针对 OpenClaw 设计前沿拓展讲座，同步完成配套宣发材料设计，制定多渠道引流方案。',
        start: '2026-04-06',
        end: '2026-05-03'
      },
      {
        title: 'AI 安全与伦理内容设计',
        detail: '围绕 AI 安全、隐私与伦理设计模块化讲座内容。',
        start: '2026-05-01',
        end: '2026-06-07'
      },
      {
        title: 'AI+ 办公赋能内容设计',
        detail: '围绕文献检索、PPT 进阶、数据处理等场景设计模块化内容。',
        start: '2026-05-01',
        end: '2026-06-07'
      },
      {
        title: '讲座开展及满意度调研',
        detail: '开展校内讲座，发放问卷调研讲座满意度，广泛吸纳学生讲师。',
        start: '2026-06-01',
        end: '2026-09-07'
      }
    ]
  }
]

export function getScheduleByIndex(index: string): ProductSchedule | undefined {
  return schedules.find((s) => s.productId === index)
}
