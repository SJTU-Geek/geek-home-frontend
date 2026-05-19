import './Placeholder.css';

interface Props {
  eyebrow: string;
  title: string;
  description: string;
}

export default function Placeholder({ eyebrow, title, description }: Props) {
  return (
    <section className="placeholder">
      <div className="placeholder__grid" aria-hidden />
      <div className="container placeholder__inner">
        <p className="section-eyebrow">{eyebrow}</p>
        <h1 className="placeholder__title corner">{title}</h1>
        <p className="placeholder__desc">{description}</p>
        <div className="placeholder__terminal">
          <div className="placeholder__terminal-head">
            <span /><span /><span />
            <em>~/syga/{title.toLowerCase()}</em>
          </div>
          <div className="placeholder__terminal-body">
            <p>
              <span className="prompt">$</span> ls -la ./content
            </p>
            <p className="dim">total 0</p>
            <p className="dim">drwxr-xr-x  2 syga geek   64  May 19  2026 .</p>
            <p className="dim">drwxr-xr-x 24 syga geek  768  May 19  2026 ..</p>
            <p>
              <span className="prompt">$</span> echo "coming soon..."
            </p>
            <p className="red">coming soon...</p>
            <p>
              <span className="prompt">$</span>{' '}
              <span className="caret">_</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
