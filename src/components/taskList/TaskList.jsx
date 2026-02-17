import React from 'react'
import styles from './TaskList.module.css'
import TaskItem from '../taskItem/TaskItem'

const TaskList = ({ groupedTasks, incompleteTasks, editTask, deleteTask }) => {
  const periodLabels = {
    overdue: { label: '⚠️ En retard', emoji: '🔴' },
    today: { label: "📅 Aujourd'hui", emoji: '🔵' },
    tomorrow: { label: '📅 Demain', emoji: '🟣' },
    this_week: { label: 'Cette semaine', emoji: '🟢' },
    this_month: { label: 'Ce mois-ci', emoji: '🟡' },
    later: { label: 'Plus tard', emoji: '⚪' },
  };

  const hasAnyTasks = groupedTasks && Object.values(groupedTasks).some(group => group.length > 0);

  if (!hasAnyTasks) {
    return (
      <div className='box'>
        <h2 className={styles.title}>Aucune tâche pour le moment, ajoute une tâche pour commencer !</h2>
      </div>
    );
  }

  return (
    <div className='box'>
      {incompleteTasks > 0 && (
        <h2 className={styles.title}>
          Il te reste encore <strong>{incompleteTasks}</strong> tâches à faire
        </h2>
      )}
      {incompleteTasks === 0 && (
        <h2 className={styles.title}>
          ✨ Félicitations, tu as terminé toutes tes tâches !
        </h2>
      )}

      {Object.entries(groupedTasks).map(([period, tasks]) =>
        tasks.length > 0 && (
          <div key={period} className={styles.periodGroup}>
            <h3 className={styles.periodTitle}>
              {periodLabels[period].emoji} {periodLabels[period].label}
              <span className={styles.periodCount}>{tasks.length}</span>
            </h3>
            <ul className={styles.container}>
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  editTask={editTask}
                  deleteTask={deleteTask}
                />
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
};

export default TaskList;