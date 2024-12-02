import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import styles from './Login.module.css';
import logo from '../../assets/cosmic-slice-logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [loginValue, setLoginValue] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost/api/login.php', { // Substitua pela URL correta
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login: loginValue, senha })
      });

      console.log("Response status:", response.status); // Log para verificar o status da resposta

      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      const data = await response.json();
      console.log("Response data:", data); // Log para verificar a resposta

      if (data.success) {
        navigate('/dashboard');
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setErrorMessage('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.logoSection}>
        <img src={logo} alt="Cosmic Slice Logo" className={styles.logo} />
      </div>
      <div className={styles.formSection}>
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <FaUser className={styles.icon} />
            <input
              type="text"
              placeholder="login"
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <FaLock className={styles.icon} />
            <input
              type="password"
              placeholder="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <button type="submit" className={styles.button}>entrar</button>
          <a href="#" className={styles.forgotPassword}>Esqueci minha senha</a>
        </form>
      </div>
    </div>
  );
};

export default Login;
