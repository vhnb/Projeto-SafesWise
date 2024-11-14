import CardProduct from "@/components/CardProduct";
import styles from "@/styles/Home.module.css";
import { collection, addDoc, query, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from "react";
import { db } from "@/service/firebaseConnection";
import Head from "next/head";
import Chat from "@/components/Chat";

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

export default function Home() {
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
        <title>SafesWise - Todo o conhecimento em proteção na web</title>
      </Head>
      <div className={styles.contentHome}>
        <div className={styles.contentSizeHome}>
          <div className={styles.contentHomeInfos}>
            <h1>Domine a <span>Segurança</span></h1>
            <p>Bem-vindo ao nosso portal de aprendizado em segurança! Aqui, você encontra uma seleção de cursos abrangentes que capacitam profissionais e entusiastas a dominar as melhores práticas em métodos de segurança.</p>
            <a href="/cursos">Veja nossos cursos</a>
          </div>
          <img src="escudo.png" alt="Image Camera" />
        </div>
      </div>
      <div className={styles.contentMostView}>
        <div className={styles.contentSizeMostView}>
          <h1>Nossos cursos mais vistos</h1>
          <div className={styles.contentProductsMostView}>
            {loading && (
              <div className={styles.containerLoading}>
                <div className="spinner-border text-secondary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            {courses.slice(0, 8).map((item) => (
              <CardProduct
                key={item.id}
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
  );
}
