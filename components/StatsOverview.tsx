import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Goal } from '../types';
import { TrendingUp, Target, Wallet } from 'lucide-react';

interface StatsOverviewProps {
  goals: Goal[];
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const StatsOverview: React.FC<StatsOverviewProps> = ({ goals }) => {
  const totalTarget = goals.reduce((acc, goal) => acc + goal.targetAmount, 0);
  const totalSaved = goals.reduce((acc, goal) => acc + goal.currentAmount, 0);
  const remaining = totalTarget - totalSaved;
  const progressPercentage = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  // Prepare data for Pie Chart by Category
  const dataByCategory = goals.reduce((acc, goal) => {
    const existing = acc.find(item => item.name === goal.category);
    if (existing) {
      existing.value += goal.targetAmount;
    } else {
      acc.push({ name: goal.category, value: goal.targetAmount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Stats Cards */}
      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-3">
            <Target size={24} />
          </div>
          <p className="text-slate-500 text-sm font-medium">Meta Total</p>
          <p className="text-2xl font-bold text-slate-800">${totalTarget.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full mb-3">
            <Wallet size={24} />
          </div>
          <p className="text-slate-500 text-sm font-medium">Ahorrado</p>
          <p className="text-2xl font-bold text-emerald-600">${totalSaved.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full mb-3">
            <TrendingUp size={24} />
          </div>
          <p className="text-slate-500 text-sm font-medium">Progreso Global</p>
          <p className="text-2xl font-bold text-indigo-600">{progressPercentage.toFixed(1)}%</p>
        </div>

        {/* AI Advice Placeholder / Extra Stat Area */}
        <div className="col-span-1 sm:col-span-3 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg mt-2 relative overflow-hidden">
            <div className="relative z-10">
                <h3 className="font-semibold text-lg mb-1">Faltan ${remaining.toLocaleString()}</h3>
                <p className="text-slate-300 text-sm">Para cumplir todos tus deseos. ¡Tú puedes!</p>
                <div className="w-full bg-slate-700 h-2 rounded-full mt-4 overflow-hidden">
                    <div 
                        className="bg-emerald-400 h-full transition-all duration-1000 ease-out" 
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>
            {/* Decorative circle */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl pointer-events-none"></div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center h-80 lg:h-auto">
        <h3 className="text-slate-700 font-semibold mb-4 w-full text-left">Distribución por Categoría</h3>
        {dataByCategory.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataByCategory}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {dataByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-slate-400 text-sm text-center">
            Agrega metas para ver el gráfico
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsOverview;