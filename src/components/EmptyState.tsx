import React from 'react';
import { PlusCircle, PiggyBank, SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  onNewTransaction: () => void;
  onClearFilters?: () => void;
  onRestoreSamples?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onNewTransaction,
  onClearFilters,
  onRestoreSamples,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">
          Nenhuma transação encontrada
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          Não encontramos despesas ou receitas para os filtros ou busca aplicados neste período. Tente alterar os critérios.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Limpar filtros
            </button>
          )}
          <button
            onClick={onNewTransaction}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Adicionar nova transação</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs">
      <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-sm shadow-emerald-500/10">
        <PiggyBank className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        Suas finanças organizadas começam aqui!
      </h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-6">
        Você ainda não possui receitas ou despesas cadastradas neste período. Dê o primeiro passo registrando uma conta a pagar ou um valor a receber.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onNewTransaction}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Cadastrar Primeira Transação</span>
        </button>

        {onRestoreSamples && (
          <button
            onClick={onRestoreSamples}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Carregar Exemplos Práticos</span>
          </button>
        )}
      </div>
    </div>
  );
};
