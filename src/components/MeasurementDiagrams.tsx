'use client';

interface MeasurementDiagramsProps {
  measurements: Array<'bust' | 'waist' | 'hips' | 'height' | 'shoulder' | 'sleeve' | 'inseam'>;
  tutorialUrl?: string;
}

const MEASUREMENT_INFO = {
  bust:     { title: 'Bust',     description: 'Measure around the fullest part of your chest, keeping the tape parallel to the floor.' },
  waist:    { title: 'Waist',    description: 'Measure around your natural waistline, typically the narrowest part of your torso.' },
  hips:     { title: 'Hips',     description: 'Measure around the fullest part of your hips, keeping the tape parallel to the floor.' },
  height:   { title: 'Height',   description: 'Stand straight against a wall and measure from the top of your head to the floor.' },
  shoulder: { title: 'Shoulder', description: 'Measure from the edge of one shoulder to the edge of the other across your back.' },
  sleeve:   { title: 'Sleeve',   description: 'Measure from the shoulder point down to your wrist with your arm slightly bent.' },
  inseam:   { title: 'Inseam',   description: 'Measure from the crotch seam down to the ankle bone along the inside of your leg.' },
};

export function MeasurementDiagrams({ measurements, tutorialUrl }: MeasurementDiagramsProps) {
  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--text)]">How to Measure</h3>
        {tutorialUrl && (
          <a href={tutorialUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[var(--brand)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded"
            aria-label="Watch video tutorial on how to take measurements (opens in new tab)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Watch Video Tutorial
          </a>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {measurements.map((m) => (
          <div key={m} className="flex flex-col items-center gap-2 p-3 bg-[var(--bg-secondary)] rounded-[12px] border border-[var(--border)]">
            <MeasurementIcon type={m} />
            <div className="text-center">
              <h4 className="text-sm font-semibold text-[var(--text)]">{MEASUREMENT_INFO[m].title}</h4>
              <p className="text-xs text-[var(--muted)] mt-1 leading-snug">{MEASUREMENT_INFO[m].description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MeasurementIcon({ type }: { type: string }) {
  const props = { width: '60', height: '90', viewBox: '0 0 80 120', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', 'aria-hidden': 'true' as const };
  const body = <path d="M40 15 C35 15 30 20 30 30 L30 50 C30 55 32 60 35 65 L35 110 C35 115 37 118 40 118 C43 118 45 115 45 110 L45 65 C48 60 50 55 50 50 L50 30 C50 20 45 15 40 15 Z" stroke="currentColor" strokeWidth="2" fill="none" />;
  const head = <circle cx="40" cy="8" r="6" stroke="currentColor" strokeWidth="2" fill="none" />;

  switch (type) {
    case 'bust': return <svg {...props}>{body}{head}<line x1="20" y1="35" x2="60" y2="35" stroke="var(--brand)" strokeWidth="2" /><line x1="20" y1="30" x2="20" y2="40" stroke="var(--brand)" strokeWidth="2" /><line x1="60" y1="30" x2="60" y2="40" stroke="var(--brand)" strokeWidth="2" /></svg>;
    case 'waist': return <svg {...props}>{body}{head}<line x1="22" y1="50" x2="58" y2="50" stroke="var(--brand)" strokeWidth="2" /><line x1="22" y1="45" x2="22" y2="55" stroke="var(--brand)" strokeWidth="2" /><line x1="58" y1="45" x2="58" y2="55" stroke="var(--brand)" strokeWidth="2" /></svg>;
    case 'hips': return <svg {...props}>{body}{head}<line x1="20" y1="65" x2="60" y2="65" stroke="var(--brand)" strokeWidth="2" /><line x1="20" y1="60" x2="20" y2="70" stroke="var(--brand)" strokeWidth="2" /><line x1="60" y1="60" x2="60" y2="70" stroke="var(--brand)" strokeWidth="2" /></svg>;
    case 'height': return <svg {...props}>{body}{head}<line x1="65" y1="2" x2="65" y2="118" stroke="var(--brand)" strokeWidth="2" /><line x1="60" y1="2" x2="70" y2="2" stroke="var(--brand)" strokeWidth="2" /><line x1="60" y1="118" x2="70" y2="118" stroke="var(--brand)" strokeWidth="2" /></svg>;
    case 'shoulder': return <svg {...props}>{body}{head}<line x1="30" y1="30" x2="15" y2="45" stroke="currentColor" strokeWidth="2" /><line x1="50" y1="30" x2="65" y2="45" stroke="currentColor" strokeWidth="2" /><line x1="30" y1="22" x2="50" y2="22" stroke="var(--brand)" strokeWidth="2" /><line x1="30" y1="18" x2="30" y2="26" stroke="var(--brand)" strokeWidth="2" /><line x1="50" y1="18" x2="50" y2="26" stroke="var(--brand)" strokeWidth="2" /></svg>;
    case 'sleeve': return <svg {...props}>{body}{head}<path d="M50 30 L60 45 L62 70" stroke="currentColor" strokeWidth="2" fill="none" /><line x1="50" y1="30" x2="62" y2="70" stroke="var(--brand)" strokeWidth="2" strokeDasharray="3,3" /><circle cx="50" cy="30" r="2" fill="var(--brand)" /><circle cx="62" cy="70" r="2" fill="var(--brand)" /></svg>;
    case 'inseam': return <svg {...props}>{body}{head}<line x1="35" y1="110" x2="32" y2="118" stroke="currentColor" strokeWidth="2" /><line x1="45" y1="110" x2="48" y2="118" stroke="currentColor" strokeWidth="2" /><line x1="40" y1="65" x2="32" y2="118" stroke="var(--brand)" strokeWidth="2" strokeDasharray="3,3" /><circle cx="40" cy="65" r="2" fill="var(--brand)" /><circle cx="32" cy="118" r="2" fill="var(--brand)" /></svg>;
    default: return null;
  }
}
