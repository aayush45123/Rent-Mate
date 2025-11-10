import { useAuth0 } from "@auth0/auth0-react";
import { FiLogOut } from "react-icons/fi";
import styles from "./Logout.module.css";

const Logout = () => {
  const { logout } = useAuth0();

  return (
    <button
      className={styles.logoutBtn}
      onClick={() => logout({ returnTo: window.location.origin })}
    >
      <FiLogOut className={styles.icon} /> Log Out
    </button>
  );
};

export default Logout;
