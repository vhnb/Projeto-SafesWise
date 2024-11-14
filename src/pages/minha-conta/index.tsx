import { useSession, getSession } from 'next-auth/react';
import { MdEmail } from "react-icons/md";
import styles from './styles.module.css';
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { collection, addDoc, query, onSnapshot, doc, deleteDoc, updateDoc, getDoc, where } from 'firebase/firestore';
import { db } from '@/service/firebaseConnection';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { IoMdClose } from "react-icons/io";
import toast, { Toaster } from 'react-hot-toast';

interface HomeProps {
    user: {
        email: string
    }
}

interface CoursesProps {
    id: string,
    created: string,
    userName: string,
    userMail: string,
    NameCourse: string,
    OwnerCourse: string,
    PriceCourse: string,
    ImageCourse: string,
    CategoryCourse: string
}

interface CoursesUserACquiredProps {
    id: string,
    courseName: string;
    coursePrice: string;
    courseOwner: string;
    courseImage: string;
}

export default function MinhaConta({ user }: HomeProps) {
    const { data: session, status } = useSession()
    const [inputNameCourse, setInputNameCourse] = useState('')
    const [inputPriceCourse, setInputPriceCourse] = useState('')
    const [inputURLImageCourse, setInputURLImageCourse] = useState('')
    const [inputCategoryCourse, setInputCategoryCourse] = useState('Segurança da Informação')
    const [inputEditNameCourse, setInputEditNameCourse] = useState('')
    const [inputEditPriceCourse, setInputEditPriceCourse] = useState('')
    const [inputEditIMGImageCourse, setInputEditIMGImageCourse] = useState('')
    const [inputEditCategoryCourse, setInputEditCategoryCourse] = useState('')
    const [editCourseId, setEditCourseId] = useState<string | null>(null)
    const [courses, setCourses] = useState<CoursesProps[]>([])
    const [loading, setLoading] = useState(true)
    const [isTeacher, setIsTeacher] = useState(false)
    const [isStudent, setIsStudent] = useState(false)
    const [coursesAcquired, setCoursesAcquired] = useState<CoursesUserACquiredProps[]>([])

    useEffect(() => {
        async function checkTeacher() {
            if (session?.user?.email) {
                const userRef = doc(db, 'users', session.user.email)
                const docSnap = await getDoc(userRef)

                if (docSnap.exists() && docSnap.data().role === 'teacher') {
                    setIsTeacher(true)
                } else {
                    setIsTeacher(false)
                }
            }
        }
        checkTeacher()
    }, [session])

    useEffect(() => {
        async function checkStudent() {
            if (session?.user?.email) {
                const userRef = doc(db, 'users', session.user.email)
                const docSnap = await getDoc(userRef)

                if (docSnap.exists() && docSnap.data().role === 'student') {
                    setIsStudent(true)
                } else {
                    setIsStudent(false)
                }
            }
        }
        checkStudent()
    }, [session])

    useEffect(() => {
        async function LoadCourses() {
            const coursesRef = collection(db, 'courses')
            const q = query(coursesRef, where('userMail', '==', user?.email))

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
                        CategoryCourse: doc.data().CategoryCourse,
                        userName: doc.data().userName,
                        userMail: doc.data().userMail
                    })
                })
                setCourses(listCourses)
                setLoading(false)
            })
        }
        LoadCourses()
    }, [user?.email])

    useEffect(() => {
        if (session?.user?.email) {
            loadCoursesUserAcquired()
        }
    }, [session])

    async function loadCoursesUserAcquired() {
        if (!session?.user?.email) return
        try {
            const docSnap = await getDoc(doc(db, 'coursesUserAcquired', session.user.email))
            if (docSnap.exists()) {
                setCoursesAcquired(docSnap.data().items || [])
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function handleRegisterCourse(event: FormEvent) {
        event.preventDefault()

        if (inputNameCourse === '' || inputPriceCourse === '' || inputURLImageCourse === '') {
            return
        }

        try {
            await addDoc(collection(db, 'courses'), {
                NameCourse: inputNameCourse,
                OwnerCourse: session?.user?.name,
                PriceCourse: inputPriceCourse,
                ImageCourse: inputURLImageCourse,
                CategoryCourse: inputCategoryCourse,
                created: new Date(),
                userName: session?.user?.name,
                userMail: session?.user?.email,
            })
            setInputNameCourse('')
            setInputPriceCourse('')
            setInputURLImageCourse('')
            setInputCategoryCourse('Segurança da Informação')
            toast.success('Curso criado com sucesso', {
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

    async function handleDeleteCourse(id: string) {
        const docRef = doc(db, 'courses', id)
        await deleteDoc(docRef)
        toast.success('Curso removido com sucesso', {
            style: {
                borderRadius: '0px',
                backgroundColor: '#111',
                color: '#fff'
            },
        })
    }

    function handleOpenModalEdit(item: CoursesProps) {
        setEditCourseId(item.id)
        setInputEditNameCourse(item.NameCourse)
        setInputEditPriceCourse(item.PriceCourse)
        setInputEditIMGImageCourse(item.ImageCourse)
        setInputEditCategoryCourse(item.CategoryCourse)
    }

    async function handleEditCourse(event: FormEvent) {
        event.preventDefault()

        if (!editCourseId) {
            return
        }

        const docRef = doc(db, 'courses', editCourseId)

        try {
            await updateDoc(docRef, {
                NameCourse: inputEditNameCourse,
                PriceCourse: inputEditPriceCourse,
                ImageCourse: inputEditIMGImageCourse,
                CategoryCourse: inputCategoryCourse
            })

            toast.success('Informações alteradas com sucesso', {
                style: {
                    borderRadius: '0px',
                    backgroundColor: '#111',
                    color: '#fff'
                },
            })
            setEditCourseId(null)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <main className={styles.container}>
                <Head>
                    <title>Perfil - {session?.user?.name}</title>
                </Head>
                <div className={styles.contentMyAccount}>
                    <div className={styles.containerUser}>
                        <img src="/teste.png" alt="Image User" />
                        <div className={styles.containerInfoUser}>
                            <h1>{session?.user?.name} {isTeacher && <span>Professor</span>}{isStudent && <span>Aluno</span>}</h1>
                            <h2><MdEmail style={{ marginRight: '5px', }} />{session?.user?.email}</h2>
                        </div>
                    </div>
                    {loading && (
                        <div className={styles.containerLoading}>
                            <div className="spinner-border text-secondary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                    {isTeacher && (
                        <div className={styles.contentAddCourse}>
                            <h1>Adicione cursos</h1>
                            <form onSubmit={handleRegisterCourse}>
                                <input value={inputNameCourse} onChange={(event: ChangeEvent<HTMLInputElement>) => setInputNameCourse(event.target.value)} type="text" placeholder='Nome do curso' required />
                                <input value={inputPriceCourse} onChange={(event: ChangeEvent<HTMLInputElement>) => setInputPriceCourse(event.target.value)} type="number" placeholder='Preço do curso' required />
                                <input value={inputURLImageCourse} onChange={(event: ChangeEvent<HTMLInputElement>) => setInputURLImageCourse(event.target.value)} type="text" placeholder='URL da imagem do curso' required />
                                <select value={inputCategoryCourse} onChange={((event: ChangeEvent<HTMLSelectElement>) => setInputCategoryCourse(event.target.value))} name='Categorias'>
                                    <option value='Segurança da Informação'>Segurança da Informação</option>
                                    <option value='Segurança de Aplicações Web'>Segurança de Aplicações Web</option>
                                    <option value='Segurança em Redes e Infraestrutura'>Segurança em Redes e Infraestrutura</option>
                                    <option value='Criptografia e Proteção de Dados'>Criptografia e Proteção de Dados</option>
                                    <option value='Monitoramento e Análise de Logs'>Monitoramento e Análise de Logs</option>
                                    <option value='Pentest e Testes de Intrusão'>Pentest e Testes de Intrusão</option>
                                    <option value='Compliance e Normas de Segurança'>Compliance e Normas de Segurança</option>
                                    <option value='Gerenciamento de Incidentes de Segurança'>Gerenciamento de Incidentes de Segurança</option>
                                    <option value='Segurança em Nuvem'>Segurança em Nuvem</option>
                                    <option value='Segurança em Dispositivos Móveis e IoT'>Segurança em Dispositivos Móveis e IoT</option>
                                </select>
                                <button type='submit'>Cadastrar curso</button>
                            </form>
                        </div>
                    )}
                    {isTeacher && (
                        <div className={styles.contentCoursesAdded}>
                            <h1>Cursos adicionados</h1>
                            {courses.length === 0 && (
                                <p>Sem cursos adicionados...</p>
                            )}
                            {courses.map((item) => (
                                <article>
                                    <h2><span>Nome:</span> {item.NameCourse}</h2>
                                    <h2><span>Dono:</span> {item.OwnerCourse}</h2>
                                    <h2><span>Preço:</span> {item.PriceCourse}</h2>
                                    <h2><span>Categoria:</span> {item.CategoryCourse}</h2>
                                    <div className={styles.containerActionsCourses}>
                                        <button onClick={() => handleDeleteCourse(item.id)} className={styles.btnRemove}>Remover</button>
                                        <button onClick={() => handleOpenModalEdit(item)} data-bs-toggle="modal" data-bs-target="#exampleModal" className={styles.btnEdit}>Editar</button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                    {(isStudent || isTeacher) && (
                        <div className={styles.contentCoursesInMyAccount}>
                            <h1>Meus cursos</h1>
                            {coursesAcquired.map((item) => (
                                <article key={item.id} className={styles.containerCourseAcquiredUser}>
                                    <img src={item.courseImage} alt={item.courseName} />
                                    <div className={styles.infoCourseAcquiredUser}>
                                        <h1>{item.courseName}</h1>
                                        <h2>Feito por: {item.courseOwner}</h2>
                                    </div>
                                </article>
                            ))}
                            {coursesAcquired.length === 0 && (
                                <p>Sem cursos...</p>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <div className={`${styles.containerModal} ${"modal fade"}`} id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className={`${styles.dialogModal} ${"modal-dialog modal-dialog-centered"}`}>
                    <div className={`${styles.contentModal} ${"modal-content"}`}>
                        <div className={`${styles.modalHeader} ${"modal-header"}`}>
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Editar curso</h1>
                            <button data-bs-dismiss="modal"><IoMdClose /></button>
                        </div>
                        <div className={`${styles.modalBody} ${"modal-body"}`}>
                            <form onSubmit={handleEditCourse}>
                                <input value={inputEditNameCourse} onChange={(event: ChangeEvent<HTMLInputElement>) => setInputEditNameCourse(event.target.value)} type="text" placeholder='Nome do curso' required />
                                <input value={inputEditPriceCourse} onChange={(event: ChangeEvent<HTMLInputElement>) => setInputEditPriceCourse(event.target.value)} type="text" placeholder='Preço do curso' required />
                                <input value={inputEditIMGImageCourse} onChange={(event: ChangeEvent<HTMLInputElement>) => setInputEditIMGImageCourse(event.target.value)} type="text" placeholder='URL da imagem do curso' required />
                                <select value={inputEditCategoryCourse} onChange={((event: ChangeEvent<HTMLSelectElement>) => setInputEditCategoryCourse(event.target.value))} name='Categorias'>
                                    <option value='Segurança da Informação'>Segurança da Informação</option>
                                    <option value='Segurança de Aplicações Web'>Segurança de Aplicações Web</option>
                                    <option value='Segurança em Redes e Infraestrutura'>Segurança em Redes e Infraestrutura</option>
                                    <option value='Criptografia e Proteção de Dados'>Criptografia e Proteção de Dados</option>
                                    <option value='Monitoramento e Análise de Logs'>Monitoramento e Análise de Logs</option>
                                    <option value='Pentest e Testes de Intrusão'>Pentest e Testes de Intrusão</option>
                                    <option value='Compliance e Normas de Segurança'>Compliance e Normas de Segurança</option>
                                    <option value='Gerenciamento de Incidentes de Segurança'>Gerenciamento de Incidentes de Segurança</option>
                                    <option value='Segurança em Nuvem'>Segurança em Nuvem</option>
                                    <option value='Segurança em Dispositivos Móveis e IoT'>Segurança em Dispositivos Móveis e IoT</option>
                                </select>
                                <button data-bs-dismiss="modal" type='submit'>Editar curso</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req })

    if (!session?.user) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            user: {
                email: session?.user?.email
            }
        }
    }
}