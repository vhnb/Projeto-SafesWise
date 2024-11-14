import styles from './styles.module.css'
import Head from 'next/head'

export default function PageNotFound(){
    return(
        <main className={styles.container}>
            <Head>
                <title>Página não encontrada</title>
            </Head>
            <h1>404</h1>
            <p>Página não encontrada</p>
        </main>
    )
}