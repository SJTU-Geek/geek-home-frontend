import geekCornerSvg from '../assets/geek-corner.svg';
import './GeekCorner.css';

export default function GeekCorner() {
  return (
    <div className="geek-corner" aria-hidden>
      <img src={geekCornerSvg} alt="" />
    </div>
  );
}
