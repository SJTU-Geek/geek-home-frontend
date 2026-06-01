import Reveal from '../components/Reveal';
import './About.css';

const paragraphs = [
  '上海交通大学学生信息技术协会，别名思源极客协会，简称思源极协，是在上海交通大学学生工作指导委员会领导下，由学生事务中心、网络信息中心、共青团上海交通大学委员会共同指导的校级学生组织。协会汇集校内信息技术人才，是学校培养、组织学生自主参与校园信息化建设的平台与纽带。',
  '在上级主管部门指导与支持下，协会接受"智慧学工"信息化专职指导教师与兼职辅导员直接指导，接受"智慧学工"信息化专员的技术支持，协助学校各相关部门开展学生工作信息化建设。协会主要职责包括协助推进"智慧学工"项目整体进度，协助提升学工信息化建设质量，积极探索学工信息化理论研究，组织开展信息化技能公众培训，组织开展信息化素养提升活动，承接延续学生信息化优秀成果，探索打造数字化校园文化品牌，勇敢尝试信息化项目成果孵化。',
  '协会内部设有业务部、技术部、设计部、项目部、成员部五大部门，承担专业技术职责及行政管理职责。业务部负责统筹与组织调研走访、需求分析、对外联络、业务优化与咨询、交叉理论研究等工作。技术部负责统筹与实施技术开发、系统测试、基础设施运维、安全保障与风险评估等工作。设计部负责统筹与实施文案设计、视觉设计、体验设计以及协会宣传等工作。成员部负责统筹与规划成员管理、业务培训和团队建设，优化团队结构，提升成员专业能力；同时承担重大事件与会议记录、文件起草与修订等任务，规范文件管理工作，确保重要信息记录与传承。项目部负责统筹与实施立项评估、分工排期、进度管理、协同支持、资料归档等工作，确保项目可行、项目进度可控，促进跨部门合作。',
  '协会始终坚持以"来自学生、立足学生、服务学生、引领学生"为发展定位，引领学生在服务实践中践行科技向善理念、在科技创造中贡献交大智慧，不断传承交大精神，共创美好未来，持续打造符合每一代上海交通大学学子切实需要的数字化、智慧化美好校园生态。',
];


export default function About() {
  return (
    <div className="about">
      <section className="about__hero">
        <div className="about__hero-grid" aria-hidden />
        <div className="container about__hero-inner">
          <p className="section-eyebrow">// 关于协会 · About</p>
          <h1 className="about__title">
            <span className="glitch" data-text="上海交通大学学生信息技术协会">
              上海交通大学学生信息技术协会
            </span>
          </h1>
          <p className="about__alias">
            <span>别名</span>
            思源极客协会
            <span>简称</span>
            思源极协
          </p>
          <p className="about__alias">
            <span>EN</span>
            SJTU Student Information Technology Association
            <span>·</span>
            SJTUSITA / SYGA
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container about__content">
          {paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 80}>
              <p className="about__para">
                <span className="about__para-no">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {p}
              </p>
            </Reveal>
          ))}

          <Reveal className="about__motto">
            <span className="accent">来自学生</span>
            <span>·</span>
            <span className="accent">立足学生</span>
            <span>·</span>
            <span className="accent">服务学生</span>
            <span>·</span>
            <span className="accent">引领学生</span>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
