# Shashinthalk Dashboard - Personal Admin Panel

A modern, responsive admin dashboard built with React and TypeScript for managing personal projects and development workflow.

## 🚀 Features

### **Authentication System**
- Secure login interface with environment-based credentials
- Persistent authentication with localStorage
- Automatic session management
- Mobile-responsive login form

### **Dashboard Interface**
- **Mac-Style Window Management**: Red, yellow, green window controls
- **Dynamic Window System**: Open, minimize, maximize, and close windows
- **Smart Queue Management**: Always maintains exactly 3 visible windows
- **Responsive Layout**: Works perfectly on desktop and mobile devices

### **Window Management**
- **Left Menu Integration**: Each menu item opens its own window
- **Status Bar**: Minimized windows appear as clickable buttons
- **Window Ordering**: New windows appear on the left, rightmost window auto-minimizes
- **Maximize Mode**: Windows can fill the entire main area

### **Available Windows**
- **Mac-Style Code Preview**: Code display with syntax highlighting
- **Recent Activity**: Git commits and development activities
- **Quick Actions**: Frequently used commands and shortcuts
- **Users Management**: User accounts and permissions
- **Analytics Dashboard**: Performance metrics and charts
- **Reports Center**: Data reports and exports
- **Settings Panel**: Application configuration
- **Messages Center**: System notifications

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Styled Components with custom theme system
- **Authentication**: Custom auth service with localStorage
- **State Management**: React Context API
- **Build Tool**: Create React App
- **Package Manager**: npm

## 📱 Responsive Design

- **Desktop**: Full-featured dashboard with sidebar navigation
- **Mobile**: Optimized layout with hidden sidebar and stacked windows
- **Tablet**: Adaptive grid system for medium screens

## 🎨 Theme System

The dashboard uses a consistent dark theme inspired by modern code editors:

```typescript
colors: {
  background: '#000000',
  surface: '#0d1117',
  border: '#333333',
  text: {
    primary: '#e6e6ef',
    secondary: '#666666',
    code: '#dcdcdc'
  },
  mac: {
    red: '#ff5f57',
    yellow: '#ffbd2e',
    green: '#28c941'
  }
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   echo "REACT_APP_DEMO_EMAIL=admin@dashboard.com" > .env
   echo "REACT_APP_DEMO_PASSWORD=admin123" >> .env
   echo "REACT_APP_API_URL=http://localhost:3001/api" >> .env
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Login Credentials
- **Email**: `admin@dashboard.com`
- **Password**: `admin123`

## 📁 Project Structure

```
src/
├── features/
│   └── auth/
│       ├── components/
│       │   └── LoginForm.tsx
│       ├── context/
│       │   └── AuthContext.tsx
│       └── services/
│           └── authService.ts
├── layouts/
│   └── DashboardLayout.tsx
├── styles/
│   └── theme.ts
├── App.tsx
└── index.tsx
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Demo Login Credentials
REACT_APP_DEMO_EMAIL=admin@dashboard.com
REACT_APP_DEMO_PASSWORD=admin123

# API Configuration (for future use)
REACT_APP_API_URL=http://localhost:3001/api
```

### Customization

#### Adding New Windows
1. Add menu item to `menuItems` array in `DashboardLayout.tsx`
2. Add content case in `getWindowContent()` function
3. Window will automatically be available in the left menu

#### Modifying Theme
Edit `src/styles/theme.ts` to customize colors, spacing, and typography.

## 🎯 Key Features Explained

### Window Queue System
- **Maximum 3 Windows**: Only 3 windows can be visible at once
- **Left Priority**: New windows always appear on the left
- **Auto-Minimization**: Rightmost window automatically minimizes when needed
- **Status Bar Integration**: Minimized windows appear as clickable buttons

### Authentication Flow
1. User enters credentials
2. AuthService validates against environment variables
3. On success, user data is stored in localStorage
4. App automatically redirects to dashboard
5. User can logout via dropdown menu

### Responsive Behavior
- **Desktop**: Full sidebar, 3-column window grid
- **Mobile**: Hidden sidebar, single-column window stack
- **Window Controls**: Mac-style buttons work on all devices

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables in deployment settings

## 🔒 Security Notes

- Current implementation uses demo credentials for development
- For production, implement proper backend authentication
- Consider adding JWT token refresh mechanisms
- Implement proper session timeout handling

## 🎨 Customization Guide

### Adding New Menu Items
```typescript
const menuItems = [
  // ... existing items
  { id: 'new-feature', label: 'New Feature', icon: '🚀' },
];
```

### Creating Window Content
```typescript
case 'new-feature':
  return {
    title: 'New Feature',
    description: 'Description of the new feature',
    tags: ['TAG1', 'TAG2'],
    code: 'console.log("New feature code");'
  };
```

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

## 📄 License

This project is for personal use by Nishan Shashintha.

## 👨‍💻 Author

**Nishan Shashintha**
- Personal admin panel for project management
- Built with modern React and TypeScript
- Designed for development workflow efficiency

---

*Built with ❤️ for personal project management*
