import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { useAuth } from '../features/auth/context/AuthContext';

interface MenuItemProps {
  active?: boolean;
}

interface UserDropdownProps {
  isOpen: boolean;
}

interface WindowState {
  id: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  title: string;
  order: number;
  source: 'main' | 'menu';
}

const MAX_VISIBLE_WINDOWS = 3;

const Layout = styled.div`
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

const Sidebar = styled.aside`
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

const SidebarHeader = styled.div`
  margin-bottom: ${theme.spacing.lg};
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.border};
`;

const SidebarTitle = styled.h3`
  font-size: ${theme.typography.sizes.md};
  margin: 0 0 ${theme.spacing.sm} 0;
  color: ${theme.colors.text.primary};
`;

const SidebarDescription = styled.p`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
  margin: 0;
  line-height: 1.4;
`;

const MenuContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: ${theme.spacing.sm};
`;

const MenuItem = styled.div<MenuItemProps>`
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  background-color: ${(props: MenuItemProps) => props.active ? theme.colors.border : 'transparent'};
  
  &:hover {
    background-color: ${theme.colors.border};
  }
`;

const Header = styled.header`
  grid-area: header;
  background-color: ${theme.colors.surface};
  border-bottom: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
`;

const UserMenu = styled.div`
  position: relative;
  cursor: pointer;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserDropdown = styled.div<UserDropdownProps>`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing.sm};
  margin-top: ${theme.spacing.sm};
  display: ${(props: UserDropdownProps) => props.isOpen ? 'block' : 'none'};
  min-width: 200px;
  box-shadow: ${theme.shadows.card};
  z-index: 1000;
`;

const DropdownItem = styled.div`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  cursor: pointer;
  
  &:hover {
    background-color: ${theme.colors.border};
  }
`;

const Main = styled.main`
  grid-area: main;
  padding: ${theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${theme.spacing.lg};
  overflow: auto;
  background-color: ${theme.colors.surface};
  position: relative;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: ${theme.spacing.md};
  }
`;

const Footer = styled.footer`
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

const StatusButton = styled.button`
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

const MacButton = styled.button<{ color: string }>`
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

const WindowCard = styled.div<{ isMaximized: boolean }>`
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

  ${props => props.isMaximized && `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    border-radius: 0;
  `}

  &:hover {
    transform: ${props => props.isMaximized ? 'none' : 'translateY(-5px)'};
    box-shadow: ${props => props.isMaximized ? 'none' : '0 6px 12px rgba(0, 0, 0, 0.15)'};
  }

  @media (max-width: 768px) {
    min-height: 250px;
    padding: 15px;
  }
`;

const MacHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
`;

const CardTitle = styled.span`
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 10px;
  color: #e6e6ef;
  display: block;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
`;

const CardTag = styled.span`
  display: inline-block;
  font-size: 10px;
  border-radius: 5px;
  background-color: #0d1117;
  padding: 4px;
  margin-block-end: 12px;
  color: #dcdcdc;
  margin-right: 8px;
`;

const CodeEditor = styled.div`
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
  }
`;

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [windows, setWindows] = useState<WindowState[]>([
    { id: 'code-preview', title: 'Mac-Style Code Preview', isOpen: true, isMinimized: false, isMaximized: false, order: 0, source: 'main' },
    { id: 'recent-activity', title: 'Recent Activity', isOpen: true, isMinimized: false, isMaximized: false, order: 1, source: 'main' },
    { id: 'quick-actions', title: 'Quick Actions', isOpen: true, isMinimized: false, isMaximized: false, order: 2, source: 'main' },
  ]);

  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'reports', label: 'Reports', icon: '📑' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'messages', label: 'Messages', icon: '✉️' },
  ];

  const getWindowContent = (windowId: string) => {
    switch (windowId) {
      case 'code-preview':
        return {
          title: 'Mac-Style Code Preview',
          description: 'A glimpse of your code in a clean and Mac-like window. Click to explore!',
          tags: ['TAG JS', 'TAG JS'],
          code: '<h1> Hello World </h1>'
        };
      case 'recent-activity':
        return {
          title: 'Recent Activity',
          description: 'Track your latest development activities and project updates.',
          tags: ['ACTIVITY', 'UPDATES'],
          code: 'git commit -m "Update dashboard layout"'
        };
      case 'quick-actions':
        return {
          title: 'Quick Actions',
          description: 'Access frequently used tools and shortcuts for faster workflow.',
          tags: ['TOOLS', 'SHORTCUTS'],
          code: 'npm start'
        };
      case 'users':
        return {
          title: 'Users Management',
          description: 'Manage user accounts, permissions, and access controls.',
          tags: ['USERS', 'ADMIN'],
          code: 'const users = getUsers();\nconsole.log(users);'
        };
      case 'analytics':
        return {
          title: 'Analytics Dashboard',
          description: 'View detailed analytics and performance metrics.',
          tags: ['ANALYTICS', 'METRICS'],
          code: 'const metrics = getAnalytics();\nrenderChart(metrics);'
        };
      case 'reports':
        return {
          title: 'Reports Center',
          description: 'Generate and view comprehensive reports.',
          tags: ['REPORTS', 'DATA'],
          code: 'const report = generateReport();\nexportToPDF(report);'
        };
      case 'settings':
        return {
          title: 'Settings Panel',
          description: 'Configure application settings and preferences.',
          tags: ['SETTINGS', 'CONFIG'],
          code: 'const config = loadConfig();\nupdateSettings(config);'
        };
      case 'messages':
        return {
          title: 'Messages Center',
          description: 'View and manage system messages and notifications.',
          tags: ['MESSAGES', 'NOTIFICATIONS'],
          code: 'const messages = getMessages();\nmarkAsRead(messages);'
        };
      default:
        return { title: '', description: '', tags: [], code: '' };
    }
  };

  const enforceWindowLimit = (updatedWindows: WindowState[]): WindowState[] => {
    const visibleWindows = updatedWindows.filter(w => w.isOpen && !w.isMinimized);
    
    if (visibleWindows.length > MAX_VISIBLE_WINDOWS) {
      // Sort by order to find the rightmost windows
      const sortedVisible = visibleWindows.sort((a, b) => b.order - a.order);
      const windowsToMinimize = sortedVisible.slice(MAX_VISIBLE_WINDOWS);
      
      return updatedWindows.map(window => 
        windowsToMinimize.some(w => w.id === window.id)
          ? { ...window, isMinimized: true }
          : window
      );
    }
    
    return updatedWindows;
  };

  const addWindowToQueue = (windowId: string, isNewWindow: boolean = false) => {
    return (prevWindows: WindowState[]): WindowState[] => {
      let updatedWindows = [...prevWindows];
      
      // If it's a new window or reopening a closed window, add it to the queue
      if (isNewWindow) {
        // Shift all existing windows to the right
        updatedWindows = updatedWindows.map(window => ({
          ...window,
          order: window.order + 1
        }));
        
        // Add new window at the beginning (order 0)
        const newWindow: WindowState = {
          id: windowId,
          title: menuItems.find(item => item.id === windowId)?.label || windowId,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          order: 0,
          source: 'menu'
        };
        
        updatedWindows.push(newWindow);
      } else {
        // For existing windows, bring to front and ensure it's not minimized
        updatedWindows = updatedWindows.map(window => {
          if (window.id === windowId) {
            return { ...window, order: 0, isMinimized: false };
          } else {
            return { ...window, order: window.order + 1 };
          }
        });
      }
      
      // Enforce the 3-window limit by minimizing the rightmost window
      const visibleWindows = updatedWindows.filter(w => w.isOpen && !w.isMinimized);
      
      if (visibleWindows.length > MAX_VISIBLE_WINDOWS) {
        // Find the window with the highest order (rightmost)
        const rightmostWindow = visibleWindows.reduce((max, current) => 
          current.order > max.order ? current : max
        );
        
        updatedWindows = updatedWindows.map(window => 
          window.id === rightmostWindow.id
            ? { ...window, isMinimized: true }
            : window
        );
      }
      
      return updatedWindows;
    };
  };

  const handleWindowAction = (windowId: string, action: 'close' | 'minimize' | 'maximize') => {
    setWindows(prevWindows => {
      const updatedWindows = prevWindows.map(window => {
        if (window.id === windowId) {
          switch (action) {
            case 'close':
              return { ...window, isOpen: false };
            case 'minimize':
              return { ...window, isMinimized: true, isMaximized: false };
            case 'maximize':
              if (!window.isMaximized) {
                return { ...window, isMaximized: true, isMinimized: false, order: 0 };
              } else {
                return { ...window, isMaximized: false };
              }
            default:
              return window;
          }
        } else {
          if (action === 'maximize') {
            const newOrder = window.order + 1;
            return { ...window, isMaximized: false, order: newOrder };
          }
          return window;
        }
      });
      
      return updatedWindows;
    });
  };

  const restoreWindow = (windowId: string) => {
    setWindows(prevWindows => {
      // First, find the window to restore
      const windowToRestore = prevWindows.find(w => w.id === windowId);
      if (!windowToRestore) return prevWindows;
      
      // Find the rightmost visible window to minimize
      const visibleWindows = prevWindows.filter(w => w.isOpen && !w.isMinimized);
      const rightmostWindow = visibleWindows.reduce((max, current) => 
        current.order > max.order ? current : max
      );
      
      // Update windows: restore the clicked window and minimize the rightmost
      const updatedWindows = prevWindows.map(window => {
        if (window.id === windowId) {
          return { ...window, isMinimized: false, order: 0 };
        } else if (window.id === rightmostWindow.id) {
          return { ...window, isMinimized: true };
        } else {
          return { ...window, order: window.order + 1 };
        }
      });
      
      return updatedWindows;
    });
  };

  const handleMenuClick = (menuId: string) => {
    setActiveMenuItem(menuId);
    
    const existingWindow = windows.find(w => w.id === menuId);
    
    if (existingWindow) {
      if (!existingWindow.isOpen) {
        // Reopen closed window
        setWindows(addWindowToQueue(menuId, true));
      } else if (existingWindow.isMinimized) {
        // Restore minimized window
        setWindows(addWindowToQueue(menuId, false));
      } else {
        // Bring open window to front
        setWindows(addWindowToQueue(menuId, false));
      }
    } else {
      // Create new window
      setWindows(addWindowToQueue(menuId, true));
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  const minimizedWindows = windows.filter(w => w.isMinimized);
  const visibleWindows = windows
    .filter(w => w.isOpen && !w.isMinimized)
    .sort((a, b) => a.order - b.order);

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
          {menuItems.map(item => (
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
        {visibleWindows.map(window => {
          const content = getWindowContent(window.id);
          return (
            <WindowCard key={window.id} isMaximized={window.isMaximized}>
              <MacHeader>
                <MacButton 
                  color={theme.colors.mac.red} 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWindowAction(window.id, 'close');
                  }}
                />
                <MacButton 
                  color={theme.colors.mac.yellow} 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWindowAction(window.id, 'minimize');
                  }}
                />
                <MacButton 
                  color={theme.colors.mac.green} 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWindowAction(window.id, 'maximize');
                  }}
                />
              </MacHeader>
              <CardTitle>{content.title}</CardTitle>
              <CardDescription>{content.description}</CardDescription>
              {content.tags.map((tag, index) => (
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
        {minimizedWindows.map(window => (
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