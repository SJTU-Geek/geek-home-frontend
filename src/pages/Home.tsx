import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import HeroCanvas from '../components/HeroCanvas';
import Typewriter from '../components/Typewriter';
import Reveal from '../components/Reveal';
import GeekCorner from '../components/GeekCorner';
import techNetworkImg from '../assets/tech-network.png';
import dotBlurImg from '../assets/logo-dot-blur.png';
import groupPhotoImg from '../assets/group-photo.jpg';
import './Home.css';

/* ---------- 数据 ---------- */

const timeline = [
  {
    year: '2011',
    title: '东岳网络工作室',
    desc: '学生自发组建的技术研究团体，致力于培养信息化素养与技术交流文化。',
  },
  {
    year: '2023.12',
    title: '学生信息化调研小组',
    desc: '融合多方学生组织与课题组资源，初步形成跨领域协同合作机制。',
  },
  {
    year: '2024.12',
    title: '思源极客协会',
    desc: '统一品牌，加强"集团作战"式发展，推进技术人才培养，持续打造符合每一代学子的数字化、智慧化校园生态。',
  },
];

const goalGroups = [
  {
    tag: '赋能类',
    color: '#c9151e',
    items: [
      {
        no: '01',
        title: '推进"智慧学工"项目整体进度',
        desc: '面向学校各机关部门、学院、学生群体，开展系统建设的需求调研、业务梳理、规划设计与系统测试维护等工作，支撑项目顺利实施。',
      },
      {
        no: '02',
        title: '协助提升学工信息化建设质量',
        desc: '对各项业务进行深入梳理、分析、评估，从系统安全性、流程合理性、体验舒适性等方面提出优化改进方案，以提升学生的数字化校园体验。',
      },
    ],
  },
  {
    tag: '研究类',
    color: '#43d9c1',
    items: [
      {
        no: '03',
        title: '积极探索学工信息化理论研究',
        desc: '开展学生工作信息化的理论研究与社会实践，尝试信息、设计类与管理、政治类等学科交叉融合，推动高校学生工作信息化建设领域的理论与实践。',
      },
    ],
  },
  {
    tag: '科普类',
    color: '#ffc043',
    items: [
      {
        no: '04',
        title: '组织开展信息化技能公众培训',
        desc: '定期邀请专家与协会资深成员组织专题技能培训，推进信息化知识的传播与传承，提高在校师生的信息化思维水平与信息化技术能力。',
      },
      {
        no: '05',
        title: '组织开展信息化素养提升活动',
        desc: '立足学生群体信息素养现状，营造健康的校园数字文化氛围、提高学生信息素养、普及信息安全意识。',
      },
    ],
  },
  {
    tag: '延续类',
    color: '#7aa6ff',
    items: [
      {
        no: '06',
        title: '承接延续学生信息化优秀成果',
        desc: '对由学生开发、但缺乏维护管理能力的优秀信息化作品，本会将在取得授权许可、经审核批准后，接管后续开发、运维、改造等工作。',
      },
    ],
  },
  {
    tag: '创新类',
    color: '#c8324a',
    items: [
      {
        no: '07',
        title: '探索打造数字化校园文化品牌',
        desc: '结合学校育人理念，从广大学生的实际生活需求、学习需求、文化需求角度出发，打造符合当代学生认知与认同的数字化校园文化品牌项目。',
      },
      {
        no: '08',
        title: '勇敢尝试信息化项目成果孵化',
        desc: '鼓励学生挑战创新、项目孵化，将创新想法转化为科创技术成果、项目与课题，为䇹政基金、互联网+、学生创业等项目培养、输送优秀人才与团队。',
      },
    ],
  },
];

const departments = [
  {
    name: '业务部',
    en: 'Business',
    type: '执行部门',
    duty: '组织调研走访、对外联络、理论研究等',
  },
  {
    name: '技术部',
    en: 'Tech',
    type: '执行部门',
    duty: '实施技术开发、设施运维、安全保障等',
  },
  {
    name: '设计部',
    en: 'Design',
    type: '执行部门',
    duty: '负责视觉设计、文案设计、对外宣传等',
  },
  {
    name: '成员部',
    en: 'Members',
    type: '行政部门',
    duty: '统筹成员管理、业务培训与团队建设，承担文件管理及规范等工作',
  },
  {
    name: '项目部',
    en: 'Project',
    type: '行政部门',
    duty: '统筹项目执行情况，确保项目可行、进度可控',
  },
];

const pipeline = [
  '需求调研',
  '原型设计',
  '数据梳理',
  '源头对接',
  '测试调优',
  '成果落地',
];

const projects = [
  {
    name: '校园成就系统',
    subtitle: 'Campus Achievement',
    status: '已发布',
    url: 'https://geek.sjtu.edu.cn/badges/',
    tagline: '一套结构化、可视化的成长记录与激励机制平台。',
    tags: ['成就', '徽章', '校园成长'],
    accent: '#c8324a',
  },
  {
    name: 'SJTU Wiki 校园百科平台',
    subtitle: 'Student-led Campus Wiki',
    status: '已发布',
    url: 'https://sjtu-geek.github.io/SJTU-Wiki/',
    tagline: '由学生主导建设的非官方校园百科，构建持续更新的知识库。',
    tags: ['百科', '知识库', '协同编辑'],
    accent: '#0fa382',
  },
  {
    name: '学生 AI+ 素养提升计划',
    subtitle: 'AI Literacy Enhancement',
    status: '策划中',
    url: '',
    tagline: '面向全体在校学生的系统化人工智能素养提升项目。',
    tags: ['AI', '素养教育', '讲座体系'],
    accent: '#6a4cc8',
  },
];

const joinBenefits = [
  {
    title: '实战项目试炼场',
    desc: '多部门联动项目，从开发运维到宣传策划，全方位提升专业技能与执行力。',
  },
  {
    title: '素养提升计划',
    desc: '资深学长学姐与专业教师全程指导，系统化素养培训助你快速进阶。',
  },
  {
    title: '跨领域交流平台',
    desc: '技术、设计、管理等领域同学汇聚，碰撞火花，协作共赢。',
  },
  {
    title: '成果全校推广',
    desc: '你的创意与项目，将有机会服务全校师生，成为智慧校园的核心力量。',
  },
];

const joinLinks = [
  {
    label: 'QQ Group',
    title: '协会 QQ 交流群',
    url: 'https://qm.qq.com/q/Db9Mf788zo',
    urlText: 'qm.qq.com/q/Db9Mf788zo',
    cta: '加入群聊',
  },
  {
    label: 'Apply',
    title: '招新报名问卷',
    url: 'https://ssc.sjtu.edu.cn/f/fdd3762e',
    urlText: 'ssc.sjtu.edu.cn/f/fdd3762e',
    cta: '立即报名',
  },
  {
    label: 'Feedback',
    title: '意见反馈',
    url: 'https://ssc.sjtu.edu.cn/f/4282a590',
    urlText: 'ssc.sjtu.edu.cn/f/4282a590',
    cta: '提建议',
  },
];

/* ---------- 组件 ---------- */

export default function Home() {
  return (
    <div className="home">
      {/* ============ HERO ============ */}
      <section className="hero">
        <div
          className="hero__bg"
          style={{ backgroundImage: `url(${techNetworkImg})` }}
        />
        <div className="hero__bg-overlay" />
        <HeroCanvas />
        <div className="hero__scanlines" />
        <img
          src={dotBlurImg}
          alt=""
          className="hero__dotblur"
          aria-hidden
        />

        <div className="hero__inner container">
          <div className="hero__meta">
            <span className="hero__meta-dot" />
            <Typewriter
              text="// SYSTEM INITIALIZED · WELCOME, GEEK."
              speed={28}
            />
          </div>

          <h1 className="hero__title">
            <span className="hero__title-zh glitch" data-text="思源极客协会">
              思源极客协会
            </span>
            <span className="hero__title-en">
              SJTU Student Information Technology Association
            </span>
          </h1>

          <p className="hero__slogan">
            来自学生<span className="dot">·</span>立足学生
            <span className="dot">·</span>服务学生<span className="dot">·</span>
            引领学生
          </p>

          <div className="hero__actions">
            <Link to="/products" className="btn btn--primary">
              <span>查看核心项目</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="square"
                />
              </svg>
            </Link>
            <Link to="/about" className="btn btn--ghost">
              了解协会
            </Link>
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-k">EST.</span>
              <span className="hero__stat-v">2024.12</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-k">DEPT.</span>
              <span className="hero__stat-v">05</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-k">CODE</span>
              <span className="hero__stat-v">SYGA / SITA</span>
            </div>
          </div>
        </div>

        <div className="hero__scroll" aria-hidden>
          <span>SCROLL</span>
          <span className="hero__scroll-bar" />
        </div>
      </section>

      {/* ============ 名称 + 宗旨 ============ */}
      <section className="section intro" id="mission">
        <div className="container intro__inner">
          <Reveal className="intro__left">
            <p className="section-eyebrow">// 协会简介</p>
            <h2 className="section-title">
              一个由学生主导的<br />
              <span className="accent">信息技术</span>校级组织
            </h2>
            <p className="intro__lead">
              协会全称{' '}
              <strong>上海交通大学学生信息技术协会</strong>，英文全称{' '}
              <strong>SJTU Student Information Technology Association</strong>，别名{' '}
              <strong>思源极客协会</strong>，简称{' '}
              <strong>思源极协</strong>，英文别名{' '}
              <strong>Si-Yuan Geek Association</strong>，是在上海交通大学学生工作指导委员会领导下，
              由学生事务中心、网络信息中心、共青团上海交通大学委员会共同指导的校级学生组织。
            </p>
            <p className="intro__lead">
              协会汇集校内信息技术人才，是学校培养、组织学生自主参与校园信息化建设的平台与纽带。
            </p>
            <div className="intro__codes">
              <span>SJTUSITA</span>
              <span>SYGA</span>
            </div>
          </Reveal>

          <Reveal className="intro__right" delay={120}>
            <div className="intro__card corner">
              <img
                src={groupPhotoImg}
                alt="思源极客学生信息技术协会 2026年春季学期全体会议合影"
                className="intro__card-img"
              />
              <div className="intro__card-meta">
                <span className="intro__card-tag">// 2026 SPRING · ALL-HANDS</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 发展历程 ============ */}
      <section className="section history">
        <div className="container">
          <Reveal>
            <p className="section-eyebrow">// 发展历程</p>
            <h2 className="section-title">
              十余载传承，从东岳到<span className="accent">极协</span>
            </h2>
          </Reveal>
          <div className="timeline">
            {timeline.map((t, i) => (
              <Reveal key={t.year} delay={i * 120} className="timeline__item">
                <div className="timeline__node" aria-hidden>
                  <span />
                </div>
                <div className="timeline__content corner">
                  <span className="timeline__year">{t.year}</span>
                  <h3 className="timeline__title">{t.title}</h3>
                  <p className="timeline__desc">{t.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 核心目标 ============ */}
      <section className="section goals">
        <div className="container">
          <Reveal>
            <p className="section-eyebrow">// 核心目标</p>
            <h2 className="section-title">
              八项使命 · 五大维度的<span className="accent">行动框架</span>
            </h2>
          </Reveal>

          <div className="goals__grid">
            {goalGroups.map((g, gi) =>
              g.items.map((item, ii) => (
                <Reveal
                  key={item.no}
                  delay={(gi * 2 + ii) * 80}
                  className="goal-card corner"
                >
                  <span
                    className="goal-card__tag"
                    style={{ color: g.color, borderColor: g.color }}
                  >
                    {g.tag}
                  </span>
                  <span className="goal-card__no">{item.no}</span>
                  <h3 className="goal-card__title">{item.title}</h3>
                  <p className="goal-card__desc">{item.desc}</p>
                </Reveal>
              )),
            )}
          </div>
        </div>
      </section>

      {/* ============ 组织架构 ============ */}
      <section className="section org">
        <div className="container">
          <Reveal>
            <p className="section-eyebrow">// 组织架构</p>
            <h2 className="section-title">
              五部协同 · <span className="accent">打造专业化学生团队</span>
            </h2>
          </Reveal>

          <Reveal delay={80} className="org__chairs">
            <span className="org__chairs-label">协会组成部门</span>
            <span className="org__chairs-line" aria-hidden />
          </Reveal>

          <div className="org__grid">
            {departments.map((d, i) => (
              <Reveal key={d.name} delay={i * 90} className="org-card corner">
                <div className="org-card__head">
                  <span className="org-card__name">{d.name}</span>
                  <span className="org-card__type">{d.type}</span>
                </div>
                <span className="org-card__en">{d.en} Dept.</span>
                <p className="org-card__duty">{d.duty}</p>
                <div className="org-card__roles">
                  <span>部长</span>
                  <span>副部长</span>
                  <span>成员</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 项目研发 ============ */}
      <section className="section rd">
        <div className="container">
          <Reveal>
            <p className="section-eyebrow">// 项目研发</p>
            <h2 className="section-title">
              一条贯穿始终的<span className="accent">研发流水线</span>
            </h2>
          </Reveal>

          <div className="rd__pipeline">
            {pipeline.map((step, i) => (
              <Reveal key={step} delay={i * 80} className="rd__step">
                <span className="rd__step-no">{String(i + 1).padStart(2, '0')}</span>
                <span className="rd__step-name">{step}</span>
                {i < pipeline.length - 1 && (
                  <span className="rd__step-arrow" aria-hidden>
                    →
                  </span>
                )}
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="section-eyebrow rd__sub-eyebrow">
              // 核心项目成果
            </p>
            <h3 className="rd__sub-title">
              从校园成就到 AI 素养，已落地或正在路上
            </h3>
          </Reveal>

          <div className="rd__projects">
            {projects.map((p, i) => {
              const inner = (
                <>
                  <span
                    className="proj-card__status"
                    data-status={p.status}
                    style={{ color: p.accent, borderColor: p.accent }}
                  >
                    {p.status}
                  </span>
                  <h4 className="proj-card__name">{p.name}</h4>
                  <span className="proj-card__sub">{p.subtitle}</span>
                  <p className="proj-card__tagline">{p.tagline}</p>
                  <div className="proj-card__tags">
                    {p.tags.map((t) => (
                      <span key={t}>#{t}</span>
                    ))}
                  </div>
                </>
              );
              return (
                <Reveal key={p.name} delay={i * 120} className="proj-card-wrap">
                  {p.url ? (
                    <a
                      className="proj-card corner"
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ '--accent': p.accent } as React.CSSProperties}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div
                      className="proj-card corner"
                      style={{ '--accent': p.accent } as React.CSSProperties}
                    >
                      {inner}
                    </div>
                  )}
                </Reveal>
              );
            })}
          </div>

          <Reveal className="rd__more">
            <Link to="/products" className="btn btn--ghost">
              查看全部项目 →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ 招新 / 召集令 ============ */}
      <section className="section join">
        <div className="container">
          <Reveal>
            <p className="section-eyebrow">// 加入我们 · Join us</p>
            <h2 className="section-title join__title">
              校园数智化先锋 · <span className="accent">召集令</span>
            </h2>
            <p className="join__lead">
              无论你是技术精英、创意先锋，还是沟通达人、管理人才，思源极客协会均为你提供施展才华的广阔空间。
              <strong>不限专业、无谓经验多少</strong>，只要心怀热忱、渴望为校园信息化建设贡献力量——
              这里便是成就梦想的起点。
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h3 className="join__sub">
              <span className="accent">{`>`}</span> 加入我们，你将收获
            </h3>
          </Reveal>

          <div className="join__benefits">
            {joinBenefits.map((b, i) => (
              <Reveal
                key={b.title}
                delay={120 + i * 80}
                className="join-benefit corner"
              >
                <span className="join-benefit__no">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h4 className="join-benefit__title">{b.title}</h4>
                <p className="join-benefit__desc">{b.desc}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <h3 className="join__sub">
              <span className="accent">{`>`}</span> 联系我们
            </h3>
          </Reveal>

          <div className="join__links">
            {joinLinks.map((l, i) => (
              <Reveal
                key={l.title}
                delay={160 + i * 100}
                className="join-link corner"
              >
                <div className="join-link__head">
                  <span className="join-link__label">// {l.label}</span>
                  <h4 className="join-link__title">{l.title}</h4>
                </div>

                <div className="join-link__qr">
                  <QRCodeSVG
                    value={l.url}
                    size={148}
                    bgColor="#FFFFFF"
                    fgColor="#1D211C"
                    level="M"
                    marginSize={1}
                  />
                </div>

                <a
                  className="join-link__url"
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={l.url}
                >
                  <span className="join-link__cta">{l.cta} ↗</span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <GeekCorner />
    </div>
  );
}
