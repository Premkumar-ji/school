import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchData } from '../api';

interface VisionQuote {
  text: string;
}

const getRoman = (num: number) => {
  const map: { [key: string]: number } = {
    M: 1000, CM: 900, D: 500, CD: 400,
    C: 100, XC: 90, L: 50, XL: 40,
    X: 10, IX: 9, V: 5, IV: 4, I: 1
  };
  let result = '';
  for (let key in map) {
    const repeat = Math.floor(num / map[key]);
    num -= repeat * map[key];
    result += key.repeat(repeat);
  }
  return result;
};

export default function Vision() {
  const [quotes, setQuotes] = useState<VisionQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData('vision-quotes').then(data => {
      if (data && Array.isArray(data)) setQuotes(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const updateCursor = (e: PointerEvent) => {
      if (containerRef.current) {
        containerRef.current.style.setProperty('--x', e.clientX.toString());
        containerRef.current.style.setProperty('--y', e.clientY.toString());
      }
    };
    window.addEventListener('pointermove', updateCursor);
    return () => window.removeEventListener('pointermove', updateCursor);
  }, []);

  return (
    <div className="vision-page-container" ref={containerRef}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;900&display=swap');

        .vision-page-container {
          --x: 50vw; --y: 50vh; --active: 0;
          background: #ffffff;
          font-family: 'Cormorant Garamond', serif;
          padding: 4rem 2rem 20rem 2rem;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow-x: hidden;
        }

        .main-title {
          font-size: clamp(3rem, 12vw, 8rem);
          font-weight: 900;
          color: #000;
          margin-bottom: 2rem;
          text-transform: uppercase;
          letter-spacing: -0.02em;
        }

        /* GRID */
        .vision-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          max-width: 900px;
          width: 100%;
        }

        @media(min-width: 768px) {
          .vision-grid {
            grid-template-columns: 1fr 1fr;
            gap: 3rem 5rem;
          }

          /* LEFT cards */
          .vision-grid article:nth-of-type(odd) {
            transform: translateY(-30px) rotate(-2deg);
            justify-self: start;
          }

          /* RIGHT cards */
          .vision-grid article:nth-of-type(even) {
            transform: translateY(60px) rotate(2deg);
            justify-self: end;
          }
        }

        /* CURSOR */
        .cursor, .cursor--text {
          position: fixed;
          top: 0;
          left: 0;
          transform: translate(calc((var(--x) * 1px) - 50%), calc((var(--y) * 1px) - 50%));
          border-radius: 50%;
          padding: 1.2rem;
          pointer-events: none;
          z-index: 10000;
          scale: var(--active, 0);
          transition: scale 0.3s ease-out;
          font-weight: 900;
        }

        .cursor {
          background: hsl(var(--hue, 0) 100% 75%);
          mix-blend-mode: difference;
          color: white;
        }

        .cursor--text {
          background: rgba(0,0,0,0.1);
          backdrop-filter: blur(4px);
          color: white;
        }

        .vision-page-container:has(article:hover) {
          --active: 1;
        }

        /* CARD */
        article {
          position: relative;
          width: 260px;
          aspect-ratio: 4/5;
          overflow: hidden;
          cursor: none;
          box-shadow: 0 12px 30px rgba(0,0,0,0.12);
          background: #fdfdfd;
          transition: transform 0.5s ease;
        }

        article:hover {
          z-index: 10;
          box-shadow: 0 30px 60px rgba(0,0,0,0.2);
        }

        article img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1.2s ease;
        }

        article:hover img {
          transform: scale(1.1);
        }

        article:nth-of-type(even):hover {
          --hue: 210;
        }

        article:nth-of-type(odd):hover {
          --hue: 320;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(transparent 30%, rgba(0,0,0,0.8));
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.5rem;
          color: white;
          text-decoration: none;
        }

        .article-num {
          font-size: 3rem;
          font-weight: 900;
          line-height: 0.8;
        }

        .article-text {
          font-size: 1.3rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 0.6rem;
          opacity: 0.85;
          line-height: 1.4;
        }

        /* RIGHT TEXT ALIGN */
        article:nth-of-type(even) .overlay {
          text-align: right;
          align-items: flex-end;
        }
      `}</style>

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="main-title"
      >
        Vision
      </motion.h1>

      <div className="vision-grid">
        <AnimatePresence>
          {!loading && quotes.map((quote, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <img
                src={`https://picsum.photos/500/700?random=${i + 300}`}
                alt="Vision"
              />
              <a href="#" className="overlay">
                <span className="article-num">{getRoman(i + 1)}</span>
                <span className="article-text">{quote.text}</span>
              </a>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {loading && (
        <div className="mt-20 font-mono tracking-widest opacity-30">
          SYNCHRONIZING...
        </div>
      )}

      <div className="cursor">Read</div>
      <div className="cursor cursor--text">Read</div>
    </div>
  );
}