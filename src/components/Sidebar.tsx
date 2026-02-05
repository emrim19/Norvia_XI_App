import styles from "./Sidebar.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserName(user.name);
    }
  }, []);

  // Helper to keep the JSX clean
  const getBtnClass = (path: string) => {
    return `${styles.navButton} ${location.pathname === path ? styles.active : ""}`;
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>NORVIA XI</div>
      <nav className={styles.navList}>
        <button
          className={getBtnClass("/signup")}
          onClick={() => navigate("/signup")}
        >
          Signup
        </button>
        <button className={getBtnClass("/")} onClick={() => navigate("/")}>
          Login
        </button>
        <button
          className={getBtnClass("/dashboard")}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>
        <button
          className={getBtnClass("/fileExplorer")}
          onClick={() => navigate("/fileExplorer")}
        >
          File Explorer
        </button>
        <div className={styles.userProfile}>
          <span className={styles.userName}>Logged in as: {userName}</span>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
