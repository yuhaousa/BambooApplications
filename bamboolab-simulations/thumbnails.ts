
import { SimulationType } from './types';

const encodeSVG = (svg: string) => `data:image/svg+xml;base64,${btoa(svg)}`;

export const getThumbnail = (type: SimulationType): string => {
  let svgContent = '';

  switch (type) {
    case SimulationType.PROJECTILE:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
          <rect width="400" height="240" fill="#e0f2fe"/>
          <rect y="200" width="400" height="40" fill="#4ade80"/>
          <path d="M50 200 Q 150 50 300 200" stroke="#ef4444" stroke-width="4" fill="none" stroke-dasharray="10,10"/>
          <circle cx="300" cy="200" r="8" fill="#1e293b"/>
          <g transform="translate(50, 200) rotate(-45)">
            <rect y="-10" width="60" height="20" fill="#475569" rx="4"/>
          </g>
          <rect x="40" y="200" width="20" height="20" fill="#334155"/>
        </svg>`;
      break;

    case SimulationType.COLLISION:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
          <rect width="400" height="240" fill="#f8fafc"/>
          <rect y="180" width="400" height="60" fill="#e2e8f0"/>
          <circle cx="120" cy="150" r="35" fill="#ef4444"/>
          <circle cx="280" cy="150" r="35" fill="#3b82f6"/>
          <path d="M200 150 L180 130 L200 110 L220 130 L240 110 L220 150 L240 190 L200 170 L160 190 L180 150 Z" fill="#fbbf24" opacity="0.8"/>
          <path d="M100 150 H60 M340 150 H300" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
          <path d="M60 150 L70 140 M60 150 L70 160 M340 150 L330 140 M340 150 L330 160" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
        </svg>`;
      break;

    case SimulationType.PENDULUM:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
          <rect width="400" height="240" fill="#f1f5f9"/>
          <rect x="150" y="0" width="100" height="20" fill="#334155"/>
          <line x1="200" y1="20" x2="280" y2="160" stroke="#475569" stroke-width="4"/>
          <circle cx="280" cy="160" r="25" fill="#3b82f6" stroke="#1d4ed8" stroke-width="3"/>
          <path d="M200 160 Q 240 180 280 160" stroke="#94a3b8" stroke-width="2" fill="none" stroke-dasharray="5,5"/>
        </svg>`;
      break;

    case SimulationType.GRAVITY:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
          <rect width="400" height="240" fill="#0f172a"/>
          <circle cx="100" cy="120" r="40" fill="#ef4444"/>
          <circle cx="300" cy="120" r="60" fill="#3b82f6"/>
          <text x="100" y="125" fill="white" font-family="sans-serif" font-size="14" text-anchor="middle">m1</text>
          <text x="300" y="125" fill="white" font-family="sans-serif" font-size="14" text-anchor="middle">m2</text>
          <line x1="150" y1="120" x2="230" y2="120" stroke="white" stroke-width="2" stroke-dasharray="4,4"/>
          <path d="M160 110 L140 120 L160 130 M240 110 L260 120 L240 130" fill="#fbbf24"/>
        </svg>`;
      break;
    
    case SimulationType.COULOMB:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
          <rect width="400" height="240" fill="#f8fafc"/>
          <circle cx="100" cy="120" r="40" fill="#ef4444" opacity="0.8"/>
          <text x="100" y="128" fill="white" font-weight="bold" font-size="24" text-anchor="middle">+</text>
          <circle cx="300" cy="120" r="40" fill="#3b82f6" opacity="0.8"/>
          <text x="300" y="128" fill="white" font-weight="bold" font-size="24" text-anchor="middle">-</text>
          <line x1="150" y1="120" x2="250" y2="120" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4,4"/>
          <path d="M160 110 L140 120 L160 130 M240 110 L260 120 L240 130" fill="#1e293b"/>
        </svg>`;
      break;

    case SimulationType.SOLAR:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
          <rect width="400" height="240" fill="#000"/>
          <circle cx="200" cy="120" r="30" fill="#fbbf24" opacity="0.9">
             <animate attributeName="opacity" values="0.9;1;0.9" dur="3s" repeatCount="indefinite"/>
          </circle>
          <circle cx="200" cy="120" r="80" fill="none" stroke="#334155" stroke-width="1"/>
          <circle cx="200" cy="120" r="140" fill="none" stroke="#334155" stroke-width="1"/>
          <circle cx="270" cy="90" r="12" fill="#3b82f6"/>
          <circle cx="100" cy="160" r="18" fill="#ef4444"/>
          <circle cx="10" cy="20" r="1" fill="white"/>
          <circle cx="380" cy="200" r="1" fill="white"/>
          <circle cx="50" cy="200" r="1" fill="white"/>
          <circle cx="350" cy="30" r="1" fill="white"/>
        </svg>`;
      break;
    
    case SimulationType.GAS:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
          <rect width="400" height="240" fill="#f8fafc"/>
          <rect x="50" y="40" width="300" height="160" rx="8" fill="#fff" stroke="#475569" stroke-width="4"/>
          <rect x="350" y="40" width="20" height="160" fill="#94a3b8"/>
          <circle cx="80" cy="80" r="6" fill="#ec4899"/>
          <circle cx="120" cy="140" r="6" fill="#a855f7"/>
          <circle cx="200" cy="100" r="6" fill="#ec4899"/>
          <circle cx="250" cy="160" r="6" fill="#a855f7"/>
          <circle cx="160" cy="70" r="6" fill="#ec4899"/>
          <circle cx="290" cy="90" r="6" fill="#a855f7"/>
          <line x1="120" y1="140" x2="130" y2="130" stroke="#a855f7" stroke-width="2"/>
        </svg>`;
      break;

    case SimulationType.HOOKES:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
          <rect width="400" height="240" fill="#fff"/>
          <rect x="0" y="200" width="400" height="40" fill="#cbd5e1"/>
          <rect x="20" y="80" width="20" height="120" fill="#94a3b8"/>
          <path d="M40 140 L70 120 L100 160 L130 120 L160 160 L190 120 L220 160 L240 140" stroke="#475569" stroke-width="4" fill="none"/>
          <rect x="240" y="100" width="80" height="80" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
          <text x="280" y="145" fill="white" font-family="sans-serif" text-anchor="middle" font-weight="bold">Mass</text>
        </svg>`;
      break;

    case SimulationType.GRAPHING:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
          <rect width="400" height="240" fill="#fff"/>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="400" height="240" fill="url(#grid)" />
          <line x1="200" y1="0" x2="200" y2="240" stroke="#475569" stroke-width="2"/>
          <line x1="0" y1="120" x2="400" y2="120" stroke="#475569" stroke-width="2"/>
          <line x1="50" y1="200" x2="350" y2="40" stroke="#d946ef" stroke-width="4"/>
          <circle cx="200" cy="120" r="4" fill="#475569"/>
        </svg>`;
      break;

    case SimulationType.WAVE:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
          <rect width="400" height="240" fill="#0f766e"/>
          <circle cx="100" cy="120" r="5" fill="#fcd34d"/>
          <circle cx="100" cy="120" r="30" stroke="rgba(255,255,255,0.5)" fill="none" stroke-width="2"/>
          <circle cx="100" cy="120" r="60" stroke="rgba(255,255,255,0.4)" fill="none" stroke-width="2"/>
          <circle cx="100" cy="120" r="90" stroke="rgba(255,255,255,0.3)" fill="none" stroke-width="2"/>
          <circle cx="100" cy="120" r="120" stroke="rgba(255,255,255,0.2)" fill="none" stroke-width="2"/>
          <circle cx="300" cy="120" r="5" fill="#fcd34d"/>
          <path d="M270 120 Q 300 90 330 120" stroke="white" fill="none" opacity="0.5"/>
          <path d="M240 120 Q 300 60 360 120" stroke="white" fill="none" opacity="0.3"/>
        </svg>`;
      break;

    case SimulationType.BALANCING:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
          <rect width="400" height="240" fill="#f0f9ff"/>
          <rect x="0" y="200" width="400" height="40" fill="#e2e8f0"/>
          <path d="M200 200 L170 200 L200 150 L230 200 Z" fill="#64748b"/>
          <rect x="50" y="140" width="300" height="10" fill="#f59e0b" rx="2"/>
          <rect x="80" y="100" width="40" height="40" fill="#ef4444"/>
          <rect x="280" y="110" width="30" height="30" fill="#3b82f6"/>
        </svg>`;
      break;

    case SimulationType.CIRCUIT:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
          <rect width="400" height="240" fill="#fffbeb"/>
          <rect x="80" y="60" width="240" height="120" stroke="#f59e0b" stroke-width="6" fill="none" rx="10"/>
          <rect x="60" y="100" width="40" height="40" fill="#fffbeb"/>
          <rect x="75" y="105" width="10" height="30" fill="#334155"/>
          <rect x="95" y="115" width="10" height="10" fill="#334155"/>
          <circle cx="320" cy="120" r="20" fill="#fef08a" stroke="#f59e0b" stroke-width="2"/>
          <path d="M310 130 L320 110 L330 130" fill="none" stroke="#78350f" stroke-width="2"/>
        </svg>`;
      break;

    case SimulationType.ATOM:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
          <rect width="400" height="240" fill="#faf5ff"/>
          <circle cx="200" cy="120" r="10" fill="#ef4444"/>
          <circle cx="205" cy="115" r="10" fill="#94a3b8"/>
          <ellipse cx="200" cy="120" rx="60" ry="20" fill="none" stroke="#3b82f6" stroke-width="1" transform="rotate(45, 200, 120)"/>
          <circle cx="242" cy="162" r="5" fill="#3b82f6"/>
          <ellipse cx="200" cy="120" rx="60" ry="20" fill="none" stroke="#3b82f6" stroke-width="1" transform="rotate(-45, 200, 120)"/>
          <circle cx="158" cy="162" r="5" fill="#3b82f6"/>
        </svg>`;
      break;

    case SimulationType.SKATE:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
          <rect width="400" height="240" fill="#e0f2fe"/>
          <path d="M50 50 Q 200 250 350 50" stroke="#64748b" stroke-width="8" fill="none" stroke-linecap="round"/>
          <circle cx="100" cy="150" r="10" fill="#ef4444"/>
          <rect x="20" y="180" width="30" height="40" fill="#3b82f6"/>
          <rect x="60" y="200" width="30" height="20" fill="#22c55e"/>
        </svg>`;
      break;

    case SimulationType.POPULATION:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
          <rect width="400" height="240" fill="#f0fdf4"/>
          <line x1="50" y1="200" x2="350" y2="200" stroke="#166534" stroke-width="2"/>
          <line x1="50" y1="200" x2="50" y2="40" stroke="#166534" stroke-width="2"/>
          <path d="M50 190 Q 150 180 200 100 T 350 40" stroke="#22c55e" stroke-width="4" fill="none"/>
          <circle cx="200" cy="100" r="6" fill="#15803d"/>
          <circle cx="300" cy="50" r="30" fill="#bbf7d0" opacity="0.5"/>
          <circle cx="300" cy="50" r="5" fill="#166534"/>
          <circle cx="310" cy="60" r="5" fill="#166534"/>
          <circle cx="290" cy="55" r="5" fill="#166534"/>
        </svg>`;
      break;
    
    case SimulationType.FRICTION:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
          <rect width="400" height="240" fill="#fff"/>
          <path d="M50 200 L350 200 L350 100 Z" fill="#cbd5e1"/>
          <g transform="rotate(-18.4, 200, 150)">
             <rect x="180" y="130" width="40" height="40" fill="#f97316" stroke="#c2410c" stroke-width="2"/>
          </g>
          <text x="200" y="230" text-anchor="middle" fill="#64748b" font-size="14">Friction Ramp</text>
        </svg>`;
      break;

    case SimulationType.REFRACTION:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
          <rect width="400" height="120" fill="#fff"/>
          <rect y="120" width="400" height="120" fill="#e0f2fe"/>
          <line x1="200" y1="0" x2="200" y2="240" stroke="#94a3b8" stroke-dasharray="5,5"/>
          <line x1="50" y1="50" x2="200" y2="120" stroke="#ef4444" stroke-width="4"/>
          <line x1="200" y1="120" x2="300" y2="220" stroke="#ef4444" stroke-width="4"/>
          <circle cx="200" cy="120" r="4" fill="#1e293b"/>
        </svg>`;
      break;

    case SimulationType.VECTORS:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
          <rect width="400" height="240" fill="#fafafa"/>
          <defs>
            <marker id="head" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="#000" />
            </marker>
          </defs>
          <line x1="50" y1="200" x2="150" y2="150" stroke="#3b82f6" stroke-width="4" />
          <path d="M150 150 L140 155 L140 145 Z" fill="#3b82f6" transform="rotate(-26, 150, 150)"/>
          
          <line x1="150" y1="150" x2="250" y2="50" stroke="#ef4444" stroke-width="4" />
          
          <line x1="50" y1="200" x2="250" y2="50" stroke="#10b981" stroke-width="4" stroke-dasharray="8,8"/>
        </svg>`;
      break;

    case SimulationType.PH_SCALE:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
          <rect width="400" height="240" fill="#fff"/>
          <path d="M120 60 L120 200 Q 120 220 140 220 L260 220 Q 280 220 280 200 L280 60" fill="#ecfccb" stroke="#64748b" stroke-width="3"/>
          <rect x="120" y="100" width="160" height="100" fill="#84cc16" opacity="0.6"/>
          <text x="200" y="160" font-weight="bold" font-size="40" fill="white" text-anchor="middle" opacity="0.8">pH</text>
        </svg>`;
      break;
      
    case SimulationType.SELECTION:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
          <rect width="400" height="240" fill="#fef3c7"/>
          <circle cx="100" cy="100" r="20" fill="#fff" stroke="#ccc" stroke-width="2"/>
          <circle cx="100" cy="100" r="5" fill="#000"/>
          <circle cx="200" cy="150" r="20" fill="#78350f" stroke="#522508" stroke-width="2"/>
          <circle cx="200" cy="150" r="5" fill="#fff"/>
          <circle cx="300" cy="80" r="20" fill="#fff" stroke="#ccc" stroke-width="2"/>
          <circle cx="150" cy="200" r="20" fill="#78350f" stroke="#522508" stroke-width="2"/>
        </svg>`;
      break;
      
    case SimulationType.FOURIER:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
          <rect width="400" height="240" fill="#171717"/>
          <path d="M0 120 Q 50 20 100 120 T 200 120 T 300 120 T 400 120" stroke="rgba(255,255,255,0.3)" fill="none" stroke-width="2"/>
          <path d="M0 120 Q 25 80 50 120 T 100 120" stroke="rgba(255,255,255,0.3)" fill="none" stroke-width="2"/>
          <path d="M0 120 L 50 40 L 100 120 L 150 200 L 200 120" stroke="#d8b4fe" fill="none" stroke-width="3"/>
        </svg>`;
      break;

    case SimulationType.BALLISTIC:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
          <rect width="400" height="240" fill="#e2e8f0"/>
          <rect x="180" y="0" width="40" height="10" fill="#334155"/>
          <line x1="200" y1="10" x2="200" y2="120" stroke="#475569" stroke-width="3"/>
          <rect x="170" y="120" width="60" height="60" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
          <path d="M50 140 L80 140" stroke="#ef4444" stroke-width="4" marker-end="url(#arrow)"/>
          <circle cx="90" cy="150" r="5" fill="#1e293b"/>
          <text x="200" y="220" text-anchor="middle" font-size="12" fill="#64748b">Collision + Swing</text>
        </svg>`;
      break;

    case SimulationType.CHARGED_SPRING:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
          <rect width="400" height="240" fill="#f0f9ff"/>
          <rect x="100" y="20" width="200" height="10" fill="#ef4444"/> <!-- + Plate -->
          <rect x="100" y="210" width="200" height="10" fill="#3b82f6"/> <!-- - Plate -->
          <path d="M200 30 L190 50 L210 70 L190 90 L210 110 L200 130" stroke="#475569" stroke-width="3" fill="none"/>
          <circle cx="200" cy="140" r="15" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
          <text x="200" y="145" text-anchor="middle" font-size="16" font-weight="bold">+</text>
          <path d="M250 60 L250 180" stroke="#94a3b8" stroke-dasharray="4,4" marker-end="url(#arrow)"/>
          <text x="270" y="120" fill="#94a3b8" font-size="12">E-Field</text>
        </svg>`;
      break;
    
    case SimulationType.DOPPLER:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
          <rect width="400" height="240" fill="#0f172a"/>
          <circle cx="200" cy="120" r="5" fill="#ef4444"/>
          <circle cx="210" cy="120" r="20" stroke="#38bdf8" fill="none" stroke-width="2"/>
          <circle cx="225" cy="120" r="40" stroke="#38bdf8" fill="none" stroke-width="2"/>
          <circle cx="250" cy="120" r="60" stroke="#38bdf8" fill="none" stroke-width="2"/>
          <circle cx="180" cy="120" r="80" stroke="#38bdf8" fill="none" stroke-width="2"/>
        </svg>`;
      break;

    default:
      svgContent = `<svg viewBox="0 0 400 240"><rect width="400" height="240" fill="#ccc"/></svg>`;
  }

  return encodeSVG(svgContent);
};
