
// Task Management Application - Functional Programming Patterns with SolidJS + Zustand

import { render } from 'solid-js/web';
import { 
  createSignal, 
  createMemo, 
  onMount, 
  onCleanup, 
  For, 
  Show, 
  Switch, 
  Match,
  Component,
  JSX
} from 'solid-js';
import { create, StoreApi } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================================================
// FUNCTIONAL UTILITIES
// ============================================================================

/**
 * Creates a pipeline of functions that execute left-to-right
 * @param fns - Array of functions to compose
 * @returns A function that applies all transformations in sequence
 */
const pipe = <T>(...fns: Array<(arg: any) => any>) =>
  (value: T) => fns.reduce((acc, fn) => fn(acc), value);

/**
 * Creates a composition of functions that execute right-to-left
 * @param fns - Array of functions to compose
 * @returns A function that applies all transformations in reverse sequence
 */
const compose = <T>(...fns: Array<(arg: T) => T>) => 
  (value: T) => fns.reduceRight((acc, fn) => fn(acc), value);

/**
 * Curried map function for array transformations
 * @param fn - Transformation function to apply to each element
 * @returns A function that accepts an array and returns transformed array
 */
const map = <T, U>(fn: (item: T) => U) => 
  (array: T[]): U[] => array.map(fn);

/**
 * Curried filter function for array filtering
 * @param predicate - Function that determines if element should be included
 * @returns A function that accepts an array and returns filtered array
 */
const filter = <T>(predicate: (item: T) => boolean) =>
  (array: T[]): T[] => array.filter(predicate);

/**
 * Curried reduce function for array aggregation
 * @param reducer - Function that combines accumulator with current element
 * @param initial - Initial value for the accumulator
 * @returns A function that accepts an array and returns reduced value
 */
const reduce = <T, U>(reducer: (acc: U, item: T) => U, initial: U) =>
  (array: T[]): U => array.reduce(reducer, initial);

// ============================================================================
// MAYBE/OPTION PATTERN FOR NULL SAFETY
// ============================================================================

/**
 * Type representing a value that may or may not exist
 */
type Maybe<T> = T | null | undefined;

/**
 * Safely transforms a Maybe value, providing a fallback for null/undefined
 * @param value - The potentially null/undefined value
 * @param fn - Transformation function to apply if value exists
 * @param fallback - Value to return if original value is null/undefined
 * @returns Transformed value or fallback
 */
const maybe = <T, U>(
  value: Maybe<T>,
  fn: (val: T) => U,
  fallback: U
): U => (value != null ? fn(value) : fallback);

/**
 * Chains operations on Maybe values, short-circuiting on null/undefined
 * @param value - The potentially null/undefined value
 * @param fn - Function that may return another Maybe value
 * @returns Chained Maybe result
 */
const chain = <T, U>(
  value: Maybe<T>,
  fn: (val: T) => Maybe<U>
): Maybe<U> => (value != null ? fn(value) : null);

// ============================================================================
// LENS PATTERN FOR IMMUTABLE UPDATES
// ============================================================================

/**
 * A Lens provides a functional way to get and set nested values immutably
 */
type Lens<S, A> = {
  get: (state: S) => A;
  set: (value: A) => (state: S) => S;
};

/**
 * Creates a lens for focusing on a specific part of a data structure
 * @param get - Function to extract the focused value
 * @param set - Function to immutably update the focused value
 * @returns A Lens object
 */
const lens = <S, A>(
  get: (state: S) => A,
  set: (value: A) => (state: S) => S
): Lens<S, A> => ({ get, set });

/**
 * Reads a value through a lens
 * @param lens - The lens to use for reading
 * @returns A function that extracts the value from state
 */
const view = <S, A>(lens: Lens<S, A>) => 
  (state: S): A => lens.get(state);

/**
 * Updates a value through a lens using a transformation function
 * @param lens - The lens to use for updating
 * @returns A curried function chain for transformation
 */
const over = <S, A>(lens: Lens<S, A>) =>
  (fn: (value: A) => A) =>
  (state: S): S => lens.set(fn(lens.get(state)))(state);

/**
 * Sets a value through a lens
 * @param lens - The lens to use for setting
 * @returns A curried function chain for setting
 */
const set = <S, A>(lens: Lens<S, A>) =>
  (value: A) =>
  (state: S): S => lens.set(value)(state);

// ============================================================================
// DOMAIN TYPES
// ============================================================================

/**
 * Priority levels for tasks
 */
type Priority = 'low' | 'medium' | 'high';

/**
 * Filter options for task list
 */
type TaskFilter = 'all' | 'active' | 'completed';

/**
 * Represents a single task in the system
 */
interface Task {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly completed: boolean;
  readonly priority: Priority;
  readonly createdAt: number;
  readonly tags: readonly string[];
}

/**
 * Statistics derived from task data
 */
interface TaskStats {
  readonly total: number;
  readonly completed: number;
  readonly active: number;
  readonly completionRate: number;
}

/**
 * Application state shape
 */
interface TaskState {
  readonly tasks: readonly Task[];
  readonly filter: TaskFilter;
  readonly searchQuery: string;
  readonly addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  readonly toggleTask: (id: string) => void;
  readonly deleteTask: (id: string) => void;
  readonly updateTask: (id: string, updates: Partial<Task>) => void;
  readonly setFilter: (filter: TaskFilter) => void;
  readonly setSearchQuery: (query: string) => void;
  readonly clearCompleted: () => void;
}

// ============================================================================
// PURE FUNCTIONS FOR TASK OPERATIONS
// ============================================================================

/**
 * Generates a unique ID for a task
 * @returns A unique string identifier
 */
const generateId = (): string => 
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Creates a new task with generated ID and timestamp
 * @param taskData - Partial task data without ID and timestamp
 * @returns Complete task object
 */
const createTask = (taskData: Omit<Task, 'id' | 'createdAt'>): Task => ({
  ...taskData,
  id: generateId(),
  createdAt: Date.now(),
});

/**
 * Toggles the completion status of a task
 * @param task - The task to toggle
 * @returns New task with toggled completion status
 */
const toggleTaskCompletion = (task: Task): Task => ({
  ...task,
  completed: !task.completed,
});

/**
 * Filters tasks based on their completion status
 * @param filter - The filter to apply
 * @returns A function that filters a task array
 */
const filterByStatus = (filter: TaskFilter) => (tasks: readonly Task[]): Task[] => {
  switch (filter) {
    case 'active': return tasks.filter(t => !t.completed);
    case 'completed': return tasks.filter(t => t.completed);
    default: return [...tasks];
  }
};

/**
 * Filters tasks based on a search query
 * @param query - The search string
 * @returns A function that filters tasks matching the query
 */
const filterBySearch = (query: string) => (tasks: Task[]): Task[] => {
  const lowerQuery = query.toLowerCase();
  return query
    ? tasks.filter(t => 
        t.title.toLowerCase().includes(lowerQuery) ||
        t.description.toLowerCase().includes(lowerQuery) ||
        t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    : tasks;
};

/**
 * Sorts tasks by creation date (newest first)
 * @param tasks - Array of tasks to sort
 * @returns Sorted array of tasks
 */
const sortByDate = (tasks: Task[]): Task[] =>
  [...tasks].sort((a, b) => b.createdAt - a.createdAt);

/**
 * Sorts tasks by priority (high > medium > low)
 * @param tasks - Array of tasks to sort
 * @returns Sorted array of tasks
 */
const sortByPriority = (tasks: Task[]): Task[] => {
  const priorityOrder: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
  return [...tasks].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
};

/**
 * Calculates statistics from a task array
 * @param tasks - Array of tasks to analyze
 * @returns Task statistics object
 */
const calculateStats = (tasks: readonly Task[]): TaskStats => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;
  const completionRate = total > 0 ? (completed / total) * 100 : 0;
  
  return { total, completed, active, completionRate };
};

// ============================================================================
// LENSES FOR TASK STATE
// ============================================================================

/**
 * Lens for accessing tasks array in state
 */
const tasksLens = lens<TaskState, readonly Task[]>(
  (state) => state.tasks,
  (tasks) => (state) => ({ ...state, tasks })
);

/**
 * Lens for accessing filter in state
 */
const filterLens = lens<TaskState, TaskFilter>(
  (state) => state.filter,
  (filter) => (state) => ({ ...state, filter })
);

/**
 * Lens for accessing search query in state
 */
const searchLens = lens<TaskState, string>(
  (state) => state.searchQuery,
  (searchQuery) => (state) => ({ ...state, searchQuery })
);

// ============================================================================
// ZUSTAND STORE WITH FUNCTIONAL PATTERNS
// ============================================================================

/**
 * Creates the task management store with persistence
 * Uses functional patterns for all state updates
 */
const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      filter: 'all',
      searchQuery: '',
      
      /**
       * Adds a new task to the store
       * Uses pure function composition to create and append task
       */
      addTask: (taskData) => set((state) => ({
        ...state,
        tasks: [...state.tasks, createTask(taskData)],
      })),
      
      /**
       * Toggles a task's completion status
       * Uses map with conditional transformation
       */
      toggleTask: (id) => set((state) => 
        over(tasksLens)(
          map((task: Task) => 
            task.id === id ? toggleTaskCompletion(task) : task
          )
        )(state)
      ),
      
      /**
       * Deletes a task by ID
       * Uses filter to remove matching task
       */
      deleteTask: (id) => set((state) =>
        over(tasksLens)(
          filter((task: Task) => task.id !== id)
        )(state)
      ),
      
      /**
       * Updates a task with partial data
       * Uses map with object spread for immutable update
       */
      updateTask: (id, updates) => set((state) =>
        over(tasksLens)(
          map((task: Task) =>
            task.id === id ? { ...task, ...updates } : task
          )
        )(state)
      ),
      
      /**
       * Sets the current filter
       * Uses lens for immutable update
       */
      setFilter: (filter) => set((state) =>
        set(filterLens)(filter)(state)
      ),
      
      /**
       * Sets the search query
       * Uses lens for immutable update
       */
      setSearchQuery: (query) => set((state) =>
        set(searchLens)(query)(state)
      ),
      
      /**
       * Removes all completed tasks
       * Uses filter to keep only active tasks
       */
      clearCompleted: () => set((state) =>
        over(tasksLens)(
          filter((task: Task) => !task.completed)
        )(state)
      ),
    }),
    {
      name: 'task-storage',
    }
  )
);

// ============================================================================
// SOLID-ZUSTAND BRIDGE
// ============================================================================

/**
 * Bridges Zustand store to SolidJS reactivity system
 * Creates a signal that updates when store slice changes
 * 
 * @param store - The Zustand store instance
 * @param selector - Function to select a slice of state
 * @returns A signal accessor function
 */
function useZustandStore<T, U>(
  store: StoreApi<T>,
  selector: (state: T) => U
): () => U {
  const [value, setValue] = createSignal(selector(store.getState()));
  
  // Subscribe to store changes
  const unsubscribe = store.subscribe((state) => {
    setValue(() => selector(state));
  });
  
  // Cleanup subscription on component unmount
  onCleanup(unsubscribe);
  
  return value;
}

// ============================================================================
// HIGHER-ORDER COMPONENT FOR LOADING STATE
// ============================================================================

/**
 * HOC that wraps a component with loading state handling
 * Shows loading component while data is being fetched
 * 
 * @param WrappedComponent - The component to wrap
 * @param LoadingComponent - Component to show during loading
 * @returns Enhanced component with loading capability
 */
const withLoading = <P extends object>(
  WrappedComponent: Component<P>,
  LoadingComponent: Component = () => <div class="loading">Loading...</div>
) => {
  return (props: P & { loading: boolean }) => {
    return (
      <Show when={!props.loading} fallback={<LoadingComponent />}>
        <WrappedComponent {...props as P} />
      </Show>
    );
  };
};

// ============================================================================
// CURRIED EVENT HANDLERS
// ============================================================================

/**
 * Creates a curried delete handler
 * Allows partial application of the delete function
 * 
 * @param onDelete - Function to call with task ID
 * @returns Curried handler function
 */
const createDeleteHandler = (onDelete: (id: string) => void) => 
  (id: string) => 
  (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    onDelete(id);
  };

/**
 * Creates a curried toggle handler
 * Allows partial application of the toggle function
 * 
 * @param onToggle - Function to call with task ID
 * @returns Curried handler function
 */
const createToggleHandler = (onToggle: (id: string) => void) =>
  (id: string) =>
  (event: Event) => {
    event.preventDefault();
    onToggle(id);
  };

/**
 * Creates a curried priority update handler
 * Allows partial application of update function with priority
 * 
 * @param onUpdate - Function to call with task ID and updates
 * @returns Curried handler function
 */
const createPriorityHandler = (
  onUpdate: (id: string, updates: Partial<Task>) => void
) =>
  (id: string) =>
  (priority: Priority) =>
  (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    onUpdate(id, { priority });
  };

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Badge component for displaying task priority
 * Uses functional composition for className generation
 */
const PriorityBadge: Component<{ priority: Priority }> = (props) => {
  const getColorClass = (priority: Priority): string => {
    const colorMap: Record<Priority, string> = {
      high: 'badge-high',
      medium: 'badge-medium',
      low: 'badge-low',
    };
    return colorMap[priority];
  };
  
  return (
    <span class={`badge ${getColorClass(props.priority)}`}>
      {props.priority}
    </span>
  );
};

/**
 * Individual task item component
 * Demonstrates curried event handlers and functional composition
 */
const TaskItem: Component<{
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}> = (props) => {
  const handleToggle = createToggleHandler(props.onToggle);
  const handleDelete = createDeleteHandler(props.onDelete);
  const handlePriority = createPriorityHandler(props.onUpdate);
  
  return (
    <div class={`task-item ${props.task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={props.task.completed}
        onChange={handleToggle(props.task.id)}
        class="task-checkbox"
      />
      
      <div class="task-content">
        <h3 class="task-title">{props.task.title}</h3>
        <p class="task-description">{props.task.description}</p>
        
        <div class="task-meta">
          <PriorityBadge priority={props.task.priority} />
          
          <Show when={props.task.tags.length > 0}>
            <div class="task-tags">
              <For each={[...props.task.tags]}>
                {(tag) => <span class="tag">{tag}</span>}
              </For>
            </div>
          </Show>
        </div>
      </div>
      
      <div class="task-actions">
        <select
          value={props.task.priority}
          onChange={(e) => handlePriority(props.task.id)(e.target.value as Priority)(e)}
          class="priority-select"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        
        <button
          onClick={handleDelete(props.task.id)}
          class="btn-delete"
          aria-label="Delete task"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

/**
 * Task list component with loading state HOC
 * Demonstrates functional data transformation pipeline
 */
const TaskListBase: Component<{
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}> = (props) => {
  return (
    <div class="task-list">
      <Show
        when={props.tasks.length > 0}
        fallback={<div class="empty-state">No tasks found</div>}
      >
        <For each={props.tasks}>
          {(task) => (
            <TaskItem
              task={task}
              onToggle={props.onToggle}
              onDelete={props.onDelete}
              onUpdate={props.onUpdate}
            />
          )}
        </For>
      </Show>
    </div>
  );
};

// Apply HOC for loading state
const TaskList = withLoading(TaskListBase);

/**
 * Statistics display component
 * Uses functional composition to calculate and display stats
 */
const TaskStats: Component<{ stats: TaskStats }> = (props) => {
  return (
    <div class="stats-container">
      <div class="stat-card">
        <span class="stat-label">Total</span>
        <span class="stat-value">{props.stats.total}</span>
      </div>
      
      <div class="stat-card">
        <span class="stat-label">Active</span>
        <span class="stat-value">{props.stats.active}</span>
      </div>
      
      <div class="stat-card">
        <span class="stat-label">Completed</span>
        <span class="stat-value">{props.stats.completed}</span>
      </div>
      
      <div class="stat-card">
        <span class="stat-label">Completion Rate</span>
        <span class="stat-value">{props.stats.completionRate.toFixed(1)}%</span>
      </div>
    </div>
  );
};

/**
 * Form for adding new tasks
 * Demonstrates controlled inputs with SolidJS signals
 */
const TaskForm: Component<{
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}> = (props) => {
  const [title, setTitle] = createSignal('');
  const [description, setDescription] = createSignal('');
  const [priority, setPriority] = createSignal<Priority>('medium');
  const [tagInput, setTagInput] = createSignal('');
  const [tags, setTags] = createSignal<string[]>([]);
  
  /**
   * Handles form submission
   * Validates input and creates new task
   */
  const handleSubmit = (event: Event) => {
    event.preventDefault();
    
    const trimmedTitle = title().trim();
    if (!trimmedTitle) return;
    
    props.onAddTask({
      title: trimmedTitle,
      description: description().trim(),
      completed: false,
      priority: priority(),
      tags: tags(),
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setTags([]);
    setTagInput('');
  };
  
  /**
   * Adds a tag from input
   * Uses functional approach to update tags array
   */
  const addTag = () => {
    const tag = tagInput().trim();
    if (tag && !tags().includes(tag)) {
      setTags((prev) => [...prev, tag]);
      setTagInput('');
    }
  };
  
  /**
   * Removes a tag by value
   * Uses filter for immutable removal
   */
  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter(tag => tag !== tagToRemove));
  };
  
  return (
    <form onSubmit={handleSubmit} class="task-form">
      <div class="form-group">
        <input
          type="text"
          value={title()}
          onInput={(e) => setTitle(e.currentTarget.value)}
          placeholder="Task title"
          class="form-input"
          required
        />
      </div>
      
      <div class="form-group">
        <textarea
          value={description()}
          onInput={(e) => setDescription(e.currentTarget.value)}
          placeholder="Task description"
          class="form-textarea"
          rows="3"
        />
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Priority</label>
          <select
            value={priority()}
            onChange={(e) => setPriority(e.currentTarget.value as Priority)}
            class="form-select"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div class="form-group flex-grow">
          <label class="form-label">Tags</label>
          <div class="tag-input-container">
            <input
              type="text"
              value={tagInput()}
              onInput={(e) => setTagInput(e.currentTarget.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add tag"
              class="form-input"
            />
            <button
              type="button"
              onClick={addTag}
              class="btn-add-tag"
            >
              Add
            </button>
          </div>
        </div>
      </div>
      
      <Show when={tags().length > 0}>
        <div class="tags-preview">
          <For each={tags()}>
            {(tag) => (
              <span class="tag-preview">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  class="tag-remove"
                >
                  ✕
                </button>
              </span>
            )}
          </For>
        </div>
      </Show>
      
      <button type="submit" class="btn-submit">
        Add Task
      </button>
    </form>
  );
};

/**
 * Filter and search controls
 * Demonstrates controlled inputs bridged to Zustand
 */
const TaskControls: Component<{
  filter: TaskFilter;
  searchQuery: string;
  onFilterChange: (filter: TaskFilter) => void;
  onSearchChange: (query: string) => void;
  onClearCompleted: () => void;
}> = (props) => {
  return (
    <div class="task-controls">
      <div class="control-group">
        <input
          type="text"
          value={props.searchQuery}
          onInput={(e) => props.onSearchChange(e.currentTarget.value)}
          placeholder="Search tasks..."
          class="search-input"
        />
      </div>
      
      <div class="control-group">
        <div class="filter-buttons">
          <button
            onClick={() => props.onFilterChange('all')}
            class={`filter-btn ${props.filter === 'all' ? 'active' : ''}`}
          >
            All
          </button>
          <button
            onClick={() => props.onFilterChange('active')}
            class={`filter-btn ${props.filter === 'active' ? 'active' : ''}`}
          >
            Active
          </button>
          <button
            onClick={() => props.onFilterChange('completed')}
            class={`filter-btn ${props.filter === 'completed' ? 'active' : ''}`}
          >
            Completed
          </button>
        </div>
      </div>
      
      <div class="control-group">
        <button
          onClick={props.onClearCompleted}
          class="btn-clear"
        >
          Clear Completed
        </button>
      </div>
    </div>
  );
};

/**
 * Main application component
 * Orchestrates all functional patterns and component interactions
 */
const App: Component = () => {
  // Bridge Zustand store to SolidJS reactivity
  const tasks = useZustandStore(useTaskStore, (state) => state.tasks);
  const filter = useZustandStore(useTaskStore, (state) => state.filter);
  const searchQuery = useZustandStore(useTaskStore, (state) => state.searchQuery);
  
  // Get store actions
  const { 
    addTask, 
    toggleTask, 
    deleteTask, 
    updateTask,
    setFilter,
    setSearchQuery,
    clearCompleted,
  } = useTaskStore.getState();
  
  // Simulated loading state for demonstration
  const [loading, setLoading] = createSignal(false);
  
  /**
   * Processed tasks using functional composition
   * Demonstrates pipe, filter, and sort operations
   */
  const processedTasks = createMemo(() => {
    return pipe(
      filterByStatus(filter()),
      filterBySearch(searchQuery()),
      compose(sortByDate, sortByPriority)
    )(tasks());
  });
  
  /**
   * Statistics calculated from all tasks
   * Uses pure function for calculation
   */
  const stats = createMemo(() => calculateStats(tasks()));
  
  /**
   * Lifecycle hook - simulates initial data load
   */
  onMount(() => {
    setLoading(true);
    // Simulate async load
    setTimeout(() => setLoading(false), 500);
  });
  
  return (
    <div class="app">
      <header class="app-header">
        <h1>Task Manager</h1>
        <p class="subtitle">Functional Programming with SolidJS + Zustand</p>
      </header>
      
      <main class="app-main">
        <section class="section">
          <h2>Add New Task</h2>
          <TaskForm onAddTask={addTask} />
        </section>
        
        <section class="section">
          <h2>Statistics</h2>
          <TaskStats stats={stats()} />
        </section>
        
        <section class="section">
          <h2>Tasks</h2>
          <TaskControls
            filter={filter()}
            searchQuery={searchQuery()}
            onFilterChange={setFilter}
            onSearchChange={setSearchQuery}
            onClearCompleted={clearCompleted}
          />
          
          <TaskList
            tasks={processedTasks()}
            loading={loading()}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        </section>
      </main>
      
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px;
        }
        
        .app {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .app-header {
          text-align: center;
          color: white;
          margin-bottom: 40px;
        }
        
        .app-header h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 10px;
        }
        
        .subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
        }
        
        .section {
          background: white;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        
        .section h2 {
          font-size: 1.8rem;
          color: #333;
          margin-bottom: 20px;
        }
        
        /* Task Form Styles */
        .task-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-label {
          font-weight: 600;
          color: #555;
          font-size: 0.9rem;
        }
        
        .form-input,
        .form-textarea,
        .form-select {
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        
        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          border-color: #667eea;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 15px;
        }
        
        .flex-grow {
          flex: 1;
        }
        
        .tag-input-container {
          display: flex;
          gap: 10px;
        }
        
        .btn-add-tag {
          padding: 12px 20px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s;
          white-space: nowrap;
        }
        
        .btn-add-tag:hover {
          background: #5568d3;
        }
        
        .tags-preview {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .tag-preview {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #e3f2fd;
          color: #1976d2;
          border-radius: 16px;
          font-size: 0.9rem;
        }
        
        .tag-remove {
          background: none;
          border: none;
          color: #1976d2;
          cursor: pointer;
          padding: 0;
          font-size: 1rem;
          line-height: 1;
        }
        
        .btn-submit {
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1.1rem;
          font-weight: 600;
          transition: transform 0.2s;
        }
        
        .btn-submit:hover {
          transform: translateY(-2px);
        }
        
        /* Statistics Styles */
        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        
        .stat-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 25px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .stat-label {
          font-size: 0.9rem;
          opacity: 0.9;
          margin-bottom: 8px;
        }
        
        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
        }
        
        /* Task Controls Styles */
        .task-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 20px;
          align-items: center;
        }
        
        .control-group {
          display: flex;
          gap: 10px;
        }
        
        .search-input {
          padding: 10px 15px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          min-width: 250px;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #667eea;
        }
        
        .filter-buttons {
          display: flex;
          gap: 5px;
          background: #f5f5f5;
          padding: 4px;
          border-radius: 8px;
        }
        
        .filter-btn {
          padding: 8px 16px;
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
          color: #666;
        }
        
        .filter-btn.active {
          background: white;
          color: #667eea;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .btn-clear {
          padding: 10px 20px;
          background: #f44336;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s;
        }
        
        .btn-clear:hover {
          background: #d32f2f;
        }
        
        /* Task List Styles */
        .task-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #999;
          font-size: 1.2rem;
        }
        
        .loading {
          text-align: center;
          padding: 60px 20px;
          color: #667eea;
          font-size: 1.2rem;
          font-weight: 600;
        }
        
        /* Task Item Styles */
        .task-item {
          display: flex;
          gap: 15px;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 10px;
          border-left: 4px solid #667eea;
          transition: all 0.2s;
        }
        
        .task-item:hover {
          transform: translateX(5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .task-item.completed {
          opacity: 0.6;
          border-left-color: #4caf50;
        }
        
        .task-item.completed .task-title,
        .task-item.completed .task-description {
          text-decoration: line-through;
        }
        
        .task-checkbox {
          width: 24px;
          height: 24px;
          cursor: pointer;
          flex-shrink: 0;
        }
        
        .task-content {
          flex: 1;
          min-width: 0;
        }
        
        .task-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 5px;
        }
        
        .task-description {
          color: #666;
          margin-bottom: 10px;
          line-height: 1.5;
        }
        
        .task-meta {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .badge-high {
          background: #ffebee;
          color: #c62828;
        }
        
        .badge-medium {
          background: #fff3e0;
          color: #e65100;
        }
        
        .badge-low {
          background: #e8f5e9;
          color: #2e7d32;
        }
        
        .task-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        
        .tag {
          padding: 4px 10px;
          background: #e3f2fd;
          color: #1976d2;
          border-radius: 12px;
          font-size: 0.85rem;
        }
        
        .task-actions {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-shrink: 0;
        }
        
        .priority-select {
          padding: 8px 12px;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          font-size: 0.9rem;
          cursor: pointer;
        }
        
        .btn-delete {
          width: 36px;
          height: 36px;
          background: #f44336;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        
        .btn-delete:hover {
          background: #d32f2f;
        }
        
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .task-item {
            flex-direction: column;
          }
          
          .task-actions {
            justify-content: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// RENDER APPLICATION
// ============================================================================

render(() => <App />, document.getElementById('root')!);
