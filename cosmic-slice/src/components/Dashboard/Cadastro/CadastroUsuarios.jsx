import { useState } from 'react';
import styles from './CadastroUsuario.module.css';
import logo from '../../../assets/cosmic-slice-logo.png';

const CadastroUsuario = () => {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleCadastroUsuario = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost/api/cadastrar_usuario.php', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          sobrenome,
          cpf,
          telefone,
          email,
          senha,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMensagem(data.message); // Exibe mensagem de sucesso
        // Limpe os campos do formulário após o cadastro bem-sucedido
        setNome('');
        setSobrenome('');
        setCpf('');
        setTelefone('');
        setEmail('');
        setSenha('');
      } else {
        setMensagem(data.message); // Exibe mensagem de erro, se houver
      }
    } catch (error) {
      console.error('Erro ao fazer o cadastro:', error);
      setMensagem('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className={styles.cadastroPage}>
      <div className={styles.formContainer}>
        <div className={styles.logoSection}>
          <img src={logo} alt="Cosmic Slice Logo" />
          <h2>COSMIC SLICE</h2>
        </div>
        <h2>Cadastro de Usuário</h2>
        <form onSubmit={handleCadastroUsuario}>
          <div className={styles.inputGroup}>
            <label>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Sobrenome</label>
            <input
              type="text"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>CPF</label>
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Telefone</label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup} style={{ position: "relative" }}>
            <label>Senha</label>
            <input
              type={showPassword ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              👁️
            </span>
          </div>
          <button type="submit" className={styles.button}>Cadastrar</button>
        </form>
        {mensagem && <p className={styles.successMessage}>{mensagem}</p>}
      </div>
    </div>
  );
};

export default CadastroUsuario;
