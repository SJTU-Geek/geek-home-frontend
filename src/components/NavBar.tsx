import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import brandSvg from '../assets/brand.svg';
import './NavBar.css';

const links = [
  { to: '/', label: '首页', en: 'Home' },
  { to: '/products', label: '产品', en: 'Products' },
  { to: '/news', label: '新闻', en: 'News' },
  { to: '/about', label: '关于', en: 'About' },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner container">
        <NavLink to="/" className="nav__brand" onClick={() => setOpen(false)}>
          <img src={brandSvg} alt="思源极客协会" />
        </NavLink>

        <button
          className={`nav__toggle ${open ? 'is-open' : ''}`}
          aria-label="导航菜单"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>

        <nav className={`nav__menu ${open ? 'is-open' : ''}`}>
          {links.map((l, i) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `nav__link ${isActive ? 'is-active' : ''}`
              }
            >
              <span className="nav__link-idx">0{i + 1}.</span>
              <span className="nav__link-cn">{l.label}</span>
              <span className="nav__link-en">{l.en}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
