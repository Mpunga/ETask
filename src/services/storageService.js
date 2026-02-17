// Utility pour gérer le localStorage de manière sécurisée

const STORAGE_KEYS = {
  TASKS: 'e_task_list',
  FILTER: 'e_task_filter',
  SEARCH: 'e_task_search',
  THEME: 'e_task_theme',
};

export const storageService = {
  // ==== TÂCHES ====
  getTasks: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erreur lors de la lecture des tâches:', error);
      return [];
    }
  },

  setTasks: (tasks) => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des tâches:', error);
      return false;
    }
  },

  // ==== FILTRE ====
  getFilter: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FILTER);
      return stored || 'all';
    } catch (error) {
      console.error('Erreur lors de la lecture du filtre:', error);
      return 'all';
    }
  },

  setFilter: (filter) => {
    try {
      localStorage.setItem(STORAGE_KEYS.FILTER, filter);
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du filtre:', error);
      return false;
    }
  },

  // ==== RECHERCHE ====
  getSearchTerm: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SEARCH);
      return stored || '';
    } catch (error) {
      console.error('Erreur lors de la lecture de la recherche:', error);
      return '';
    }
  },

  setSearchTerm: (searchTerm) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SEARCH, searchTerm);
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la recherche:', error);
      return false;
    }
  },

  // ==== THÈME ====
  getTheme: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.THEME);
      return stored || 'dark';
    } catch (error) {
      console.error('Erreur lors de la lecture du thème:', error);
      return 'dark';
    }
  },

  setTheme: (theme) => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du thème:', error);
      return false;
    }
  },

  // ==== GESTION GLOBALE ====
  clearAll: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du stockage:', error);
      return false;
    }
  },

  getStorageStats: () => {
    try {
      const tasks = JSON.stringify(localStorage.getItem(STORAGE_KEYS.TASKS)).length;
      const total = Object.values(STORAGE_KEYS).reduce((acc, key) => {
        return acc + (localStorage.getItem(key)?.length || 0);
      }, 0);
      
      return {
        tasksSize: tasks,
        totalSize: total,
        itemCount: Object.values(STORAGE_KEYS).filter(key => localStorage.getItem(key)).length,
      };
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      return null;
    }
  },

  // ==== EXPORT/IMPORT ====
  exportData: () => {
    try {
      const data = {};
      Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
        const value = localStorage.getItem(storageKey);
        if (value) {
          data[key] = value;
        }
      });
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Erreur lors de l\'export des données:', error);
      return null;
    }
  },

  importData: (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      Object.entries(data).forEach(([key, value]) => {
        const storageKey = STORAGE_KEYS[key];
        if (storageKey) {
          localStorage.setItem(storageKey, value);
        }
      });
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'import des données:', error);
      return false;
    }
  },
};

export default storageService;
