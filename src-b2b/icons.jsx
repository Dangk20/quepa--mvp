// Quepa B2B icon set — stroke 1.6, outline style
const Icon = ({ name, size = 18, ...rest }) => {
  const props = {
    width: size, height: size,
    viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: 1.6,
    strokeLinecap: "round", strokeLinejoin: "round",
    ...rest,
  };
  switch (name) {
    case "calendar": return (
      <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>
    );
    case "users": return (
      <svg {...props}><circle cx="9" cy="8" r="3.2"/><path d="M3 20c.6-3 3.2-5 6-5s5.4 2 6 5"/><circle cx="17.5" cy="7" r="2.5"/><path d="M21 19c-.3-2-1.7-3.6-3.5-4.3"/></svg>
    );
    case "link": return (
      <svg {...props}><path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1.5 1.5"/><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1.5-1.5"/></svg>
    );
    case "rocket": return (
      <svg {...props}><path d="M5 13l-1 5 5-1m0 0l1.5-3 4-4 4-4 1 1-4 4-4 4-3 1.5z"/><path d="M14 6l4 4"/><path d="M5 18l2 2"/></svg>
    );
    case "credit-card": return (
      <svg {...props}><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20M6 15h4"/></svg>
    );
    case "search": return (
      <svg {...props}><circle cx="11" cy="11" r="7"/><path d="M16 16l4 4"/></svg>
    );
    case "bell": return (
      <svg {...props}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>
    );
    case "settings": return (
      <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19 12a7.2 7.2 0 0 0-.1-1.2l2-1.6-2-3.4-2.4.9a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.5a7 7 0 0 0-2 1.2l-2.4-.9-2 3.4 2 1.6a7 7 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-.9a7 7 0 0 0 2 1.2L10 21h4l.5-2.5a7 7 0 0 0 2-1.2l2.4.9 2-3.4-2-1.6c.07-.4.1-.8.1-1.2z"/></svg>
    );
    case "plus": return (<svg {...props}><path d="M12 5v14M5 12h14"/></svg>);
    case "edit": return (<svg {...props}><path d="M4 20l4-1 11-11-3-3L5 16l-1 4z"/></svg>);
    case "chevron-down": return (<svg {...props}><path d="M6 9l6 6 6-6"/></svg>);
    case "chevron-right": return (<svg {...props}><path d="M9 6l6 6-6 6"/></svg>);
    case "chevron-left": return (<svg {...props}><path d="M15 6l-6 6 6 6"/></svg>);
    case "x": return (<svg {...props}><path d="M6 6l12 12M18 6L6 18"/></svg>);
    case "check": return (<svg {...props}><path d="M5 12l5 5L20 7"/></svg>);
    case "filter": return (<svg {...props}><path d="M4 5h16l-6 8v6l-4-2v-4z"/></svg>);
    case "table": return (<svg {...props}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 16h18M10 4v16"/></svg>);
    case "grid": return (<svg {...props}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>);
    case "menu": return (<svg {...props}><path d="M4 6h16M4 12h16M4 18h16"/></svg>);
    case "phone": return (<svg {...props}><path d="M5 4a2 2 0 0 1 2-2h2l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v2a2 2 0 0 1-2 2A16 16 0 0 1 5 4z"/></svg>);
    case "whatsapp": return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...rest}>
        <path d="M17.5 14.4c-.3-.15-1.8-.9-2.1-1-.3-.1-.5-.15-.7.15-.2.3-.8 1-1 1.2-.2.2-.4.22-.7.07-.3-.15-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.13-.65.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.7-1.7-1-2.3-.25-.6-.5-.5-.7-.5h-.6c-.2 0-.5.07-.77.37s-1.03 1-1.03 2.5 1.05 2.9 1.2 3.1c.15.2 2.07 3.17 5 4.44.7.3 1.25.48 1.67.62.7.22 1.34.2 1.85.12.56-.08 1.8-.73 2.05-1.45.25-.7.25-1.3.18-1.45-.08-.13-.27-.2-.57-.35zM12 2a10 10 0 0 0-8.6 15.05l-1.4 5.1 5.22-1.37A10 10 0 1 0 12 2zm0 18.3a8.27 8.27 0 0 1-4.2-1.15l-.3-.18-3.1.82.83-3.02-.2-.32A8.3 8.3 0 1 1 12 20.3z"/>
      </svg>
    );
    case "logout": return (<svg {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>);
    case "trending-up": return (<svg {...props}><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>);
    case "trending-down": return (<svg {...props}><path d="M3 7l6 6 4-4 8 8"/><path d="M14 17h7v-7"/></svg>);
    case "clock": return (<svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>);
    case "money": return (<svg {...props}><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9v.01M18 15v.01"/></svg>);
    case "external": return (<svg {...props}><path d="M14 4h6v6M20 4l-9 9M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6"/></svg>);
    case "more": return (<svg {...props}><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></svg>);
    case "lock": return (<svg {...props}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>);
    case "mail": return (<svg {...props}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>);
    case "eye": return (<svg {...props}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>);
    case "eye-off": return (<svg {...props}><path d="M3 3l18 18M10.6 6.1A10 10 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-3.4 4.1M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1"/><circle cx="12" cy="12" r="3"/></svg>);
    case "map-pin": return (<svg {...props}><path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>);
    case "store": return (<svg {...props}><path d="M3 9V6l2-3h14l2 3v3M3 9h18M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M5 9v11h14V9"/></svg>);
    case "bed": return (<svg {...props}><path d="M3 18v-7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v7"/><path d="M3 14h18M3 21v-3M21 21v-3"/><circle cx="8" cy="11" r="1.5"/></svg>);
    case "court": return (<svg {...props}><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M12 5v14M3 12h18M9 12a3 3 0 0 0 6 0"/></svg>);
    case "stethoscope": return (<svg {...props}><path d="M6 3v6a5 5 0 0 0 10 0V3"/><path d="M4 3h4M14 3h4"/><circle cx="18" cy="14" r="2"/><path d="M11 14v3a3 3 0 0 0 3 3 4 4 0 0 0 4-4v-2"/></svg>);
    case "alert": return (<svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 8v4"/><circle cx="12" cy="16" r=".5" fill="currentColor"/></svg>);
    case "refresh": return (<svg {...props}><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>);
    case "spark": return (<svg viewBox="0 0 100 100" width={size} height={size} fill="currentColor" {...rest}><g><rect x="44" y="4" width="12" height="92" rx="6"/><rect x="44" y="4" width="12" height="92" rx="6" transform="rotate(45 50 50)"/><rect x="44" y="4" width="12" height="92" rx="6" transform="rotate(90 50 50)"/><rect x="44" y="4" width="12" height="92" rx="6" transform="rotate(135 50 50)"/></g></svg>);
    case "send": return (<svg {...props}><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>);
    case "play": return (<svg {...props}><path d="M6 4l14 8-14 8z" fill="currentColor"/></svg>);
    case "tag": return (<svg {...props}><path d="M3 12l9-9h8v8l-9 9z"/><circle cx="16" cy="8" r="1.5"/></svg>);
    case "trophy": return (<svg {...props}><path d="M7 4h10v6a5 5 0 1 1-10 0z"/><path d="M7 5H3v2a3 3 0 0 0 3 3M17 5h4v2a3 3 0 0 1-3 3"/><path d="M9 16h6v4H9z"/><path d="M8 20h8"/></svg>);
    default: return null;
  }
};

Object.assign(window, { Icon });
