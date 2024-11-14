import styles from './styles.module.css'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db } from '@/service/firebaseConnection'
import { collection, query, where, getDocs } from 'firebase/firestore'
import CardProduct from '@/components/CardProduct'

interface CourseSought {
    id: string,
    NameCourse: string,
    OwnerCourse: string,
    PriceCourse: string,
    ImageCourse: string
}

export default function SearchResult() {
    const router = useRouter()
    const { term } = router.query
    const [courses, setCourses] = useState<CourseSought[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (term) {
            searchCourses(term as string)
        }
    }, [term])

    async function searchCourses(term: string) {
        try {
            setLoading(true)
            const docRef = collection(db, 'courses')
            const docSnap = await getDocs(docRef)

            const allCourses: CourseSought[] = []
            docSnap.forEach((doc) => {
                allCourses.push({ id: doc.id, ...doc.data() } as CourseSought)
            })

            const filteredCourses = allCourses.filter(course =>
                course.NameCourse.toLocaleLowerCase().includes(term.toLocaleLowerCase()))

            setCourses(filteredCourses)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className={styles.container}>
            <div className={styles.contentHome}>
                <h1>Resultado da pesquisa <span>"{term}"</span></h1>
                {loading && (
                    <div className={styles.containerLoading}>
                        <div className="spinner-border text-secondary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
                <div className={styles.contentSearchCourses}>
                    {courses.length > 0 ? (
                        courses.map((item) => (
                            <CardProduct
                                key={item.id}
                                courseImage={item.ImageCourse}
                                courseName={item.NameCourse}
                                courseOwner={item.OwnerCourse}
                                coursePrice={item.PriceCourse}
                                id={item.id}
                            />
                        ))
                    ) : (
                        !loading && <p>Nenhum curso encontrado com a pesquisa <span>"{term}"</span></p>
                    )}
                </div>
            </div>
        </main>
    )
}