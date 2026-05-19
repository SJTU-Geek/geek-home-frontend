import { useEffect, useRef, useState } from 'react';

interface Props {
  text: string;
  speed?: number;
  start?: boolean;
  className?: string;
}

/**
 * 终端打字机效果，带闪烁光标。
 */
export default function Typewriter({
  text,
  speed = 60,
  start = true,
  className = '',
}: Props) {
  const [shown, setShown] = useState('');
  const idx = useRef(0);

  useEffect(() => {
    if (!start) return;
    idx.current = 0;
    setShown('');
    const id = window.setInterval(() => {
      idx.current += 1;
      setShown(text.slice(0, idx.current));
      if (idx.current >= text.length) {
        window.clearInterval(id);
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed, start]);

  return (
    <span className={`typewriter ${className}`.trim()}>
      {shown}
      <span className="typewriter__caret" aria-hidden>
        _
      </span>
    </span>
  );
}
