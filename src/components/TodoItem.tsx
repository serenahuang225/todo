import React from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface TodoItemProps {
  todo: Todo;
  index: number;
  draggedTodo: string | null;
  dragOverIndex: number | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, todoId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragLeave: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  index,
  draggedTodo,
  dragOverIndex,
  onToggle,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave
}) => {
  return (
    <React.Fragment>
      {/* Drop zone above the item */}
      <div 
        className={`drop-zone ${dragOverIndex === index ? 'drag-over' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          onDragOver(e, index);
        }}
        onDragLeave={onDragLeave}
      />
      
      {/* Todo item */}
      <div 
        className={`todo-item ${todo.completed ? 'completed' : ''} ${
          draggedTodo === todo.id ? 'dragging' : ''
        }`}
        draggable
        onDragStart={(e) => onDragStart(e, todo.id)}
        onDragEnd={onDragEnd}
        onDragOver={(e) => {
          e.preventDefault();
          onDragOver(e, index);
        }}
      >
        <div className="todo-content">
          <button
            className={`checkbox ${todo.completed ? 'checked' : ''}`}
            onClick={() => onToggle(todo.id)}
          >
            {todo.completed && <span className="checkmark">✅</span>}
          </button>
          <span className="todo-text">{todo.text}</span>
        </div>
        <button
          className="delete-btn"
          onClick={() => onDelete(todo.id)}
        >
          ❌
        </button>
      </div>
    </React.Fragment>
  );
};

export default TodoItem; 