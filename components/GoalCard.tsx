import React, { useState } from 'react';
import { Goal } from '../types';
import { Plus, Trash2, Edit2, CheckCircle, TrendingUp } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  onUpdateAmount: (id: string, amount: number) => void;
  onDelete: (id: string) => void;
  onEdit: (goal: Goal) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onUpdateAmount, onDelete, onEdit }) => {
  const [addAmount, setAddAmount] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);

  const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const isCompleted = goal.currentAmount >= goal.targetAmount;

  const handleAddSavings = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(addAmount);
    if (!isNaN(amount) && amount > 0) {
      onUpdateAmount(goal.id, goal.currentAmount + amount);
      setAddAmount('');
      setIsAdding(false);
    }
  };

  return (
    <div className={`group relative bg-white rounded-2xl p-6 shadow-sm border transition-all duration-300 active:scale-[0.99] touch-manipulation ${isCompleted ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100'}`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md mb-2">
            {goal.category}
          </span>
          <h3 className="text-lg font-bold text-slate-800 leading-tight">{goal.name}</h3>
        </div>
        <div className="flex space-x-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(goal)} 
            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors active:bg-blue-100"
            title="Editar"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => onDelete(goal.id)} 
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors active:bg-red-100"
            title="Eliminar"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="font-medium text-slate-600">Progreso</span>
          <span className={`font-bold ${isCompleted ? 'text-emerald-600' : 'text-blue-600'}`}>
            {percentage.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-700 ease-out ${isCompleted ? 'bg-emerald-500' : 'bg-blue-500'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Amount Details */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <p className="text-xs text-slate-500">Ahorrado</p>
          <p className="text-xl font-bold text-slate-800">${goal.currentAmount.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Meta</p>
          <p className="text-sm font-semibold text-slate-600">${goal.targetAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Actions */}
      <div>
        {isCompleted ? (
          <div className="flex items-center justify-center w-full py-3 bg-emerald-100 text-emerald-700 rounded-xl font-medium">
            <CheckCircle size={20} className="mr-2" />
            ¡Meta Cumplida!
          </div>
        ) : isAdding ? (
          <form onSubmit={handleAddSavings} className="flex items-center space-x-2 animate-fadeIn">
            <input 
              type="number"
              inputMode="decimal"
              placeholder="Monto" 
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              autoFocus
              min="0"
              step="0.01"
            />
            <button 
              type="submit"
              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors active:bg-blue-800"
            >
              <Plus size={20} />
            </button>
            <button 
              type="button" 
              onClick={() => setIsAdding(false)}
              className="p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors active:bg-slate-300"
            >
              X
            </button>
          </form>
        ) : (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors flex items-center justify-center space-x-2 active:bg-slate-950"
          >
            <Plus size={18} />
            <span>Agregar Ahorro</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default GoalCard;