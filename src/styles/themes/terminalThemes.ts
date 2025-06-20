import { theme } from '../theme';

export const terminalThemes = {
  classic: {
    ...theme,
    terminal: {
      toolbarBg: 'linear-gradient(#504b45 0%, #3c3b37 100%)',
      btnBg: 'linear-gradient(#7d7871 0%, #595953 100%)',
      btnExitBg: 'linear-gradient(#f37458 0%, #de4c12 100%)',
      btnColor: '#ee411a',
      userColor: '#d5d0ce',
      bodyBg: 'rgba(56, 4, 40, 0.9)',
      user: '#7eda28',
      location: '#4878c0',
      bling: '#dddddd',
      cursor: '#ffffff',
    }
  },
  ocean: {
    ...theme,
    terminal: {
      toolbarBg: 'linear-gradient(#3a6073 0%, #16222a 100%)',
      btnBg: 'linear-gradient(#43cea2 0%, #185a9d 100%)',
      btnExitBg: 'linear-gradient(#ff512f 0%, #dd2476 100%)',
      btnColor: '#43cea2',
      userColor: '#e0f7fa',
      bodyBg: 'rgba(24, 82, 99, 0.9)',
      user: '#00bcd4',
      location: '#ff9800',
      bling: '#fff59d',
      cursor: '#00bcd4',
    }
  }
}; 