import { Sparkles } from 'lucide-react';

const MARQUEE_ITEMS = [
  'Templates engineered to convert & scale',
  'Custom website design',
  'Production-ready templates',
  '90+ Core Web Vitals',
  'Templates engineered to convert & scale',
  'Custom website design',
  'Production-ready templates',
  '90+ Core Web Vitals'
];

export default function Marquee() {
  return (
    <div 
      className="w-full overflow-hidden select-none py-10 sm:py-16 relative"
      style={{
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)',
        maskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)'
      }}
    >
      <style>{`
        @keyframes spark-mq {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .spark-mq-track {
          display: flex;
          width: max-content;
          animation: spark-mq 45s linear infinite;
        }
        .spark-mq-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="spark-mq-track flex items-center">
        {MARQUEE_ITEMS.concat(MARQUEE_ITEMS).map((text, idx) => (
          <div key={idx} className="flex items-center gap-8 sm:gap-12 px-4 sm:px-6 shrink-0">
            <span 
              className="font-heading font-extrabold text-5xl sm:text-7xl md:text-[88px] leading-tight tracking-[-0.02em] uppercase whitespace-nowrap"
              style={{
                color: 'transparent',
                WebkitTextStroke: '1px rgba(247, 246, 251, 0.45)'
              }}
            >
              {text}
            </span>
            <span className="text-[#8e97f7] text-2xl sm:text-3xl shrink-0">
              ✦
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
