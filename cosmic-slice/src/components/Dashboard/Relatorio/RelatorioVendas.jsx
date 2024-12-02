import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import styles from './RelatorioVendas.module.css';
import { FaShoppingCart } from 'react-icons/fa';

const RelatorioVendas = () => {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');

  useEffect(() => {
    const fetchVendas = async () => {
      try {
        const response = await fetch('http://localhost/api/getVendas.php');
        const data = await response.json();
        if (data.success) {
          setVendas(data.data);
        } else {
          setError(data.message || 'Erro ao carregar as vendas.');
        }
      } catch {
        setError('Erro de conexão com a API.');
      } finally {
        setLoading(false);
      }
    };

    fetchVendas();
  }, []);

  const vendasFiltradas = vendas.filter((venda) =>
    venda.cliente.toLowerCase().includes(filtroCliente.toLowerCase())
  );

  const gerarPDF = () => {
    const doc = new jsPDF();
    doc.text('Relatório de Vendas', 14, 10);

    const tableColumn = [
      'ID da Venda',
      'Data da Venda',
      'Cliente',
      'Itens',
      'Valor Total',
      'Status',
    ];
    const tableRows = vendasFiltradas.map((venda) => [
      venda.id_venda,
      venda.data_venda,
      venda.cliente,
      venda.itens,
      `R$ ${(parseFloat(venda.valor_total) || 0).toFixed(2)}`,
      venda.status,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
    });

    doc.save('Relatorio_Vendas.pdf');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>EMITIR RELATÓRIO DE VENDAS</h1>
        <FaShoppingCart className={styles.icon} />
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="filtroCliente" className={styles.filterLabel}>
            Cliente
          </label>
          <input
            type="text"
            id="filtroCliente"
            className={styles.filterInput}
            placeholder="Digite o nome do cliente"
            value={filtroCliente}
            onChange={(e) => setFiltroCliente(e.target.value)}
          />
        </div>

        <button className={styles.generateButton} onClick={gerarPDF}>
          Gerar Relatório
        </button>
      </div>

      {loading ? (
        <p className={styles.error}>Carregando...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID da Venda</th>
              <th>Data da Venda</th>
              <th>Cliente</th>
              <th>Itens</th>
              <th>Valor Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {vendasFiltradas.map((venda) => (
              <tr key={venda.id_venda}>
                <td>{venda.id_venda}</td>
                <td>{venda.data_venda}</td>
                <td>{venda.cliente}</td>
                <td>{venda.itens}</td>
                <td>R$ {(parseFloat(venda.valor_total) || 0).toFixed(2)}</td>
                <td>{venda.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RelatorioVendas;
