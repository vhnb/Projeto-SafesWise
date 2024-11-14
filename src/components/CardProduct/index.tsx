import { useSession } from 'next-auth/react'
import styles from './styles.module.css'
import { db } from '@/service/firebaseConnection'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import toast, { Toaster } from 'react-hot-toast';

interface ProductCardProps {
    id: string,
    courseName: string,
    coursePrice: string,
    courseOwner: string,
    courseImage: string
}

export default function CardProduct({ courseName, coursePrice, courseOwner, courseImage, id }: ProductCardProps) {
    const {data: session} = useSession()
    const router = useRouter()

    async function handleAddToCart(){
        if(!session?.user?.email) {
            return
        }

        try {
            const docSnap = await getDoc(doc(db, 'carts', session.user.email))
            let cartItems = []

            if(docSnap.exists()) {
                cartItems = docSnap.data().items || []
            }

            const product = {
                id,
                courseName,
                coursePrice,
                courseOwner,
                courseImage
            }

            const updateCart = [...cartItems, product]
            await setDoc(doc(db, 'carts', session.user.email), {items: updateCart})
            toast.success('Item adicionado com sucesso', {
                style: {
                    borderRadius: '0px',
                    backgroundColor: '#111',
                    color: '#fff'
                },
            })
            window.location.reload()
        } catch (error) {
            console.error(error)
        }
    }

    function handleCardClick() {
        router.push(`/curso/${encodeURIComponent(courseName)}`)
    }

    return (
        <article onClick={handleCardClick} data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Tooltip on left" className={styles.cardProduct}>
            <img src={courseImage} alt={courseName} />
            <h2>{courseName}</h2>
            <h3>Feito por: {courseOwner}</h3>
            <p>R${coursePrice}</p>
            <button onClick={handleAddToCart}>Adicionar ao carrinho</button>
        </article>
    )
}