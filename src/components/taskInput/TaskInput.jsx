import React, { useState } from 'react'
import styles from './TaskInput.module.css'
import { FiPlusCircle, FiEdit2, FiClipboard, FiCalendar } from 'react-icons/fi'

const TaskInput = ({ addTask }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDate, setTaskDate] = useState("");

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleInputChange = (e) => {
    setTaskTitle(e.target.value);
  };

  const handleDateChange = (e) => {
    setTaskDate(e.target.value);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      addTask(taskTitle, taskDate || getTodayDate());
      setTaskTitle("");
      setTaskDate("");
    } else {
      console.log("Veuillez entrer un titre de tâche valide.");
    }
  };

  return (
    <div className={`box ${styles.element}`}>
      <h2 className={styles.title}>
        <FiClipboard size={18} aria-hidden="true" />
        Ajouter une tâche
      </h2>
      <form className={styles.container} onSubmit={handleAddTask}>
        <div className={styles.inputGroup}>
          <FiEdit2 size={16} className={styles.inputIcon} aria-hidden="true" />
          <input
            type="text"
            placeholder="Indiquez un titre de tâche explicite"
            className={styles.input}
            onChange={handleInputChange}
            value={taskTitle}
          />
        </div>
        <div className={styles.inputGroup}>
          <FiCalendar size={16} className={styles.inputIcon} aria-hidden="true" />
          <input
            type="date"
            className={styles.input}
            onChange={handleDateChange}
            value={taskDate}
          />
        </div>
        <button className="button-primary" type="submit">
          <FiPlusCircle size={16} aria-hidden="true" />
          Ajouter
        </button>
      </form>
    </div>
  );
};

export default TaskInput;