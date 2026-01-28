import { Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import FileExplorer from './components/FileExplorer';
import Sidebar from "./components/Sidebar";
import Signup from './pages/Signup';

const App = () => {
  return (
    <div className="app-container">
      <Sidebar></Sidebar>
      <main className="main-content">
        <header className="title-bar" style={{ WebkitAppRegion: 'drag' } as any}>
          <div className="version-tag">Console v1.4</div>
        </header>

        {/* The Router switches content here */}
        <div className="scroll-area">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/fileExplorer" element={<FileExplorer />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default App;