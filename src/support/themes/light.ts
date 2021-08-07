import { DefaultTheme } from 'styled-components';

const COLORS = {
  primary: '#DA0037',
  background: '#FFF',
  backgroundVar1: '#dedede',
  light: '#FFF',
  text: '#565',
};

export const Light: DefaultTheme = {
  name: 'light',
  colors: {
    ...COLORS,
    bodyBg: COLORS.backgroundVar1,
    sidebarBg: COLORS.light,
    headerBg: COLORS.light,
    text: COLORS.text,
    border: 'rgba(0, 0, 0, 0.5)',
    switchBg: '#555',
  },
};
