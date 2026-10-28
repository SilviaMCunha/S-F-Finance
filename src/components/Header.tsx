import React from 'react';
import { PlusCircle, Wallet, RotateCcw, Sparkles } from 'lucide-react';

interface HeaderProps {
  onNewTransaction: () => void;
  onRestoreSamples: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNewTransaction,
  onRestoreSamples,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5">
          {/* Logo e apresentação */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  S&F Finance
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  v1.0
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Organização e controle de finanças pessoais mês a mês
              </p>
            </div>
          </div>

          {/* Ações principais */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={onRestoreSamples}
              title="Restaurar dados de exemplo para demonstração"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Restaurar</span> Exemplos
            </button>

            <button
              onClick={onNewTransaction}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nova Transação</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
