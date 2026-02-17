import React from 'react'
import styles from './Header.module.css'
import reactLogo from '../../assets/react.svg'
import { FiZap, FiTag } from 'react-icons/fi'

const Header = () => {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <img src={reactLogo} alt="logo" width={50} height={50}/>
        <div>
          <h1 className={styles.title}>
            <FiZap size={20} aria-hidden="true" />
            E-Task
          </h1>
          <div className='color-gray'>
            <code>"Maîtrisez vos tâches, libérez votre esprit" 🧠</code>
          </div>
        </div>
      </div>
      <code className="color-primary">
        <FiTag size={14} aria-hidden="true" />
        V.1.0
      </code>
    </div>
  )
}

export default Header