import { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import styles from './Configuracoes.module.css';

const Configuracoes = () => {
  const [empresas, setEmpresas] = useState([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [form, setForm] = useState({});
  const [mensagem, setMensagem] = useState('');
  const [modoEdicao, setModoEdicao] = useState(false);

  // Buscar lista de empresas
  useEffect(() => {
    fetch('http://localhost/api/getEmpresas.php')
      .then((res) => res.json())
      .then((data) => setEmpresas(data.data || []))
      .catch((err) => console.error('Erro ao carregar empresas:', err));
  }, []);

  // Buscar dados da empresa selecionada
  useEffect(() => {
    if (empresaSelecionada) {
      setModoEdicao(false); // Inicia em modo de visualização
      fetch(`http://localhost/api/getEmpresas.php?id=${empresaSelecionada}`)
        .then((res) => res.json())
        .then((data) => setForm(data.data || {}))
        .catch((err) => console.error('Erro ao carregar dados da empresa:', err));
    }
  }, [empresaSelecionada]);

  // Atualizar valores do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === 'cnpj') {
      formattedValue = value
        .replace(/\D/g, '') // Remove caracteres não numéricos
        .replace(/(\d{2})(\d)/, '$1.$2') // Primeiro ponto
        .replace(/(\d{3})(\d)/, '$1.$2') // Segundo ponto
        .replace(/(\d{3})(\d)/, '$1/$2') // Barra
        .replace(/(\d{4})(\d)/, '$1-$2'); // Traço
    } else if (name === 'telefone') {
      formattedValue = value
        .replace(/\D/g, '') // Remove não numéricos
        .replace(/(\d{2})(\d)/, '($1) $2') // Parênteses e espaço
        .replace(/(\d{5})(\d)/, '$1-$2') // Traço
        .slice(0, 15); // Limite de 15 caracteres
    } else if (name === 'cep') {
      formattedValue = value.replace(/\D/g, '').slice(0, 8); // Apenas números, máximo de 8 caracteres
    }

    setForm({ ...form, [name]: formattedValue });
  };

  // Salvar alterações
  const handleSave = () => {
    fetch('http://localhost/api/getEmpresas.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erro ao salvar as alterações');
        }
        return res.json();
      })
      .then((data) => {
        setMensagem(data.message || 'Alterações salvas com sucesso!');
        setModoEdicao(false);
      })
      .catch((err) => console.error('Erro ao salvar dados:', err));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>CONFIGURAÇÕES GERAIS</h1>

      {/* Seleção da empresa */}
      <label htmlFor="empresaSelect">Escolha qual é a empresa:</label>
      <select
        id="empresaSelect"
        value={empresaSelecionada || ''}
        onChange={(e) => setEmpresaSelecionada(e.target.value)}
      >
        <option value="">Selecione uma empresa</option>
        {empresas.map((empresa) => (
          <option key={empresa.id_empresa} value={empresa.id_empresa}>
            {empresa.razao_social}
          </option>
        ))}
      </select>

      {/* Exibição e edição */}
      {empresaSelecionada && (
        <>
          <table className={styles.table}>
            <tbody>
              {Object.keys(form)
                .filter((key) => key !== 'id_empresa') // Remove o campo id_empresa
                .map((key) => (
                  <tr key={key}>
                    <td>{key.replace('_', ' ')}</td>
                    <td>
                      {modoEdicao ? (
                        key === 'horario_abertura' || key === 'horario_fechamento' ? (
                          <input
                            type="time" // Campo para selecionar horário
                            name={key}
                            value={form[key] || ''}
                            onChange={handleChange}
                          />
                        ) : (
                          <input
                            type="text"
                            name={key}
                            value={form[key] || ''}
                            onChange={handleChange}
                          />
                        )
                      ) : (
                        <span>{form[key]}</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className={styles.actions}>
            {modoEdicao ? (
              <button className={styles.actionButton} onClick={handleSave}>
                <FaEdit className={styles.icon} /> Salvar Alterações
              </button>
            ) : (
              <button
                className={styles.actionButton}
                onClick={() => setModoEdicao(true)}
              >
                <FaEdit className={styles.icon} /> Editar
              </button>
            )}
          </div>
        </>
      )}

      {/* Mensagem de sucesso/erro */}
      {mensagem && <p className={styles.message}>{mensagem}</p>}
    </div>
  );
};

export default Configuracoes;
