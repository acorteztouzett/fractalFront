import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          PAGINA DE INICIO&nbsp;
        </p>
      </div>

      <div className={styles.grid}>
        <a
          href="/my-orders"
          className={styles.card}
        >
          <h2>
            My Orders <span>-&gt;</span>
          </h2>
          <p>Open to manage my orders</p>
        </a>
      </div>

      <div className={styles.grid}>
        <a
          href="/products"
          className={styles.card}
        >
          <h2>
            Products <span>-&gt;</span>
          </h2>
          <p>Open to manage the products</p>
        </a>
      </div>
        
    </main>
  );
}
