import styles from './styles.module.css'
import { collection, addDoc, query, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from "react";
import { db } from "@/service/firebaseConnection";
import CardProduct from '@/components/CardProduct';
import Head from 'next/head';

interface CoursesProps {
    id: string,
    created: string,
    userName: string,
    userMail: string,
    NameCourse: string,
    OwnerCourse: string,
    PriceCourse: string,
    ImageCourse: string
}

export default function Cursos() {
    const [courses, setCourses] = useState<CoursesProps[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function LoadCourses() {
            const coursesRef = collection(db, 'courses')
            const q = query(coursesRef)

            onSnapshot(q, (snapshot) => {
                let listCourses = [] as CoursesProps[]

                snapshot.forEach((doc) => {
                    listCourses.push({
                        id: doc.id,
                        created: doc.data().created,
                        NameCourse: doc.data().NameCourse,
                        OwnerCourse: doc.data().OwnerCourse,
                        PriceCourse: doc.data().PriceCourse,
                        ImageCourse: doc.data().ImageCourse,
                        userName: doc.data().userName,
                        userMail: doc.data().userMail
                    })
                })
                setLoading(false)
                setCourses(listCourses)
            })
        }
        LoadCourses()
    }, [])

    return (
        <main className={styles.container}>
            <Head>
                <title>Cursos SafesWise</title>
            </Head>
            <div className={styles.contentHome}>
                <h1>Todo o conhecimento em proteção na web que você precisa, em um só lugar.</h1>
                <p>Confira todos os nossos cursos.</p>
            </div>
            <div className={styles.contentCourses}>
                <div className={styles.contentSizeCourses}>
                    <div className={styles.contentProductsCourses}>
                        {loading && (
                            <div className={styles.containerLoading}>
                                <div className="spinner-border text-secondary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        )}
                        {courses.map((item) => (
                            <CardProduct
                                courseImage={item.ImageCourse}
                                courseName={item.NameCourse}
                                courseOwner={item.OwnerCourse}
                                coursePrice={item.PriceCourse}
                                id={item.id}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}