import { useFilters } from '@/hooks/filters';
import CreateTaskForm from '@/components/CreateTaskForm';
import TaskFilters from '@/components/TaskFilters';
import TaskList from '@/components/TaskList';
import './App.css';

function App() {
  const { filters, setSearch, setCompleted, setUserId, resetFilters } = useFilters();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Gestor de Tareas
          </h1>
          <p className="text-gray-600">
            Organiza y gestiona tus tareas de forma eficiente
          </p>
        </header>

        <main className="space-y-6">
          <CreateTaskForm />
          
          <TaskFilters
            filters={filters}
            onSearchChange={setSearch}
            onStatusChange={setCompleted}
            onUserChange={setUserId}
            onReset={resetFilters}
          />

          <TaskList filters={filters} />
        </main>
      </div>
    </div>
  );
}

export default App;
