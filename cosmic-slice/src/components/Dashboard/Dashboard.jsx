import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Inicio from './Inicio';
import CadastroUsuarios from './Cadastro/CadastroUsuarios';
import CadastroItens from './Cadastro/CadastroItens';
import RelatorioClientes from './Relatorio/RelatorioClientes';
import RelatorioVendas from './Relatorio/RelatorioVendas';
import Configuracoes from './Configuracoes';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/cadastro-usuarios" element={<CadastroUsuarios />} />
          <Route path="/cadastro-itens" element={<CadastroItens />} />
          <Route path="/relatorios/clientes" element={<RelatorioClientes />} />
          <Route path="/relatorios/vendas" element={<RelatorioVendas />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
