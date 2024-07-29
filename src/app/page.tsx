import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          PAGINA DE INICIO&nbsp;
        </p>
      </div>

      <div className={styles.grid}>
        <Link href="/my-orders" className={styles.card}>
            <h2>
              My Orders <span>-&gt;</span>
            </h2>
            <p>Open to manage your orders</p>
        </Link>
      </div>

      <div className={styles.grid}>
        <Link href="/products" className={styles.card}>
          
            <h2>
              Products <span>-&gt;</span>
            </h2>
            <p>Open to see the products</p>
          
        </Link>
      </div>
        
    </main>
  );
}
