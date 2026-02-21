import React, { useState, useEffect } from 'react'
import Header from './header/Header'
import TaskInput from './taskInput/TaskInput'
import TaskList from './taskList/TaskList'
import Footer from './footer/footer'
import Modal from './modal/Modal'
import storageService from '../services/storageService'

const TaskContainer = () => {
  const [taskList, setTaskList] = useState(() => {
    return storageService.getTasks();
  });
  const [filter, setFilter] = useState(() => {
    return storageService.getFilter();
  });
  const [searchTerm, setSearchTerm] = useState(() => {
    return storageService.getSearchTerm();
  });
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
    isDanger: false,
    onConfirm: null,
  });

  useEffect(() => {
    storageService.setTasks(taskList);
  }, [taskList]);

  useEffect(() => {
    storageService.setFilter(filter);
  }, [filter]);

  useEffect(() => {
    storageService.setSearchTerm(searchTerm);
  }, [searchTerm]);

  const addTask = (title, dueDate) => {
    const newTask = {
      id: taskList.length ? taskList[taskList.length - 1].id + 1 : 1,
      title: title,
      completed: false,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };
    setTaskList([...taskList, newTask]);
  };

  const getDatePeriod = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeekStart = new Date(today);
    nextWeekStart.setDate(nextWeekStart.getDate() + (7 - today.getDay()));
    
    const taskDate = new Date(dateString);
    taskDate.setHours(0, 0, 0, 0);

    if (taskDate.getTime() === today.getTime()) return 'today';
    if (taskDate.getTime() === tomorrow.getTime()) return 'tomorrow';
    if (taskDate < today) return 'overdue';
    if (taskDate <= new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000)) return 'this_week';
    if (taskDate.getMonth() === today.getMonth() && taskDate.getFullYear() === today.getFullYear()) return 'this_month';
    return 'later';
  };

  const groupTasksByPeriod = (tasks) => {
    const groups = {
      overdue: [],
      today: [],
      tomorrow: [],
      this_week: [],
      this_month: [],
      later: [],
    };

    tasks.forEach((task) => {
      const period = getDatePeriod(task.dueDate);
      groups[period].push(task);
    });

    return groups;
  };

  const editTask = (id, completedValue) => {
    const task = taskList.find(t => t.id === id);
    const action = completedValue ? 'terminée' : 'en cours';

    setModal({
      isOpen: true,
      title: '✅ Confirmer le changement',
      message: `Voulez-vous marquer cette tâche comme ${action} ?\n\n"${task?.title}"`,
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
      isDanger: false,
      onConfirm: () => {
        const updatedTasks = taskList.map((t) => {
          if (t.id === id) {
            const updatedTask = { ...t, completed: completedValue };
            if (completedValue && !t.completedAt) {
              updatedTask.completedAt = new Date().toISOString();
            } else if (!completedValue) {
              delete updatedTask.completedAt;
            }
            return updatedTask;
          }
          return t;
        });
        setTaskList(updatedTasks);
        storageService.setTasks(updatedTasks); // Assure la persistance immédiate
        setModal({ ...modal, isOpen: false });
      },
    });
  };

  const deleteTask = (id) => {
    const task = taskList.find(t => t.id === id);
    
    setModal({
      isOpen: true,
      title: '🗑️ Supprimer la tâche',
      message: `Êtes-vous sûr de vouloir supprimer cette tâche ?\n\n"${task?.title}"\n\nCette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      isDanger: true,
      onConfirm: () => {
        setTaskList(taskList.filter((t) => t.id !== id));
        setModal({ ...modal, isOpen: false });
      },
    });
  };

  const clearAllTasks = () => {
    setModal({
      isOpen: true,
      title: '🗑️ Effacer toutes les tâches',
      message: 'Êtes-vous sûr de vouloir supprimer toutes les tâches ?\n\nCette action est irréversible.',
      confirmText: 'Effacer tout',
      cancelText: 'Annuler',
      isDanger: true,
      onConfirm: () => {
        setTaskList([]);
        setModal({ ...modal, isOpen: false });
      },
    });
  };

  const getTaskCounts = () => {
    const completedTasks = taskList.filter((task) => task.completed).length;
    const incompleteTasks = taskList.length - completedTasks;
    return {
      completedTasks, 
      incompleteTasks
    };
  };

  const getFilteredTasks = () => {
    let filtered = taskList;
    
    if (filter === 'completed') {
      filtered = filtered.filter(task => task.completed);
    } else if (filter === 'pending') {
      filtered = filtered.filter(task => !task.completed);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const {completedTasks, incompleteTasks} = getTaskCounts();
  const filteredTasks = getFilteredTasks();
  const progressPercentage = taskList.length > 0 ? (completedTasks / taskList.length) * 100 : 0;
  const groupedTasks = groupTasksByPeriod(filteredTasks);

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };
  
  return (
    <main>
      <Modal 
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        isDanger={modal.isDanger}
        onConfirm={modal.onConfirm}
        onCancel={closeModal}
      />
      <Header />
      
      {taskList.length > 0 && (
        <div className='box' style={styles.progressSection}>
          <div style={styles.progressInfo}>
            <span style={styles.progressLabel}><strong>{completedTasks}/{taskList.length}</strong> tâches complétées</span>
            <span style={styles.progressPercent}>{Math.round(progressPercentage)}%</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width: `${progressPercentage}%`}}></div>
          </div>
        </div>
      )}

      <TaskInput addTask={addTask} />
      
      {taskList.length > 0 && (
        <div className='box' style={styles.filterSection}>
          <div style={styles.filterContainer}>
            <div style={styles.filterButtons}>
              {['all', 'pending', 'completed'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    ...styles.filterBtn,
                    ...(filter === f ? styles.filterBtnActive : {})
                  }}
                >
                  {f === 'all' ? '📋 Toutes' : f === 'pending' ? '⏳ En cours' : '✅ Complétées'}
                </button>
              ))}
            </div>
            <input 
              type="text"
              placeholder='🔍 Chercher une tâche...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            {taskList.length > 0 && (
              <button onClick={clearAllTasks} style={styles.clearBtn}>
                🗑️ Effacer tout
              </button>
            )}
          </div>
        </div>
      )}
      
      <TaskList 
        groupedTasks={groupedTasks}
        editTask={editTask} 
        deleteTask={deleteTask}
        incompleteTasks={incompleteTasks}
      />
      <Footer completedTasks={completedTasks} />
    </main>
  )
}

const styles = {
  progressSection: {
    margin: '20px 0',
  },
  progressInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    fontSize: '0.9rem',
  },
  progressLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  progressPercent: {
    color: '#1e90ff',
    fontWeight: 'bold',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #1e90ff 0%, #4169e1 50%, #1e90ff 100%)',
    transition: 'width 0.3s ease',
  },
  filterSection: {
    margin: '20px 0',
  },
  filterContainer: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  filterButtons: {
    display: 'flex',
    gap: '8px',
    flex: 1,
  },
  filterBtn: {
    padding: '8px 16px',
    fontSize: '0.85rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(30, 144, 255, 0.3)',
    color: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  filterBtnActive: {
    background: 'linear-gradient(135deg, #1e90ff 0%, #4169e1 100%)',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    color: '#fff',
    fontWeight: '600',
  },
  searchInput: {
    padding: '8px 12px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(30, 144, 255, 0.2)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.9rem',
    minWidth: '200px',
  },
  clearBtn: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, rgba(220, 20, 60, 0.2), rgba(255, 20, 68, 0.1))',
    border: '1px solid rgba(220, 20, 60, 0.4)',
    color: 'rgba(255, 150, 150, 0.9)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
}


export default TaskContainer