import { WindowState, WindowContent, MenuItem } from '../hooks/useWindowManager';

// Window configuration type
type WindowConfig = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  code: string;
  icon: string;
  source: 'main' | 'menu';
  contentFile?: string;
};

// Common window configurations
export const WINDOW_CONFIGS: Record<string, WindowConfig> = {
  'user-http-request-handler': {
    id: 'user-http-request-handler',
    title: 'User HTTP Request Handler',
    description: 'Handle HTTP requests from users.',
    tags: ['HTTP', 'REQUESTS'],
    code: 'npm start',
    icon: '🔄',
    source: 'main',
    contentFile: 'UserHTTPRequestHandler.tsx'
  },
  'recent-activity-content': {
    id: 'recent-activity-content',
    title: 'Recent Activity Content',
    description: 'Fetch user requests and listning responces',
    tags: ['HTTP', 'REQUESTS'],
    code: 'npm start',
    icon: '🔄',
    source: 'main',
    contentFile: 'RecentActivityContent.tsx'
  }
};

// Menu items configuration
export const MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'reports', label: 'Reports', icon: '📑' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'messages', label: 'Messages', icon: '✉️' },
];

// Initial window states
export const INITIAL_WINDOWS: WindowState[] = [
  { 
    id: 'user-http-request-handler', 
    title: WINDOW_CONFIGS['user-http-request-handler'].title, 
    isOpen: true, 
    isMinimized: true, 
    isMaximized: false, 
    order: 2, 
    source: 'main' 
  },
  { 
    id: 'recent-activity-content', 
    title: WINDOW_CONFIGS['recent-activity-content'].title, 
    isOpen: true, 
    isMinimized: true, 
    isMaximized: false, 
    order: 2, 
    source: 'main' 
  }
];

// Default window configuration for missing configs
const DEFAULT_WINDOW_CONFIG: WindowConfig = {
  id: 'default',
  title: 'Window',
  description: 'This window is not configured yet.',
  tags: ['DEFAULT'],
  code: '// Window content not available',
  icon: '📄',
  source: 'menu'
};

// Helper function to get window content
export const getWindowContent = (windowId: string): WindowContent => {
  const config = WINDOW_CONFIGS[windowId] || DEFAULT_WINDOW_CONFIG;
  
  return {
    title: config.title,
    description: config.description,
    tags: [...config.tags], // Create a mutable copy
    code: config.code
  };
};

// Helper function to get content file path
export const getContentFilePath = (windowId: string): string | null => {
  const config = WINDOW_CONFIGS[windowId];
  return config?.contentFile || null;
};

// Helper function to create window state from config
export const createWindowState = (windowId: string, order: number = 0): WindowState => {
  const config = WINDOW_CONFIGS[windowId];
  
  if (!config) {
    // Return a default window state instead of throwing an error
    console.warn(`Window config not found for id: ${windowId}, using default`);
    return {
      id: windowId,
      title: windowId.charAt(0).toUpperCase() + windowId.slice(1), // Capitalize first letter
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      order,
      source: 'menu'
    };
  }
  
  return {
    id: config.id,
    title: config.title,
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    order,
    source: config.source
  };
};

// Common values and constants
export const WINDOW_CONSTANTS = {
  MAX_VISIBLE_WINDOWS: 1,
  DEFAULT_ORDER: 0,
  ANIMATION_DURATION: 300,
  Z_INDEX_BASE: 1000,
} as const; 