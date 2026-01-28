import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('test@tester.com');
  const [password, setPassword] = useState('qwerty123');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await window.electronAPI.loginUser({ email, password });

    if (result.success && result.data) {
      localStorage.setItem('user', JSON.stringify(result.data.user));
      console.log("Welcome back:", result.data.user.name);
      navigate('/dashboard');
    } else {
      alert(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>NORVIA XI</div>
        <p className={styles.subtitle}>Secure Terminal Access v1.4</p>

        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Access Key / Email</label>
            <input 
              type="email" 
              className={styles.input}
              placeholder="operator@norvia.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Authorization Token</label>
            <input 
              type="password" 
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Initialize Session'}
          </button>
        </form>

        <div className={styles.footerLinks}>
          Forgot token? <span className={styles.link}>Request Reset</span>
        </div>
      </div>
    </div>
  );
};

export default Login;