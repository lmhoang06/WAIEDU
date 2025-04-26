@echo off
echo Creating professional project structure...

:: Create main source directories
mkdir src 2>nul
mkdir src\components 2>nul
mkdir src\pages 2>nul
mkdir src\layouts 2>nul
mkdir src\hooks 2>nul
mkdir src\services 2>nul
mkdir src\utils 2>nul
mkdir src\contexts 2>nul
mkdir src\assets 2>nul
mkdir src\assets\images 2>nul
mkdir src\assets\fonts 2>nul
mkdir src\styles 2>nul
mkdir src\types 2>nul
mkdir src\constants 2>nul
mkdir src\config 2>nul
mkdir src\store 2>nul
mkdir public 2>nul

:: Create placeholder files
echo // Common components go here > src\components\index.js
echo // Pages/routes components go here > src\pages\index.js
echo // Layout components go here > src\layouts\index.js
echo // Custom React hooks go here > src\hooks\index.js
echo // API services go here > src\services\api.js
echo // Utility functions go here > src\utils\index.js
echo // React contexts go here > src\contexts\index.js
echo // Global constants > src\constants\index.js
echo // Application configuration > src\config\index.js
echo // Global styles > src\styles\global.css
echo // Type definitions > src\types\index.ts

:: Create main application files if they don't exist
if not exist src\main.jsx (
  echo import React from 'react' > src\main.jsx
  echo import ReactDOM from 'react-dom/client' >> src\main.jsx
  echo import App from './App.jsx' >> src\main.jsx
  echo import './styles/global.css' >> src\main.jsx
  echo. >> src\main.jsx
  echo ReactDOM.createRoot(document.getElementById('root')).render( >> src\main.jsx
  echo   ^<React.StrictMode^> >> src\main.jsx
  echo     ^<App /^> >> src\main.jsx
  echo   ^</React.StrictMode^> >> src\main.jsx
  echo ) >> src\main.jsx
)

if not exist src\App.jsx (
  echo import { useState } from 'react' > src\App.jsx
  echo. >> src\App.jsx
  echo function App() { >> src\App.jsx
  echo   const [count, setCount] = useState(0) >> src\App.jsx
  echo. >> src\App.jsx
  echo   return ( >> src\App.jsx
  echo     ^<^> >> src\App.jsx
  echo       ^<h1^>WAIEDU Project^</h1^> >> src\App.jsx
  echo       ^<div^> >> src\App.jsx
  echo         ^<p^>Welcome to your professionally structured React application^</p^> >> src\App.jsx
  echo       ^</div^> >> src\App.jsx
  echo     ^</^> >> src\App.jsx
  echo   ) >> src\App.jsx
  echo } >> src\App.jsx
  echo. >> src\App.jsx
  echo export default App >> src\App.jsx
)

echo.
echo Project structure created successfully!
echo.
echo Directory structure explanation:
echo - src/components: Reusable UI components
echo - src/pages: Page components corresponding to routes
echo - src/layouts: Layout components that wrap pages
echo - src/hooks: Custom React hooks
echo - src/services: API services and data fetching
echo - src/utils: Utility functions
echo - src/contexts: React context providers
echo - src/assets: Static assets like images and fonts
echo - src/styles: Global styles and theme configurations
echo - src/types: TypeScript type definitions
echo - src/constants: Application constants
echo - src/config: Application configuration
echo - src/store: State management (Redux, Zustand, etc.)
echo - public: Static files served directly
echo.
echo You can now start building your application with a clean structure!
