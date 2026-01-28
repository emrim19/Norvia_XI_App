// @ts-ignore
import styles from './Sidebar.module.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to keep the JSX clean
  const getBtnClass = (path: string) => {
    return `${styles.navButton} ${location.pathname === path ? styles.active : ''}`;
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>NORVIA XI</div>
      <nav className={styles.navList}>
        <button className={getBtnClass('/signup')} onClick={() => navigate('/signup')}>
          Signup
        </button>
        <button className={getBtnClass('/login')} onClick={() => navigate('/login')}>
          Login
        </button>
        <button className={getBtnClass('/')} onClick={() => navigate('/')}>
          Dashboard
        </button>
        <button className={getBtnClass('/fileExplorer')} onClick={() => navigate('/fileExplorer')}>
          File Explorer
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;