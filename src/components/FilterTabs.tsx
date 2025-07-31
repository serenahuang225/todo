import React from 'react';

interface FilterTabsProps {
  filter: 'all' | 'active' | 'done';
  todosCount: number;
  activeCount: number;
  completedCount: number;
  onFilterChange: (filter: 'all' | 'active' | 'done') => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  filter,
  todosCount,
  activeCount,
  completedCount,
  onFilterChange
}) => {
  return (
    <div className="filters">
      <button
        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
        onClick={() => onFilterChange('all')}
      >
        All ({todosCount})
      </button>
      <button
        className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
        onClick={() => onFilterChange('active')}
      >
        Active ({activeCount})
      </button>
      <button
        className={`filter-btn ${filter === 'done' ? 'active' : ''}`}
        onClick={() => onFilterChange('done')}
      >
        Done ({completedCount})
      </button>
    </div>
  );
};

export default FilterTabs; 