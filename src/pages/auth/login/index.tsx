import styles from './styles.module.css'
import Head from 'next/head'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import toast, { Toaster } from 'react-hot-toast';

export default function Login(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    async function handleLoginUser(event: FormEvent){
        event.preventDefault()

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password
        })

        if(!result?.error) {
            toast.success('Sucesso ao entrar', {
                style: {
                    borderRadius: '0px',
                    backgroundColor: '#111',
                    color: '#fff'
                },
            })
            router.push('/minha-conta')
        } else {
            toast.error('Senha ou e-mail incorreto', {
                style: {
                    borderRadius: '0px',
                    backgroundColor: '#111',
                    color: '#fff'
                },
            })
            console.error(result.error)
        }
    }

    return(
        <main className={styles.container}>
            <Head>
                <title>Entre em sua conta</title>
            </Head>
            <div className={styles.contentHome}>
            <img src="/image.png" alt="Image" />
                <form onSubmit={handleLoginUser}>
                    <h1>Faça login para continuar sua jornada</h1>
                    <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder='E-mail'/>
                    <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder='Senha'/>
                    <button type='submit'>Entrar</button>
                </form>
            </div>
        </main>
    )
}