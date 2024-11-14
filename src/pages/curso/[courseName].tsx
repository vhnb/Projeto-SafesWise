import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { db } from '@/service/firebaseConnection'
import { collection, query, where, getDocs } from 'firebase/firestore'
import Head from 'next/head'
import styles from './styles.module.css'
import { TbSquareArrowLeftFilled } from "react-icons/tb";
import { useSession } from 'next-auth/react'

interface CourseData {
    id: string,
    NameCourse: string
    PriceCourse: string
    OwnerCourse: string
    ImageCourse: string
    CategoryCourse: string
}

export default function CursoDetail() {
    const [course, setCourse] = useState<CourseData | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { courseName } = router.query

    useEffect(() => {
        async function fetchCourseData() {
            if (!courseName) return

            try {
                const docRef = collection(db, 'courses')
                const q = query(docRef, where('NameCourse', '==', String(courseName)))
                const docSnap = await getDocs(q)

                if (!docSnap.empty) {
                    const docData = docSnap.docs[0].data() as CourseData
                    setCourse(docData)
                } else {
                    console.error("Curso não encontrado.")
                    setCourse(null)
                }
            } catch (error) {
                console.error("Erro ao buscar dados do curso:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchCourseData()
    }, [courseName])

    if (loading) {
        return (
            <div className={styles.containerLoading}>
                <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    if (!course) {
        return <p>Curso não encontrado.</p>
    }

    function handleToHome(){
        router.push('/')
    }

    return (
        <>
            <main className={styles.container}>
                <Head>
                    <title>{courseName}</title>
                </Head>
                <div className={styles.contentHome}>
                    <div className={styles.containerCourse}>
                        <img src={course.ImageCourse} alt={course.NameCourse} />
                        <div className={styles.infoDetailCourse}>
                            <button className={styles.btnToHome} onClick={() => router.back()}><TbSquareArrowLeftFilled size={25} style={{ marginRight: '10px', }} />Voltar</button>
                            <h1>{course.NameCourse}</h1>
                            <h2>Feito por: {course.OwnerCourse}</h2>
                            <p>Categoria: {course.CategoryCourse}</p>
                            <h3>R${course.PriceCourse}</h3>
                            <button onClick={handleToHome} className={styles.btnAddToCart}>Voltar</button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}