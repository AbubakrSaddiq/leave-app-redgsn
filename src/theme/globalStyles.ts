// File: src/theme/globalStyles.ts

export const injectGlobalStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Mono:wght@400;500&display=swap');

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { margin: 0; padding: 0; width: 100%; overflow-x: hidden; }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #080f22; }
    ::-webkit-scrollbar-thumb { background: rgba(212,168,67,0.4); border-radius: 3px; }
  `;
  document.head.appendChild(style);
};