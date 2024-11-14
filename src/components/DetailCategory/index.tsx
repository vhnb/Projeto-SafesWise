import styles from './styles.module.css'

interface DetailCategoryProps {
    nameCategory: string,
    courses: string[],
}

export default function DetailCategory({nameCategory, courses}: DetailCategoryProps) {
    return (
        <details className={styles.detailsCategory}>
            <summary>{nameCategory}</summary>
            <ul>
                {courses.map((course, index) => (
                    <li key={index}>
                        <a href={`/curso/${course}`}>{course}</a>
                    </li>
                ))}
            </ul>
        </details>
    )
}