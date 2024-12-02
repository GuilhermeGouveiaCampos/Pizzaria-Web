import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./Inicio.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const Inicio = () => {
  const [pedidos, setPedidos] = useState([]);
  const [statusContagem, setStatusContagem] = useState({
    entregues: 0,
    emProducao: 0,
    aguardando: 0,
  });

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch("http://localhost/api/gerenciamentoinicio.php");
        const data = await response.json();

        if (data.success) {
          setPedidos(data.data || []);
        }
      } catch (err) {
        console.error("Erro ao carregar pedidos:", err);
      }
    };

    fetchPedidos();
  }, []);

  useEffect(() => {
    const contagem = {
      entregues: pedidos.filter((pedido) => pedido.status === "completo").length,
      emProducao: pedidos.filter((pedido) => pedido.status === "pendente").length,
      aguardando: pedidos.filter((pedido) => pedido.status === "aguardando").length,
    };

    setStatusContagem(contagem);
  }, [pedidos]);

  const handleStatusUpdate = async (pedidoId, novoStatus) => {
    try {
      const response = await fetch("http://localhost/api/gerenciamentoinicio.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_pedido: pedidoId,
          status: novoStatus,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPedidos((prevPedidos) =>
          prevPedidos.map((pedido) =>
            pedido.id_pedido === pedidoId ? { ...pedido, status: novoStatus } : pedido
          )
        );
      }
    } catch (err) {
      console.error("Erro ao atualizar status do pedido:", err);
    }
  };

  const getFilteredPedidos = (status) =>
    pedidos.filter((pedido) => pedido.status === status).slice(0, 10);

  const pieData = {
    labels: ["Entregues", "Em Produção", "Aguardando"],
    datasets: [
      {
        label: "Status dos Pedidos",
        data: [statusContagem.entregues, statusContagem.emProducao, statusContagem.aguardando],
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
      },
    ],
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Página Inicial</h1>

      <div className={styles.pieChartContainer}>
        <h2>Status dos Pedidos</h2>
        <Pie data={pieData} />
      </div>

      <div className={styles.approvalContainer}>
        <div className={styles.column}>
          <h2 className={styles.statusTitle}>Aguardando Aceitação</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredPedidos("aguardando").map((pedido) => (
                <tr key={pedido.id_pedido}>
                  <td>{pedido.id_pedido}</td>
                  <td>{pedido.cliente}</td>
                  <td>
                    <button
                      className={styles.actionButton}
                      onClick={() => handleStatusUpdate(pedido.id_pedido, "pendente")}
                    >
                      Aceitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.column}>
          <h2 className={styles.statusTitle}>Aguardando Finalização</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredPedidos("pendente").map((pedido) => (
                <tr key={pedido.id_pedido}>
                  <td>{pedido.id_pedido}</td>
                  <td>{pedido.cliente}</td>
                  <td>
                    <button
                      className={`${styles.actionButton} ${styles.finalize}`}
                      onClick={() => handleStatusUpdate(pedido.id_pedido, "completo")}
                    >
                      Finalizar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.column}>
          <h2 className={styles.statusTitle}>Pedidos Concluídos</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredPedidos("completo").map((pedido) => (
                <tr key={pedido.id_pedido}>
                  <td>{pedido.id_pedido}</td>
                  <td>{pedido.cliente}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
