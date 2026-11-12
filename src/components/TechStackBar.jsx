import React from 'react';
import { Rocket } from 'lucide-react';

export default function TechStackBar() {
  const stacks = [
    {
      name: 'Figma',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 38 57" fill="none">
          <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
          <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
          <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
          <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
          <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
        </svg>
      )
    },
    {
      name: 'Html',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 512 512" fill="none">
          <path d="M71 460L30 0h452l-41 460-185 52-185-52z" fill="#E44D26"/>
          <path d="M256 472l149-42 35-394H256v436z" fill="#F16529"/>
          <path d="M256 208h-74l-5-57h79V95H112l15 170h129v-57zm0 148l-65-17-4-48h-56l8 94 117 32v-61z" fill="#EBEBEB"/>
          <path d="M256 95v56h79l-7 87h-72v56h67l-6 72-68 18v61l117-32 17-188 3-30 3-40 3-60H256z" fill="#fff"/>
        </svg>
      )
    },
    {
      name: 'React',
      icon: (
        <svg className="w-4 h-4 text-[#61DAFB]" viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor">
          <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
          <g stroke="#61DAFB" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2"/>
            <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
            <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
          </g>
        </svg>
      )
    },
    {
      name: 'Next.js',
      icon: (
        <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 180 180">
          <mask height="180" id="mask0" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: 'alpha' }}>
            <circle cx="90" cy="90" fill="black" r="90"/>
          </mask>
          <g mask="url(#mask0)">
            <circle cx="90" cy="90" fill="currentColor" r="90"/>
            <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear)"/>
            <rect fill="url(#paint1_linear)" height="72" width="12" x="115" y="54"/>
          </g>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear" x1="109" x2="144.5" y1="116.5" y2="160.5">
              <stop stopColor="white"/>
              <stop offset="1" stopColor="white" stopOpacity="0"/>
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear" x1="121" x2="120.799" y1="54" y2="106.875">
              <stop stopColor="white"/>
              <stop offset="1" stopColor="white" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      name: 'Tailwind',
      icon: (
        <svg className="w-4 h-4 text-[#38BDF8]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"/>
        </svg>
      )
    },
    {
      name: 'TypeScript',
      icon: (
        <svg className="w-4 h-4 text-[#3178C6]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0H1.125zM12.68 15.15c.294.618.736 1.125 1.325 1.52.588.396 1.28.594 2.076.594.647 0 1.218-.118 1.713-.353.495-.236.883-.565 1.163-.99.28-.423.42-.924.42-1.5 0-.47-.103-.89-.31-1.258-.205-.368-.507-.68-.905-.935-.398-.255-.89-.47-1.474-.645l-.645-.195c-.486-.147-.905-.316-1.257-.507-.353-.19-.624-.423-.814-.698-.19-.275-.285-.606-.285-.994 0-.44.126-.84.38-1.2.253-.36.61-.652 1.07-.878.462-.225 1.01-.338 1.644-.338.647 0 1.218.118 1.713.353.495.236.883.565 1.163.99.16.24.28.508.36.804l-1.92.795c-.09-.27-.24-.495-.45-.675-.21-.18-.495-.27-.855-.27-.405 0-.735.105-.99.315-.255.21-.383.48-.383.81 0 .345.12.63.36.855.24.225.615.42 1.125.585l.645.21c.645.21 1.19.465 1.635.765.445.3.785.675 1.02 1.125.235.45.353.975.353 1.575 0 .69-.18 1.305-.54 1.845-.36.54-.87 0.96-1.53 1.26-.66.3-1.44.45-2.34.45-1.005 0-1.89-.21-2.655-.63-.765-.42-1.335-1.02-1.71-1.8-.18-.39-.285-.81-.315-1.26h2.07c.045.345.165.675.36.99zM5.505 8.79h6.42v1.89H9.495v9.84H7.29v-9.84H5.505V8.79z"/>
        </svg>
      )
    },
    {
      name: 'Framer',
      icon: (
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z"/>
        </svg>
      )
    },
    {
      name: 'Performance First',
      isHighlight: true,
      icon: <Rocket className="w-4 h-4 text-[#8e97f7]" />
    }
  ];

  return (
    <div className="w-full relative z-20 py-5 sm:py-6 border-y border-white/[0.08] bg-[#15131f]/60 backdrop-blur-md overflow-hidden">
      {/* Subtle grid pattern background matching screenshot */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 flex flex-wrap lg:flex-nowrap items-center justify-center gap-2 sm:gap-2.5 lg:gap-3">
        {stacks.map((item, idx) => (
          <div
            key={idx}
            className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border transition-all duration-200 cursor-default select-none ${
              item.isHighlight 
                ? 'bg-[#8e97f7]/10 border-[#8e97f7]/30 text-[#f7f6fb] hover:border-[#8e97f7]/60 shadow-[0_0_15px_rgba(142,151,247,0.15)]' 
                : 'bg-white/[0.03] border-white/[0.08] text-[#c8c4dc] hover:text-white hover:border-white/20 hover:bg-white/[0.06]'
            }`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="text-xs sm:text-[13px] lg:text-sm font-medium tracking-tight whitespace-nowrap">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
