import styles from './styles.module.css'

interface MembersProps {
    name: string,
    image: string,
    desc: string
}

export default function CardMember({name, image, desc}: MembersProps) {
    return (
        <div className={styles.containerMemberSW}>
            <img src={image} alt={name} />
            <div className={styles.contentInfoMember}>
                <h1>{name}</h1>
                <p>{desc}</p>
            </div>
        </div>
    )
}