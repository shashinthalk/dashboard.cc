import React, { useState } from 'react';
import { theme } from '../styles/theme';
import { useAuth } from '../features/auth/context/AuthContext';
import { useWindowManager } from '../core/hooks/useWindowManager';
import {
  Layout,
  Sidebar,
  SidebarHeader,
  SidebarTitle,
  SidebarDescription,
  MenuContainer,
  MenuItem,
  Header,
  HeaderLeft,
  HeaderRight,
  UserMenu,
  UserAvatar,
  UserDropdown,
  DropdownItem,
  Main,
  Footer,
  StatusButton,
  MacButton,
  WindowCard,
  MacHeader,
  CardTitle,
  CardDescription,
  CardTag,
  CodeEditor
} from './DashboardLayout.styles';

export const DashboardLayout: React.FC = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  
  const {
    activeMenuItem,
    menuItems,
    minimizedWindows,
    visibleWindows,
    handleWindowAction,
    restoreWindow,
    handleMenuClick,
    getWindowContent,
  } = useWindowManager();

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  return (
    <Layout>
      <Sidebar>
        <SidebarHeader>
          <SidebarTitle>Project Overview</SidebarTitle>
          <SidebarDescription>
            Welcome to your development dashboard. Monitor your projects, track progress, and manage your workflow efficiently.
          </SidebarDescription>
        </SidebarHeader>
        <MenuContainer>
          {menuItems.map((item) => (
            <MenuItem 
              key={item.id}
              active={activeMenuItem === item.id}
              onClick={() => handleMenuClick(item.id)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </MenuItem>
          ))}
        </MenuContainer>
      </Sidebar>
      <Header>
        <HeaderLeft>
          <h2>Dashboard</h2>
        </HeaderLeft>
        <HeaderRight>
          <UserMenu onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
            <UserAvatar>{user?.name?.charAt(0) || '👤'}</UserAvatar>
            <UserDropdown isOpen={isUserMenuOpen}>
              <DropdownItem>Profile</DropdownItem>
              <DropdownItem>Settings</DropdownItem>
              <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
            </UserDropdown>
          </UserMenu>
        </HeaderRight>
      </Header>
      <Main>
        {visibleWindows.map((window) => {
          const content = getWindowContent(window.id);
          return (
            <WindowCard key={window.id} isMaximized={window.isMaximized}>
              <MacHeader>
                <MacButton 
                  color={theme.colors.mac.yellow} 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWindowAction(window.id, 'minimize');
                  }}
                />
              </MacHeader>
              <CardTitle>{content.title}</CardTitle>
              <CardDescription>{content.description}</CardDescription>
              {content.tags.map((tag: string, index: number) => (
                <CardTag key={index}>{tag}</CardTag>
              ))}
              <CodeEditor>
                <pre><code>{content.code}</code></pre>
              </CodeEditor>
            </WindowCard>
          );
        })}
      </Main>
      <Footer>
        <span>Status: Ready</span>
        {minimizedWindows.map((window) => (
          <StatusButton 
            key={window.id}
            onClick={() => restoreWindow(window.id)}
          >
            {window.title}
          </StatusButton>
        ))}
      </Footer>
    </Layout>
  );
};