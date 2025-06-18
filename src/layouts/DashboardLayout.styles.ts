import styled from 'styled-components';
import { theme } from '../styles/theme';

export const Layout = styled.div`
  display: grid;
  grid-template-areas:
    "sidebar header"
    "sidebar main"
    "sidebar footer";
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr 30px;
  height: 100vh;
  background-color: ${theme.colors.surface};
  color: ${theme.colors.text.primary};

  @media (max-width: 768px) {
    grid-template-areas:
      "header"
      "main"
      "footer";
    grid-template-columns: 1fr;
    grid-template-rows: 60px 1fr 30px;
  }
`;

export const Sidebar = styled.aside`
  grid-area: sidebar;
  background-color: ${theme.colors.surface};
  border-right: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const SidebarHeader = styled.div`
  margin-bottom: ${theme.spacing.lg};
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.border};
`;

export const SidebarTitle = styled.h3`
  font-size: ${theme.typography.sizes.md};
  margin: 0 0 ${theme.spacing.sm} 0;
  color: ${theme.colors.text.primary};
`;

export const SidebarDescription = styled.p`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
  margin: 0;
  line-height: 1.4;
`;

export const MenuContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: ${theme.spacing.sm};
`;

export const MenuItem = styled.div<any>`
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  background-color: ${(props: any) => props.active ? theme.colors.border : 'transparent'};
  
  &:hover {
    background-color: ${theme.colors.border};
  }
`;

export const Header = styled.header`
  grid-area: header;
  background-color: ${theme.colors.surface};
  border-bottom: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
`;

export const UserMenu = styled.div`
  position: relative;
  cursor: pointer;
`;

export const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const UserDropdown = styled.div<any>`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing.sm};
  margin-top: ${theme.spacing.sm};
  display: ${(props: any) => props.isOpen ? 'block' : 'none'};
  min-width: 200px;
  box-shadow: ${theme.shadows.card};
  z-index: 1000;
`;

export const DropdownItem = styled.div`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  cursor: pointer;
  
  &:hover {
    background-color: ${theme.colors.border};
  }
`;

export const Main = styled.main`
  grid-area: main;
  padding: ${theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${theme.spacing.lg};
  overflow: auto;
  background-color: ${theme.colors.surface};
  position: relative;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    grid-template-columns: none;
    gap: ${theme.spacing.lg};
    padding: ${theme.spacing.md};
  }
`;

export const Footer = styled.footer`
  grid-area: footer;
  background-color: ${theme.colors.surface};
  border-top: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

export const StatusButton = styled.button`
  background-color: ${theme.colors.border};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.sizes.xs};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${theme.colors.text.secondary};
  }
`;

export const MacButton = styled.button<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props: { color: string }) => props.color};
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

export const WindowCard = styled.div<{ isMaximized: boolean }>`
  width: 100%;
  min-height: 300px;
  padding: 20px;
  border: 1px solid #0d1117;
  border-radius: 10px;
  background-color: #000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  display: flex;
  flex-direction: column;

  ${({ isMaximized }) => isMaximized && `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    border-radius: 0;
  `}

  &:hover {
    transform: ${({ isMaximized }) => isMaximized ? 'none' : 'translateY(-5px)'};
    box-shadow: ${({ isMaximized }) => isMaximized ? 'none' : '0 6px 12px rgba(0, 0, 0, 0.15)'};
  }

  @media (max-width: 768px) {
    min-height: 250px;
    padding: 15px;
    position: relative !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
    z-index: auto !important;
    border-radius: 10px !important;
    overflow: hidden;
  }
`;

export const MacHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
`;

export const CardTitle = styled.span`
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 10px;
  color: #e6e6ef;
  display: block;
`;

export const CardDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
`;

export const CardTag = styled.span`
  display: inline-block;
  font-size: 10px;
  border-radius: 5px;
  background-color: #0d1117;
  padding: 4px;
  margin-block-end: 12px;
  color: #dcdcdc;
  margin-right: 8px;
`;

export const CodeEditor = styled.div`
  background-color: #0d1117;
  color: #dcdcdc;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", monospace;
  font-size: 14px;
  line-height: 1.5;
  border-radius: 5px;
  padding: 15px;
  overflow: auto;
  flex: 1;
  min-height: 150px;
  border: 1px solid #333;
  width: 100%;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 4px;
  }

  & pre code {
    white-space: pre-wrap;
    display: block;
  }

  @media (max-width: 768px) {
    min-height: 120px;
    padding: 10px;
    flex: unset;
    width: 100%;
    box-sizing: border-box;
  }
`; 