import React from 'react'
import styles from './Modal.module.css'

const Modal = ({ isOpen, title, message, confirmText = 'Confirmer', cancelText = 'Annuler', onConfirm, onCancel, isDanger = false }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.message}>{message}</p>
          
          <div className={styles.buttons}>
            <button 
              className={styles.cancelBtn}
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button 
              className={isDanger ? styles.confirmBtnDanger : styles.confirmBtn}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
