import { useAuth0 } from "@auth0/auth0-react";
import styles from "./Login.module.css";

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className={styles.wrapper}>
      <button className={styles.button} onClick={() => loginWithRedirect()}>
        Sign In / Sign Up
        <div className={styles.arrowWrapper}>
          <div className={styles.arrow} />
        </div>
      </button>
    </div>
  );
};

export default Login;
