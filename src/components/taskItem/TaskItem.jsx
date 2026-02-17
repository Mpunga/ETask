import React from 'react'
import styles from './TaskItem.module.css'

const TaskItem = ({ task, editTask, deleteTask }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffMinutes = Math.round(diffMs / 60000);
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m`;
    }
    
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const duration = task.completed && task.createdAt && task.completedAt
    ? calculateDuration(task.createdAt, task.completedAt)
    : null;

  return (
    <li className={`${styles.container} ${task?.completed ? styles.success : styles.default}`}
      onClick={() => editTask(task.id, !task.completed)}
    >
      <div className={styles.item}>
        <div className={`${styles.id} ${task?.completed ? styles.idSuccess : styles.idDefault}`}>
          {task.id}
        </div>
        <div className={styles.contentWrapper}>
          <div className={task?.completed ? styles.contentSuccess : styles.contentDefault}>
            {task.title}
          </div>
          <div className={styles.metaInfo}>
            {task.dueDate && (
              <span className={styles.dateDisplay}>
                📅 {formatDate(task.dueDate)}
              </span>
            )}
            {task.createdAt && (
              <span className={styles.timeDisplay}>
                🕐 {formatTime(task.createdAt)}
              </span>
            )}
          </div>
          {duration && (
            <div className={styles.durationBadge}>
              ✅ Durée: <strong>{duration}</strong>
            </div>
          )}
        </div>
      </div>
      <button className='button-primary' onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.deleteIcon}>
          <path fillRule="evenodd" clipRule="evenodd" d="M16.5 1.5H19.5C20.6046 1.5 21.5 2.39543 21.5 3.5V4.5H2.5V3.5C2.5 2.39543 3.39543 1.5 4.5 1.5H7.5C7.5 0.947715 7.94772 0.5 8.5 0.5H15.5C16.0523 0.5 16.5 0.947715 16.5 1.5ZM19 4.5H5V20.5C5 21.6046 5.89543 22.5 7 22.5H17C18.1046 22.5 19 21.6046 19 20.5V4.5ZM9 7.5C9.55228 7.5 10 7.94772 10 8.5V18.5C10 19.0523 9.55228 19.5 9 19.5C8.44772 19.5 8 19.0523 8 18.5V8.5C8 7.94772 8.44772 7.5 9 7.5ZM15 7.5C15.5523 7.5 16 7.94772 16 8.5V18.5C16 19.0523 15.5523 19.5 15 19.5C14.4477 19.5 14 19.0523 14 18.5V8.5C14 7.94772 14.4477 7.5 15 7.5Z"/>
        </svg>
      </button>
    </li>
  );
};

export default TaskItem;