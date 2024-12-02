import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 
import styles from './RelatorioClientes.module.css';
import { FaUsers } from 'react-icons/fa';

const RelatorioClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroNome, setFiltroNome] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [status, setStatus] = useState('Todos'); 

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch('http://localhost/api/getClientes.php');
        const data = await response.json();
        if (data.success) {
          setClientes(data.data);
        } else {
          setError(data.message || 'Erro ao carregar os dados.');
        }
      } catch {
        setError('Erro de conexão com a API.');
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  const clientesFiltrados = clientes.filter((cliente) => {
    const nomeCompleto = `${cliente.nome} ${cliente.sobrenome}`.toLowerCase();
    const filtroAtendeNome = nomeCompleto.includes(filtroNome.toLowerCase());
    const filtroAtendeStatus =
      status === 'Todos' ||
      (status === 'Ativos' && cliente.status === 'ativo') ||
      (status === 'Inativos' && cliente.status === 'inativo');

    return filtroAtendeNome && filtroAtendeStatus;
  });

  const gerarPDF = () => {
    const doc = new jsPDF();
    doc.text('Relatório de Clientes', 14, 10);

    // Configuração da tabela com jsPDF
    const tableColumn = [
      'ID do Cliente',
      'Nome Completo',
      'Data de Nascimento',
      'Telefone',
      'Estado',
      'Total Gasto',
      'Total Pedidos',
      'Data da Última Compra',
    ];
    const tableRows = clientesFiltrados.map((cliente) => [
      cliente.id_cliente,
      `${cliente.nome} ${cliente.sobrenome}`,
      cliente.data_nascimento,
      cliente.telefone,
      cliente.estado,
      `R$ ${(parseFloat(cliente.total_gasto) || 0).toFixed(2)}`, 
      cliente.total_pedidos,
      cliente.data_ultima_compra,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
    });

    doc.save('Relatorio_Clientes.pdf');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>EMITIR RELATÓRIO CLIENTES</h1>
        <FaUsers className={styles.icon} />
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="filtroNome" className={styles.filterLabel}>
            Cliente
          </label>
          <input
            type="text"
            id="filtroNome"
            className={styles.filterInput}
            placeholder="Digite o nome do cliente"
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
          />
        </div>

        {/* Botão para gerar PDF */}
        <button className={styles.generateButton} onClick={gerarPDF}>
          Gerar Relatório
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID do Cliente</th>
              <th>Nome Completo</th>
              <th>Data de Nascimento</th>
              <th>Telefone</th>
              <th>Estado</th>
              <th>Total Gasto</th>
              <th>Total Pedidos</th>
              <th>Data da Última Compra</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente.id_cliente}>
                <td>{cliente.id_cliente}</td>
                <td>{`${cliente.nome} ${cliente.sobrenome}`}</td>
                <td>{cliente.data_nascimento}</td>
                <td>{cliente.telefone}</td>
                <td>{cliente.estado}</td>
                <td>{`R$ ${(parseFloat(cliente.total_gasto) || 0).toFixed(2)}`}</td>
                <td>{cliente.total_pedidos}</td>
                <td>{cliente.data_ultima_compra}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RelatorioClientes;
