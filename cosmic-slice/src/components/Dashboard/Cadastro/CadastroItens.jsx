import { useState } from 'react';
import styles from './CadastroUsuario.module.css';

const CadastroItens = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [tamanho, setTamanho] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handlePrecoChange = (e) => {
    let valor = e.target.value.replace(/[^\d]/g, ''); // Remove tudo que não é número
    if (valor) {
      valor = (parseFloat(valor) / 100).toFixed(2); // Converte para valor monetário
      valor = valor.replace('.', ','); // Troca ponto por vírgula
    }
    setPreco(valor);
  };

  const handleCadastroItem = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost/api/cadastrar_item.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          descricao,
          preco: preco.replace(',', '.'), // Ajusta o formato para o banco de dados
          tamanho,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMensagem(data.message);
        // Limpa os campos do formulário
        setNome('');
        setDescricao('');
        setPreco('');
        setTamanho('');
      } else {
        setMensagem(data.message);
      }
    } catch (error) {
      console.error('Erro ao cadastrar item:', error);
      setMensagem('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Cadastro de Itens</h2>
      <form onSubmit={handleCadastroItem}>
        <div className={styles.inputGroup}>
          <label>Nome do Item</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          ></textarea>
        </div>
        <div className={styles.inputGroup}>
          <label>Preço (R$)</label>
          <input
            type="text"
            className={styles.inputPreco}
            value={preco}
            onChange={handlePrecoChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Tamanho</label>
          <select
            value={tamanho}
            onChange={(e) => setTamanho(e.target.value)}
            required
          >
            <option value="">Selecione o tamanho</option>
            <option value="pequena">Pequena</option>
            <option value="media">Média</option>
            <option value="grande">Grande</option>
            <option value="gigante">Gigante</option>
            <option value="familia">Família</option>
          </select>
        </div>
        <button type="submit" className={styles.button}>Cadastrar Item</button>
      </form>
      {mensagem && <p className={styles.successMessage}>{mensagem}</p>}
    </div>
  );
};

export default CadastroItens;
