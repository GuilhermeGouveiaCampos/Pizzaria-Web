import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import {
  FaHome,
  FaUserPlus,
  FaChartLine,
  FaCog,
  FaCaretDown,
} from 'react-icons/fa';
import logo from '../../assets/cosmic-slice-logo.png';

const Sidebar = () => {
  const [isCadastroOpen, setIsCadastroOpen] = useState(false);
  const [isRelatorioOpen, setIsRelatorioOpen] = useState(false);

  const toggleCadastroMenu = () => setIsCadastroOpen(!isCadastroOpen);
  const toggleRelatorioMenu = () => setIsRelatorioOpen(!isRelatorioOpen);

  return (
    <div className={styles.sidebar}>
      <div className={styles.logoSection}>
        <img src={logo} alt="Cosmic Slice" className={styles.logo} />
        <h2 className={styles.title}>COSMIC SLICE</h2>
      </div>
      <nav className={styles.nav}>
        <NavLink to="/dashboard" className={styles.navLink}>
          <FaHome className={styles.icon} /> Início
        </NavLink>

        <div className={styles.navLink} onClick={toggleCadastroMenu}>
          <FaUserPlus className={styles.icon} /> Cadastro <FaCaretDown className={styles.caret} />
        </div>
        {isCadastroOpen && (
          <div className={styles.subMenu}>
            <NavLink to="/dashboard/cadastro-usuarios" className={styles.subMenuLink}>
              Cadastrar Usuários
            </NavLink>
            <NavLink to="/dashboard/cadastro-itens" className={styles.subMenuLink}>
              Cadastrar Itens
            </NavLink>
          </div>
        )}

        <div className={styles.navLink} onClick={toggleRelatorioMenu}>
          <FaChartLine className={styles.icon} /> Relatórios <FaCaretDown className={styles.caret} />
        </div>
        {isRelatorioOpen && (
          <div className={styles.subMenu}>
            <NavLink to="/dashboard/relatorios/clientes" className={styles.subMenuLink}>
              Relatório de Clientes
            </NavLink>
            <NavLink to="/dashboard/relatorios/vendas" className={styles.subMenuLink}>
              Relatório de Vendas
            </NavLink>
          </div>
        )}

        <NavLink to="/dashboard/configuracoes" className={styles.navLink}>
          <FaCog className={styles.icon} /> Configurações
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
