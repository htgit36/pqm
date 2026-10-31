type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const ArrowUpRight = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);
export const ArrowRight = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
);
export const ArrowLeft = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}>
    <path d="M20 12H4M10 6l-6 6 6 6" />
  </svg>
);
export const Play = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
    <path d="M8 5.5v13a.5.5 0 0 0 .77.42l10-6.5a.5.5 0 0 0 0-.84l-10-6.5A.5.5 0 0 0 8 5.5Z" />
  </svg>
);
export const Close = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const Phone = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </svg>
);
export const Mail = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
export const Pin = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}>
    <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);
export const Zalo = ({ className }: P) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden fill="currentColor">
    <path d="M24 4C12.4 4 3 12 3 21.9c0 5.6 3 10.6 7.8 13.9-.3 2.2-1.3 4.6-3.2 6.3 3.7.3 7.3-1 9.7-2.7 2.1.6 4.3.9 6.7.9 11.6 0 21-8 21-17.9S35.6 4 24 4Zm-7.6 23.3h-6.3c-.8 0-1.2-.9-.7-1.5l4.8-6.2h-4.2a1.1 1.1 0 0 1 0-2.2h6.2c.8 0 1.2.9.7 1.5l-4.8 6.2h4.3a1.1 1.1 0 0 1 0 2.2Zm8.7-.4c0 .6-.5 1-1 1-.4 0-.7-.2-.9-.5a4.5 4.5 0 1 1 0-7.2c.2-.3.5-.5.9-.5.5 0 1 .4 1 1v6.2Zm4.1 0a1.1 1.1 0 0 1-2.2 0V17.4a1.1 1.1 0 0 1 2.2 0v9.5Zm5.6 1.1a4.6 4.6 0 1 1 0-9.2 4.6 4.6 0 0 1 0 9.2Zm0-7a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8Zm-14.4 0a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8Z" />
  </svg>
);
export const Messenger = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
    <path d="M12 2C6.4 2 2 6.1 2 11.6c0 2.9 1.2 5.4 3.2 7.1v3.3l3-1.7c1.2.3 2.4.5 3.8.5 5.6 0 10-4.1 10-9.6S17.6 2 12 2Zm1 12.9-2.5-2.7-5 2.7 5.5-5.8 2.6 2.7 4.9-2.7L13 14.9Z" />
  </svg>
);
export const Facebook = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
    <path d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4a20 20 0 0 0-2.3-.1c-2.2 0-3.7 1.4-3.7 3.9v2.3H8v3h2.5V21h3Z" />
  </svg>
);
export const Youtube = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
  </svg>
);
export const Instagram = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
);
export const Tiktok = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
    <path d="M16.6 3h-3.1v12.2a2.7 2.7 0 1 1-2.7-2.7c.3 0 .5 0 .8.1V9.4a5.9 5.9 0 1 0 5 5.8V9a7.5 7.5 0 0 0 4.4 1.4V7.3A4.4 4.4 0 0 1 16.6 3Z" />
  </svg>
);
