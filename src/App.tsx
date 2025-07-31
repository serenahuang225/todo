import React, { useState, useEffect } from 'react';
import './App.css';
import './styles/utilities.css';
import TodoList from './components/TodoList';
import FilterTabs from './components/FilterTabs';
import AddTodoForm from './components/AddTodoForm';
import Settings from './components/Settings';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface AppSettings {
  listName: string;
  primaryColor: string;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');
  const [draggedTodo, setDraggedTodo] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [lastDragOverIndex, setLastDragOverIndex] = useState<number | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    listName: "Serena's To-Do List",
    primaryColor: '#85ce92'
  });
  const [showSettings, setShowSettings] = useState(false);

  // Load todos and settings from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    const savedSettings = localStorage.getItem('settings');
    
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }));
      setTodos(parsedTodos);
    }
    
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      // Apply the primary color
      document.documentElement.style.setProperty('--color-primary', parsedSettings.primaryColor);
      // Apply the shadow color based on the primary color
      const shadowColor = parsedSettings.primaryColor + '66'; // Add 40% opacity (66 in hex)
      document.documentElement.style.setProperty('--color-shadow-primary', shadowColor);
      // Set the page title
      document.title = parsedSettings.listName;
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Save settings to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const addTodo = (text: string) => {
    const todo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date()
    };
    setTodos([...todos, todo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, todoId: string) => {
    setDraggedTodo(todoId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedTodo !== null) {
      setDragOverIndex(index);
      setLastDragOverIndex(index);
    }

    console.log('HELP');
    console.log('DRAG OVER INDEX:', index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    console.log('DRAG END CALLED!');
    console.log('LAST DRAG OVER INDEX:', lastDragOverIndex);
    
    // Use the last drag over index as the drop position
    if (lastDragOverIndex !== null && draggedTodo) {
      console.log('Processing drop at index:', lastDragOverIndex);
      handleDropLogic(lastDragOverIndex);
    }
    
    setDraggedTodo(null);
    setDragOverIndex(null);
    setLastDragOverIndex(null);
  };

  const handleDropLogic = (dropIndex: number) => {
    console.log('DROP LOGIC CALLED!', { draggedTodo, dropIndex });
    
    if (!draggedTodo) {
      return;
    }

    const draggedIndex = filteredTodos.findIndex(todo => todo.id === draggedTodo);
    console.log('Dragged index in filtered:', draggedIndex);
    
    if (draggedIndex !== -1) {
      // Create new array with the dragged item moved to the new position
      const newTodos = [...todos];
      const draggedOriginalIndex = todos.findIndex(todo => todo.id === draggedTodo);
      console.log('Dragged original index:', draggedOriginalIndex);
      
      if (draggedOriginalIndex !== -1) {
        const [movedItem] = newTodos.splice(draggedOriginalIndex, 1);
        
        // Calculate the target position in the original todos array
        let targetOriginalIndex = 0;
        
        if (dropIndex === 0) {
          // Dropping at the beginning
          targetOriginalIndex = 0;
        } else if (dropIndex >= filteredTodos.length) {
          // Dropping at the end
          targetOriginalIndex = todos.length;
        } else {
          // Dropping between items
          const targetTodo = filteredTodos[dropIndex];
          targetOriginalIndex = todos.findIndex(todo => todo.id === targetTodo.id);
        }
        
        console.log('Target original index:', targetOriginalIndex);
        
        // Insert the moved item at the correct position
        if (targetOriginalIndex !== -1) {
          // Adjust index if we're moving an item from before the target to after it
          const adjustedIndex = draggedOriginalIndex < targetOriginalIndex ? targetOriginalIndex - 1 : targetOriginalIndex;
          console.log('Adjusted index:', adjustedIndex);
          newTodos.splice(adjustedIndex, 0, movedItem);
        } else {
          // Fallback: add to the end
          console.log('Adding to end');
          newTodos.push(movedItem);
        }
        
        console.log('New todos:', newTodos.map(t => t.text));
        setTodos(newTodos);
      }
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'done') return todo.completed;
    return true;
  });

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="app">
      <div className="settings-button" onClick={() => setShowSettings(!showSettings)}>
        ⚙️
      </div>
      
      {showSettings && (
        <Settings
          settings={settings}
          onSettingsChange={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
      
      <div className="notebook-header">
        <h1>{settings.listName}</h1>
      </div>
      <div className="notebook">
        <div className="notebook-content">
          <div className="controls-section">
            <AddTodoForm onAdd={addTodo} />
            <FilterTabs
              filter={filter}
              todosCount={todos.length}
              activeCount={activeTodos.length}
              completedCount={completedTodos.length}
              onFilterChange={setFilter}
            />
          </div>

          <div className="todo-list">
            <TodoList
              todos={filteredTodos}
              draggedTodo={draggedTodo}
              dragOverIndex={dragOverIndex}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            />
          </div>

          {completedTodos.length > 0 && (
            <div className="clear-completed">
              <button onClick={clearCompleted} className="clear-btn">
                Clear completed
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
