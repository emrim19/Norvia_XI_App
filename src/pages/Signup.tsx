import styles from "./Signup.module.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const passwordsMatch =
    formData.password === formData.confirmPassword && formData.password !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) return;

    const signupData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
    };

    const result = await window.electronAPI.registerUser(signupData);

    console.log(result);
    if (result.success) {
      console.log("Registration successful!", result.data);
      navigate("/");
    } else {
      alert(`Registration failed: ${result.error}`);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        <h1 className={styles.title}>Create Identity</h1>
        <p className={styles.subtitle}>Join the Norvia Network Architecture</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>First Name</label>
              <input
                className={styles.input}
                type="text"
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Last Name</label>
              <input
                className={styles.input}
                type="text"
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              className={styles.input}
              type="email"
              placeholder="name@company.com"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm Password</label>
            <input
              className={styles.input}
              type="password"
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />
            {!passwordsMatch && formData.confirmPassword && (
              <span style={{ color: "#f43f5e", fontSize: "0.7rem" }}>
                Tokens do not match
              </span>
            )}
          </div>

          <button
            type="submit"
            className={styles.signupButton}
            disabled={!passwordsMatch}
          >
            Create Account
          </button>
        </form>

        <div className={styles.footer}>
          Already have an identity?{" "}
          <span className={styles.link} onClick={() => navigate("/login")}>
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
