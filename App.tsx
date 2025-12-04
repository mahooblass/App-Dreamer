import React, { useState, useEffect } from 'react';
import { Plus, Wallet, Sparkles, Download } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Goal, GoalFormData } from './types';
import StatsOverview from './components/StatsOverview';
import GoalCard from './components/GoalCard';
import GoalForm from './components/GoalForm';
import AIAdvisor from './components/AIAdvisor';
import ReactMarkdown from 'react-markdown';

// Mock initial data if localStorage is empty
const INITIAL_GOALS: Goal[] = [];

const App: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('wishwallet_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('wishwallet_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    // Show the install prompt
    installPrompt.prompt();
    // Wait for the user to respond to the prompt
    installPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        setInstallPrompt(null);
      }
    });
  };

  const handleCreateGoal = (data: GoalFormData) => {
    const newGoal: Goal = {
      id: uuidv4(),
      ...data,
      createdAt: Date.now()
    };
    setGoals(prev => [newGoal, ...prev]);
  };

  const handleUpdateGoal = (data: GoalFormData) => {
    if (!editingGoal) return;
    setGoals(prev => prev.map(g => 
      g.id === editingGoal.id ? { ...g, ...data } : g
    ));
    setEditingGoal(null);
  };

  const handleUpdateAmount = (id: string, amount: number) => {
    setGoals(prev => prev.map(g => 
      g.id === id ? { ...g, currentAmount: amount } : g
    ));
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta meta?')) {
      setGoals(prev => prev.filter(g => g.id !== id));
    }
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGoal(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-500/30">
                <Wallet size={24} />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                WishWallet
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              {installPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-all text-sm font-medium animate-pulse"
                >
                  <Download size={16} />
                  <span className="hidden xs:inline">Instalar App</span>
                </button>
              )}
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-all shadow-md hover:shadow-lg text-sm font-medium"
              >
                <Plus size={18} />
                Nueva Meta
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Hola, soñador 👋</h2>
          <p className="text-slate-500 mt-1">Aquí tienes el progreso de tus deseos financieros.</p>
        </div>

        {/* Dashboard Stats */}
        <StatsOverview goals={goals} />

        {/* AI Section */}
        <AIAdvisor goals={goals} />

        {/* Filter / Header for Grid */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Mis Deseos 
            <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">
              {goals.length}
            </span>
          </h3>
        </div>

        {/* Grid of Goals */}
        {goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map(goal => (
              <GoalCard 
                key={goal.id} 
                goal={goal} 
                onUpdateAmount={handleUpdateAmount}
                onDelete={handleDeleteGoal}
                onEdit={openEditModal}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4 text-slate-300">
              <Wallet size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">Tu lista de deseos está vacía</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">Empieza agregando ese artículo especial o viaje que tanto quieres para comenzar a ahorrar.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              <Plus size={20} />
              Crear Primera Meta
            </button>
          </div>
        )}
      </main>

      {/* Floating Action Button (Mobile) */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 sm:hidden bg-blue-600 text-white p-4 rounded-full shadow-xl shadow-blue-500/40 hover:bg-blue-700 transition-transform active:scale-95 z-40"
      >
        <Plus size={24} />
      </button>

      {/* Modal */}
      <GoalForm 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal}
        initialData={editingGoal}
      />
    </div>
  );
};

export default App;