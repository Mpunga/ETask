import styles from './Footer.module.css'  

const Footer = ({ completedTasks }) => {
  if(completedTasks) {  
  return (
    <footer>
    <code className={styles.footer} >
        Avec E-Task tu as éliminé {completedTasks} tâches
        {completedTasks > 1 ? "s" : ""} de ta liste, continue comme ça !
        </code>
    </footer>
  );
}
return null
};
export default Footer