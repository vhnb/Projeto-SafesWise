import styles from './styles.module.css'
import Head from 'next/head'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/service/firebaseConnection'
import { doc, setDoc } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
import toast, { Toaster } from 'react-hot-toast';

export default function RegisterStudent() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    async function handleRegisterStudent(event: FormEvent) {
        event.preventDefault()

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            await updateProfile(user, {
                displayName: username
            })

            if (user.email) {
                await setDoc(doc(db, 'users', user.email), {
                    email: user.email,
                    role: 'student',
                    username: username
                })
                toast.success('Conta criada com sucesso', {
                    style: {
                        borderRadius: '0px',
                        backgroundColor: '#111',
                        color: '#fff'
                    },
                })
                router.push('/auth/login')
            } else {
                throw new Error('E-mail do usuário é inválido.')
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <main className={styles.container}>
                <Head>
                    <title>Registre-se como aluno</title>
                </Head>
                <div className={styles.contentHome}>
                    <img src="/image.png" alt="Image" />
                    <form onSubmit={handleRegisterStudent}>
                        <h1>Cadastre-se e comece a aprender</h1>
                        <input value={username} onChange={(event) => setUsername(event.target.value)} type="text" placeholder='Nome completo' />
                        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder='E-mail' />
                        <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder='Senha' />
                        <button type='submit'>Cadastre-se</button>
                        <p>Já possui uma conta? <a href='/auth/login'>Entrar</a></p>
                    </form>
                </div>
            </main>
            <Toaster />
        </>
    )
}