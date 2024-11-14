import styles from './styles.module.css'
import Head from 'next/head'
import CardMember from '@/components/CardMember'

export default function Sobre() {
    return (
        <main className={styles.container}>
            <Head>
                <title>Sobre SafesWise</title>
            </Head>
            <div className={styles.contentHome}>
                <div className={styles.contentSizeHome}>
                    <div className={styles.contentHomeInfos}>
                        <h1>Sobre nós</h1>
                        <p>Abaixo, confira os membros de nossa equipe e suas funções.</p>
                        <a href="/cursos">Veja nossos cursos</a>
                    </div>
                    <img src="information.png" alt="Image Info" />
                </div>
            </div>
            <div className={styles.contentMembers}>
                <div className={styles.sizeContainerMembers}>
                    <CardMember
                        name='Victor Henrique'
                        desc='Responsável pela construção do site com tecnologias modernas como Next.js, TypeScript, Firebase e Next-auth, garantindo uma plataforma funcional e segura.'
                        image='victor.jpg'
                    />
                    <CardMember
                        name='Bernardo Arduino'
                        desc='Conduz os testes iniciais para assegurar que o site funcione perfeitamente e atenda às expectativas dos usuários, identificando melhorias para uma experiência intuitiva.'
                        image='bernardo.jpg'
                    />
                    <CardMember
                        name='Gustavo Duarte'
                        desc='Responsável por definir e coordenar estratégias de marketing, garantindo que o site tenha um posicionamento competitivo e atraia o público certo de forma eficaz.'
                        image='gustavo.jpg'
                    />
                    <CardMember
                        name='Kauã Oliveira'
                        desc='O talento criativo por trás do design, focado em criar uma experiência visual e interativa que prioriza a usabilidade e a estética, oferecendo uma navegação intuitiva e envolvente.'
                        image='kaua.jpg'
                    />
                </div>
            </div>
        </main>
    )
}