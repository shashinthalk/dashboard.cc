import { useState, useCallback } from 'react';

export interface WindowState {
  id: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  title: string;
  order: number;
  source: 'main' | 'menu';
}

export interface WindowContent {
  title: string;
  description: string;
  tags: string[];
  code: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

const initialWindows: WindowState[] = [
  { id: 'code-preview', title: 'Mac-Style Code Preview', isOpen: true, isMinimized: false, isMaximized: false, order: 0, source: 'main' },
  { id: 'recent-activity', title: 'Recent Activity', isOpen: true, isMinimized: true, isMaximized: false, order: 1, source: 'main' },
  { id: 'quick-actions', title: 'Quick Actions', isOpen: true, isMinimized: true, isMaximized: false, order: 2, source: 'main' },
  { id: 'quick-actionsf', title: 'Quick Actions f', isOpen: true, isMinimized: true, isMaximized: false, order: 3, source: 'main' },
];

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'reports', label: 'Reports', icon: '📑' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'messages', label: 'Messages', icon: '✉️' },
];

const getWindowContent = (windowId: string): WindowContent => {
  switch (windowId) {
    case 'code-preview':
      return {
        title: 'Mac-Style Code Preview',
        description: 'A glimpse of your code in a clean and Mac-like window. Click to explore!',
        tags: ['TAG JS', 'TAG JS'],
        code: '<h1> Hello World </h1>'
      };
    default:
      return { title: '', description: '', tags: [], code: '' };
  }
};

export const useWindowManager = () => {
  const [windows, setWindows] = useState<WindowState[]>(initialWindows);
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');

  const addWindowToQueue = useCallback((windowId: string, isNewWindow: boolean = false) => {
    return (prevWindows: WindowState[]): WindowState[] => {
      let updatedWindows = [...prevWindows];
      if (isNewWindow) {
        updatedWindows = updatedWindows.map(window => ({
          ...window,
          isMinimized: true,
          order: window.order + 1
        }));
        const newWindow: WindowState = {
          id: windowId,
          title: menuItems.find((item) => item.id === windowId)?.label || windowId,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          order: 0,
          source: 'menu'
        };
        updatedWindows.push(newWindow);
      } else {
        updatedWindows = updatedWindows.map(window => {
          if (window.id === windowId) {
            return { ...window, order: 0, isMinimized: false };
          } else {
            return { ...window, order: window.order + 1, isMinimized: true };
          }
        });
      }
      return updatedWindows;
    };
  }, []);

  const handleWindowAction = useCallback((windowId: string, action: 'minimize') => {
    setWindows((prevWindows: WindowState[]) => {
      return prevWindows.map(window =>
        window.id === windowId
          ? { ...window, isMinimized: true }
          : window
      );
    });
  }, []);

  const restoreWindow = useCallback((windowId: string) => {
    setWindows((prevWindows: WindowState[]) => {
      return prevWindows.map(window =>
        window.id === windowId
          ? { ...window, isMinimized: false, order: 0 }
          : { ...window, isMinimized: true, order: window.order + 1 }
      );
    });
  }, []);

  const handleMenuClick = useCallback((menuId: string) => {
    setActiveMenuItem(menuId);
    const existingWindow = windows.find((w: WindowState) => w.id === menuId);
    if (existingWindow) {
      if (!existingWindow.isOpen) {
        setWindows(addWindowToQueue(menuId, true));
      } else if (existingWindow.isMinimized) {
        setWindows(addWindowToQueue(menuId, false));
      } else {
        setWindows(addWindowToQueue(menuId, false));
      }
    } else {
      setWindows(addWindowToQueue(menuId, true));
    }
  }, [windows, addWindowToQueue]);

  const minimizedWindows = windows.filter((w: WindowState) => w.isMinimized);
  const visibleWindows = windows
    .filter((w: WindowState) => w.isOpen && !w.isMinimized)
    .sort((a: WindowState, b: WindowState) => a.order - b.order);

  return {
    windows,
    activeMenuItem,
    menuItems,
    minimizedWindows,
    visibleWindows,
    handleWindowAction,
    restoreWindow,
    handleMenuClick,
    getWindowContent,
  };
}; 