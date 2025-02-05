import os
import subprocess
import time

# Project name
PROJECT_NAME = "my-react-ts-app"

# Command to create a Vite project with React and TypeScript
commands = [
    f"npm create vite@latest {PROJECT_NAME} --template react-ts --force",
    f"cd {PROJECT_NAME} && npm install",
    f"cd {PROJECT_NAME} && npm install react-router-dom zustand"
]

# Execute commands
for cmd in commands:
    print(f"Executing: {cmd}")
    subprocess.run(cmd, shell=True)
    time.sleep(2)  # Allow execution time

# Define the project file structure
files_to_create = {
    f"{PROJECT_NAME}/vite.config.ts": """\
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  }
});
""",
    f"{PROJECT_NAME}/src/auth/authStore.ts": """\
import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
}));

export default useAuthStore;
""",
    f"{PROJECT_NAME}/src/pages/Home.tsx": """\
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <nav>
        <Link to="/public">Public Page</Link> | 
        <Link to="/private">Private Page</Link>
      </nav>
    </div>
  );
};

export default Home;
""",
    f"{PROJECT_NAME}/src/pages/PublicPage.tsx": """\
const PublicPage = () => {
  return (
    <div>
      <h1>Public Page</h1>
      <p>Anyone can view this page.</p>
    </div>
  );
};

export default PublicPage;
""",
    f"{PROJECT_NAME}/src/pages/PrivatePage.tsx": """\
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../auth/authStore';

const PrivatePage = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div>
        <h1>Access Denied</h1>
        <p>You must log in to view this page.</p>
        <button onClick={() => navigate('/')}>Go to Home</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Private Page</h1>
      <p>Only logged-in users can see this.</p>
    </div>
  );
};

export default PrivatePage;
""",
    f"{PROJECT_NAME}/src/components/PopupBanner.tsx": """\
import { useState } from 'react';

const PopupBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%',
      background: 'red', color: 'white', padding: '10px', textAlign: 'center'
    }}>
      <p>Warning: This is a demo site.</p>
      <button onClick={() => setVisible(false)}>Close</button>
    </div>
  );
};

export default PopupBanner;
""",
    f"{PROJECT_NAME}/src/App.tsx": """\
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PublicPage from './pages/PublicPage';
import PrivatePage from './pages/PrivatePage';
import PopupBanner from './components/PopupBanner';

const App = () => {
  return (
    <Router>
      <PopupBanner />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/public" element={<PublicPage />} />
        <Route path="/private" element={<PrivatePage />} />
      </Routes>
    </Router>
  );
};

export default App;
""",
    f"{PROJECT_NAME}/src/main.tsx": """\
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
""",
}

# Create necessary directories and files
for filepath, content in files_to_create.items():
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w") as f:
        f.write(content)

print("\n✅ Project structure created successfully.")

# Build the project
print("\n📦 Building the project for static deployment...")
subprocess.run(f"cd {PROJECT_NAME} && npm run build", shell=True)

print("\n✅ Build completed! Static files are available in the 'dist' folder.")

# Start the development server
print("\n🚀 Running the development server on port 3000...")
subprocess.run(f"cd {PROJECT_NAME} && npm run dev", shell=True)
