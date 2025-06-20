import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string;
      surface: string;
      border: string;
      text: {
        primary: string;
        secondary: string;
        code: string;
      };
      mac: {
        red: string;
        yellow: string;
        green: string;
      };
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    borderRadius: {
      sm: string;
      md: string;
    };
    shadows: {
      card: string;
      cardHover: string;
    };
    typography: {
      fontFamily: string;
      fontFamilyMono: string;
      sizes: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
      };
    };
    toolbarBg?: string;
    btnBg?: string;
    btnExitBg?: string;
    btnColor?: string;
    userColor?: string;
    bodyBg?: string;
    user?: string;
    location?: string;
    bling?: string;
    cursor?: string;
    terminal?: {
      toolbarBg?: string;
      btnBg?: string;
      btnExitBg?: string;
      btnColor?: string;
      userColor?: string;
      bodyBg?: string;
      user?: string;
      location?: string;
      bling?: string;
      cursor?: string;
    };
  }
} 