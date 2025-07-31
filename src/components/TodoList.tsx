import React from 'react';
import TodoItem from './TodoItem';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface TodoListProps {
  todos: Todo[];
  draggedTodo: string | null;
  dragOverIndex: number | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, todoId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragLeave: () => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  draggedTodo,
  dragOverIndex,
  onToggle,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave
}) => {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <p>No tasks yet. Add one above!</p>
      </div>
    );
  }

  return (
    <>
      {todos.map((todo, index) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          index={index}
          draggedTodo={draggedTodo}
          dragOverIndex={dragOverIndex}
          onToggle={onToggle}
          onDelete={onDelete}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        />
      ))}
      
      {/* Drop zone at the end */}
      <div 
        className={`drop-zone ${dragOverIndex === todos.length ? 'drag-over' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          onDragOver(e, todos.length);
        }}
        onDragLeave={onDragLeave}
      />
      
      {/* Drop zone at the very bottom */}
      <div 
        className={`drop-zone ${dragOverIndex === todos.length + 1 ? 'drag-over' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          onDragOver(e, todos.length + 1);
        }}
        onDragLeave={onDragLeave}
      />
    </>
  );
};

export default TodoList; 