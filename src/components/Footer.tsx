import brandSvg from '../assets/brand.svg';
import './Footer.css';

const friends = [
  { name: '上海交通大学', url: 'https://www.sjtu.edu.cn/' },
  { name: '学生事务中心', url: 'https://affairs.sjtu.edu.cn/' },
  { name: 'SJTUG', url: 'https://mirrors.sjtug.sjtu.edu.cn/' },
  { name: 'SJMC', url: 'https://mc.sjtu.cn/' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__top">
          <div className="footer__brand">
            <img src={brandSvg} alt="思源极客协会" />
            <p>
              来自学生 · 立足学生 · 服务学生 · 引领学生
            </p>
          </div>

          <div className="footer__links">
            <span className="footer__links-title">友情链接</span>
            <ul>
              {friends.map((f) => (
                <li key={f.name}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer">
                    {f.name}
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M2 8L8 2M8 2H3.5M8 2V6.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="square"
                      />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© 2026 上海交通大学学生信息技术协会</span>
          <span className="footer__divider" aria-hidden>·</span>
          <span>沪交ICP备20250053</span>
        </div>
      </div>
    </footer>
  );
}
