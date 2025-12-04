import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { getFinancialAdvice } from '../services/geminiService';
import { Goal } from '../types';
import ReactMarkdown from 'react-markdown';

interface AIAdvisorProps {
  goals: Goal[];
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ goals }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetAdvice = async () => {
    setLoading(true);
    setAdvice(null);
    const result = await getFinancialAdvice(goals);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border border-indigo-100 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 relative z-10">
        <div>
            <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
            <Sparkles className="text-amber-400 fill-amber-400" size={20} />
            Asesor Inteligente
            </h2>
            <p className="text-indigo-700/80 text-sm mt-1">Obtén análisis y consejos personalizados sobre tus metas.</p>
        </div>
        <button
          onClick={handleGetAdvice}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Analizando...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Consultar IA
            </>
          )}
        </button>
      </div>

      {advice && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-indigo-100 text-slate-700 text-sm leading-relaxed animate-fadeIn shadow-sm">
           <ReactMarkdown 
            components={{
                ul: ({node, ...props}) => <ul className="list-disc ml-5 mt-2 mb-2" {...props} />,
                li: ({node, ...props}) => <li className="mb-1" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-indigo-900" {...props} />,
            }}
           >
            {advice}
           </ReactMarkdown>
        </div>
      )}
      
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-200 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
    </div>
  );
};

export default AIAdvisor;