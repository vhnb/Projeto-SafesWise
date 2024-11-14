import styles from './styles.module.css'
import { useRouter } from 'next/router'
import { FormEvent } from 'react';
import { FaEnvelope } from "react-icons/fa";
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/service/firebaseConnection';

interface MessageProps {
    created: string,
    message: string
}

export default function Footer() {
    const [inputMessage, setInputMessage] = useState('')
    const router = useRouter()

    function handletoHome() {
        router.push('/')
    }

    async function handleSendMessage(event: FormEvent) {
        event.preventDefault()

        if (inputMessage === '') {
            toast('Preencha os campos', {
                style: {
                    borderRadius: '0px',
                    backgroundColor: '#111',
                    color: '#fff'
                },
            })
            return
        }

        try {
            await addDoc(collection(db, 'messages'), {
                created: new Date(),
                message: inputMessage
            })
            setInputMessage('')
            toast.success('Mensagem enviada', {
                style: {
                    borderRadius: '0px',
                    backgroundColor: '#111',
                    color: '#fff'
                },
            })
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <footer className={styles.footer}>
                <div className={styles.contentFooter}>
                    <div className={styles.contentInfoAboutSafesWise}>
                        <h1 onClick={handletoHome}>Safes<span>Wise</span></h1>
                        <p>© 2024 SafesWise, Inc.</p>
                    </div>
                    <form onSubmit={handleSendMessage}>
                        <input value={inputMessage} onChange={(event) => setInputMessage(event.target.value)} type="text" placeholder='Nos envie uma mensagem...' />
                        <button type='submit'><FaEnvelope /></button>
                    </form>
                </div>
            </footer>
            <Toaster />
        </>
    )
}