import { useState, useCallback, useEffect } from 'react';
import { 
  WINDOW_CONFIGS, 
  MENU_ITEMS, 
  INITIAL_WINDOWS, 
  getWindowContent, 
  createWindowState,
  getContentFilePath
} from '../constants/windowConfig';

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

export interface LoadedComponent {
  [key: string]: React.ComponentType;
}

export const useWindowManager = () => {
  const [windows, setWindows] = useState<WindowState[]>(INITIAL_WINDOWS);
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [loadedComponents, setLoadedComponents] = useState<LoadedComponent>({});

  // Load JSX content components dynamically
  const loadContentComponent = useCallback(async (windowId: string) => {
    const contentFile = getContentFilePath(windowId);
    if (!contentFile || loadedComponents[windowId]) {
      return;
    }

    try {
      const module = await import(`../windows/${contentFile}`);
      const Component = module.default;
      setLoadedComponents(prev => ({
        ...prev,
        [windowId]: Component
      }));
    } catch (error) {
      console.error(`Failed to load content component for ${windowId}:`, error);
    }
  }, [loadedComponents]);

  // Load components for visible windows
  useEffect(() => {
    const visibleWindowIds = windows
      .filter(w => w.isOpen && !w.isMinimized)
      .map(w => w.id);

    visibleWindowIds.forEach(windowId => {
      loadContentComponent(windowId);
    });
  }, [windows, loadContentComponent]);

  const addWindowToQueue = useCallback((windowId: string, isNewWindow: boolean = false) => {
    return (prevWindows: WindowState[]): WindowState[] => {
      let updatedWindows = [...prevWindows];
      if (isNewWindow) {
        updatedWindows = updatedWindows.map(window => ({
          ...window,
          isMinimized: true,
          order: window.order + 1
        }));
        const newWindow = createWindowState(windowId, 0);
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
    menuItems: MENU_ITEMS,
    minimizedWindows,
    visibleWindows,
    loadedComponents,
    handleWindowAction,
    restoreWindow,
    handleMenuClick,
    getWindowContent,
    loadContentComponent,
  };
}; 