import { signIn, signOut, useSession } from "next-auth/react";
import { FaCartShopping, FaMagnifyingGlass } from "react-icons/fa6";
import { FiMenu } from "react-icons/fi";
import { IoMdClose, IoIosArrowDown } from "react-icons/io";
import styles from './styles.module.css';
import { FormEvent, useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConnection";
import { useRouter } from "next/router";
import DetailCategory from "../DetailCategory";
import toast, { Toaster } from 'react-hot-toast';
import { IoChatboxEllipsesSharp } from "react-icons/io5";
import Chat from "../Chat";

interface CartItem {
    id: string,
    courseName: string;
    coursePrice: string;
    courseOwner: string;
    courseImage: string;
}

export default function Header() {
    const { data: session, status } = useSession()
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (session?.user?.email) {
            loadCartItems()
        }
    }, [session])

    async function loadCartItems() {
        if (!session?.user?.email) return
        try {
            const docSnap = await getDoc(doc(db, 'carts', session.user.email))
            if (docSnap.exists()) {
                setCartItems(docSnap.data().items || [])
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function handleDeleteFromCart(id: string) {
        if (!session?.user?.email) return

        try {
            const updateCartItems = cartItems.filter(item => item.id != id)
            await updateDoc(doc(db, 'carts', session.user.email), { items: updateCartItems })
            setCartItems(updateCartItems)
            toast.success('Item removido com sucesso', {
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

    function handletoHome() {
        router.push('/')
    }

    function handleToLoginPage() {
        router.push('/auth/login')
    }

    function handleSearch(event: FormEvent) {
        event.preventDefault()
        if (searchTerm.trim() !== '') {
            router.push(`/searchResult?term=${searchTerm}`)
        }
    }

    async function handleCheckout() {
        if (!session?.user?.email) return

        try {
            const docSnap = await getDoc(doc(db, 'carts', session.user.email))
            const cartItems = docSnap.exists() ? docSnap.data().items : []

            if (cartItems.length === 0) {
                toast('Seu carrinho esta vazio', {
                    style: {
                        borderRadius: '0px',
                        backgroundColor: '#111',
                        color: '#fff'
                    },
                })
                return
            }

            const acquiredSnap = await getDoc(doc(db, 'coursesUserAcquired', session.user.email))
            const acquiredItems = acquiredSnap.exists() ? acquiredSnap.data().items : []

            const uniqueNewItems = cartItems.filter((item: CartItem) => !acquiredItems.some((acquired: CartItem) => acquired.id === item.id))

            if (uniqueNewItems.length === 0) {
                toast('Você já possui os produtos do carrinho.', {
                    style: {
                        borderRadius: '0px',
                        backgroundColor: '#111',
                        color: '#fff'
                    },
                })
                return
            }

            await setDoc(doc(db, 'coursesUserAcquired', session.user.email), { items: [...acquiredItems, ...uniqueNewItems] }, { merge: true })

            await setDoc(doc(db, 'carts', session.user.email), { items: [] })

            setCartItems([])

            toast.success('Compra concluída com sucesso', {
                style: {
                    borderRadius: '0px',
                    backgroundColor: '#111',
                    color: '#fff'
                },
            })
            router.push('/minha-conta')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <header className={styles.header}>
                <div className={styles.contentHeader}>
                    <h1 onClick={handletoHome}>Safes<span>Wise</span></h1>
                    <form onSubmit={handleSearch}>
                        <div className={styles.contentInputHeader}>
                            <FaMagnifyingGlass color="#00000090" style={{ marginLeft: '8px', marginRight: '10px', }} />
                            <input
                                type="text"
                                placeholder='Pesquise por cursos...'
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                            />
                        </div>
                    </form>
                    <nav>
                        <a data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop" href="">Categorias</a>
                        <a href="/cursos">Cursos</a>
                        <a href="/sobre">Sobre</a>
                    </nav>
                    <div className={styles.line}></div>
                    <div className={styles.contentActionsHeader}>
                        {status === 'loading' ? (
                            <button>
                                <div className={styles.containerLoading}>
                                    <div className="spinner-border spinner-border-sm" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </button>
                        ) : session ? (
                            <div className={`${styles.containerMenu} ${"dropdown"}`}>
                                <button className={styles.btnHeader} data-bs-toggle="dropdown">{session?.user?.name} <IoIosArrowDown size={15} style={{ marginLeft: '5px', }} /></button>
                                <ul className={`${styles.contentMenu} ${"dropdown-menu dropdown-menu-end"}`}>
                                    <li><a className="dropdown-item" href="/minha-conta">Minha conta</a></li>
                                    <li><a onClick={() => signOut()} className={`${styles.btnLogout} ${"dropdown-item"}`}>Sair</a></li>
                                </ul>
                            </div>
                        ) : (
                            <>
                                <div className={`${styles.containerMenu} ${"dropdown"}`}>
                                    <button className={styles.btnHeader} data-bs-toggle="dropdown">Cadastre-se</button>
                                    <ul className={`${styles.contentMenu} ${"dropdown-menu dropdown-menu-end"}`}>
                                        <li><a href="/auth/register-teacher" className="dropdown-item">Cadastre-se como professor</a></li>
                                        <li><a href="/auth/register-student" className="dropdown-item">Cadastre-se como aluno</a></li>
                                    </ul>
                                </div>
                                <button className={styles.btnLogin} onClick={handleToLoginPage}>Fazer login</button>
                            </>
                        )}
                        {cartItems.length === 0 ? (
                            <button className={`${"position-relative"} ${styles.functionCartUser}`} data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight"><FaCartShopping /></button>
                        ) : (
                            <button className="position-relative" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight"><FaCartShopping />
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {cartItems.length}
                                </span>
                            </button>
                        )}
                        <button data-bs-toggle="modal" data-bs-target="#exampleModal" ><IoChatboxEllipsesSharp /></button>
                        <button data-bs-toggle="offcanvas" data-bs-target="#offcanvasLeft" className={styles.iconMenu}><FiMenu /></button>
                    </div>
                </div>
            </header>
            <div className={`${styles.containerAsideMenu} ${"offcanvas offcanvas-end"}`} tabIndex={-1} id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                <div className={`${styles.menuHeader} ${"offcanvas-header"}`}>
                    <h5 className="offcanvas-title" id="offcanvasRightLabel">Seu carrinho</h5>
                    <button data-bs-dismiss="offcanvas"><IoMdClose /></button>
                </div>
                <div className={`${styles.menuBody} ${"offcanvas-body"}`}>
                    {cartItems.length === 0 && (
                        <p>Seu carrinho esta vazio...</p>
                    )}
                    {cartItems.map((item) => (
                        <article className={styles.containerItemsCartUser}>
                            <img key={item.id} src={item.courseImage} alt={item.courseName} />
                            <div className={styles.contentInfoItemCart}>
                                <h1>{item.courseName}</h1>
                                <h2>Feito por: {item.courseOwner}</h2>
                                <p>R${item.coursePrice}</p>
                                <button onClick={() => handleDeleteFromCart(item.id)}>Remover</button>
                            </div>
                        </article>
                    ))}
                    {cartItems.length > 0 && (
                        <button className={styles.btnConfirmCart} onClick={handleCheckout}>Confirmar pedido</button>
                    )}
                </div>

            </div>
            <div className={`${styles.containerAsideMenu} ${"offcanvas offcanvas-top"}`} tabIndex={-1} id="offcanvasTop" aria-labelledby="offcanvasTopLabel">
                <div className={`${styles.menuHeader} ${"offcanvas-header"}`}>
                    <h5 className="offcanvas-title" id="offcanvasTopLabel">Categorias de cursos</h5>
                    <button data-bs-dismiss="offcanvas"><IoMdClose /></button>
                </div>
                <div className={`${styles.menuBodyCategory} ${"offcanvas-body"}`}>
                    <DetailCategory
                        nameCategory="Segurança da Informação"
                        courses={['Curso de Gestão de Riscos e Governança em Segurança da Informação', 'Curso de Conformidade e Privacidade de Dados (LGPD, GDPR, etc.)']}
                    />
                    <DetailCategory
                        nameCategory="Segurança de Aplicações Web"
                        courses={['Curso de Hardening e Proteção de Aplicações Web', 'Curso Avançado de OWASP e Segurança em API RESTful']}
                    />
                    <DetailCategory
                        nameCategory="Segurança em Redes e Infraestrutura"
                        courses={['Curso de Arquitetura Segura de Redes e Firewalls', 'Curso de Redes Privadas Virtuais (VPNs) e Segurança em WANs']}
                    />
                    <DetailCategory
                        nameCategory="Criptografia e Proteção de Dados"
                        courses={['Curso Prático de Criptografia Simétrica e Assimétrica', 'Curso de Criptografia em Blockchain e Tecnologias Distribuídas']}
                    />
                    <DetailCategory
                        nameCategory="Monitoramento e Análise de Logs"
                        courses={['Curso de Implementação de SIEM (Security Information and Event Management)', 'Curso de Forense Digital e Análise de Logs em Incidentes de Segurança']}
                    />
                    <DetailCategory
                        nameCategory="Pentest e Testes de Intrusão"
                        courses={['Curso de Pentest em Aplicações Web', 'Curso de Pentest em Infraestruturas de Redes e Sistemas']}
                    />
                    <DetailCategory
                        nameCategory="Compliance e Normas de Segurança"
                        courses={['Curso de Implementação da ISO/IEC 27001: Sistema de Gestão de Segurança da Informação', 'Curso de Auditoria de Segurança e Conformidade em TI']}
                    />
                    <DetailCategory
                        nameCategory="Gerenciamento de Incidentes de Segurança"
                        courses={['Curso de Resposta a Incidentes de Segurança e Gestão de Crises', 'Curso de Análise de Malware e Mitigação de Riscos de Incidentes']}
                    />
                    <DetailCategory
                        nameCategory="Segurança em Nuvem"
                        courses={['Curso de Segurança em Infraestruturas de Nuvem (AWS, Azure, GCP)', 'Curso de Arquitetura Segura em Nuvem e DevSecOps']}
                    />
                    <DetailCategory
                        nameCategory="Segurança em Dispositivos Móveis e IoT"
                        courses={['Curso de Segurança em Aplicações para Dispositivos Móveis', 'Curso de Segurança em Internet das Coisas (IoT) e Dispositivos Conectados']}
                    />
                </div>
            </div>
            <div className={`${styles.containerAsideMenu} ${"offcanvas offcanvas-start"}`} tabIndex={-1} id="offcanvasLeft" aria-labelledby="offcanvasRightLabel">
                <div className={`${styles.menuHeader} ${"offcanvas-header"}`}>
                    <h5 className="offcanvas-title" id="offcanvasRightLabel">Opções</h5>
                    <button data-bs-dismiss="offcanvas"><IoMdClose /></button>
                </div>
                <div className={`${styles.menuBodyMobile} ${"offcanvas-body"}`}>
                    <form onSubmit={handleSearch}>
                        <div className={styles.containerSearchInputMobile}>
                            <FaMagnifyingGlass size={20} color="#00000090" style={{ marginLeft: '5px', marginRight: '12px', }} />
                            <input
                                type="text"
                                placeholder='Pesquise por cursos...'
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                            />
                        </div>
                    </form>
                    <a href="/" className={styles.optionMenuMobile}>Início</a>
                    <a className={styles.optionMenuMobile} data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop" href="">Categorias</a>
                    <a href="/cursos" className={styles.optionMenuMobile}>Cursos</a>
                    <a href="/sobre" className={styles.optionMenuMobile}>Sobre</a>
                    {status === 'loading' ? (
                        <></>
                    ) : session ? (
                        <div className={`${styles.containerMenuMobile} ${"dropdown"}`}>
                            <button data-bs-toggle="dropdown">{session?.user?.name}</button>
                            <ul className={`${styles.contentMenuMobile} ${"dropdown-menu dropdown-menu-end"}`}>
                                <li><a className="dropdown-item" href="/minha-conta">Minha conta</a></li>
                                <li><a onClick={() => signOut()} className={`${styles.btnLogout} ${"dropdown-item"}`}>Sair</a></li>
                            </ul>
                        </div>
                    ) : (
                        <>
                            <div className={`${styles.containerMenuMobile} ${"dropdown"}`}>
                                <button data-bs-toggle="dropdown">Cadastre-se</button>
                                <ul className={`${styles.contentMenuMobile} ${"dropdown-menu dropdown-menu-end"}`}>
                                    <li><a href="/auth/register-teacher" className="dropdown-item">Cadastre-se como professor</a></li>
                                    <li><a href="/auth/register-student" className="dropdown-item">Cadastre-se como aluno</a></li>
                                </ul>
                            </div>
                            <a href="/auth/login" className={styles.optionMenuMobile}>Fazer login</a>
                        </>
                    )}
                </div>
            </div>
            <div className={`${styles.containerModal} ${"modal fade"}`} id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className={`${styles.dialogModal} ${"modal-dialog modal-dialog-centered"}`}>
                    <div className={`${styles.contentModal} ${"modal-content"}`}>
                        <div className={`${styles.modalHeader} ${"modal-header"}`}>
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Chat BOT</h1>
                            <button data-bs-dismiss="modal"><IoMdClose /></button>
                        </div>
                        <div className={`${styles.modalBody} ${"modal-body"}`}>
                            <Chat/>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </>
    )
}