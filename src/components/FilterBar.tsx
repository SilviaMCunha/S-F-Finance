import React from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Layers 
} from 'lucide-react';
import { SortOption, StatusFilterOption, TransactionType } from '../types/finance';

interface FilterBarProps {
  selectedType: 'all' | TransactionType;
  onSelectType: (type: 'all' | TransactionType) => void;
  statusFilter: StatusFilterOption;
  onSelectStatus: (status: StatusFilterOption) => void;
  sortBy: SortOption;
  onSelectSort: (sort: SortOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts: {
    all: number;
    income: number;
    expense: number;
    pending: number;
    completed: number;
  };
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedType,
  onSelectType,
  statusFilter,
  onSelectStatus,
  sortBy,
  onSelectSort,
  searchQuery,
  onSearchChange,
  counts,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3.5">
      {/* Linha superior: Abas por tipo e Busca */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Abas Tipo */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl overflow-x-auto">
          <button
            onClick={() => onSelectType('all')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedType === 'all'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Todas</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[11px]">
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => onSelectType('income')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedType === 'income'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Receitas</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[11px] ${
              selectedType === 'income' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {counts.income}
            </span>
          </button>

          <button
            onClick={() => onSelectType('expense')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedType === 'expense'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Despesas</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[11px] ${
              selectedType === 'expense' ? 'bg-rose-700 text-white' : 'bg-rose-100 text-rose-800'
            }`}>
              {counts.expense}
            </span>
          </button>
        </div>

        {/* Campo de Busca */}
        <div className="relative flex-1 lg:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nome ou descrição..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Linha inferior: Filtro por Status e Ordenação */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
        {/* Status rápido */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Status:
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSelectStatus('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => onSelectStatus('pending')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-amber-500 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/50'
              }`}
            >
              Pendentes ({counts.pending})
            </button>
            <button
              onClick={() => onSelectStatus('completed')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === 'completed'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/50'
              }`}
            >
              Concluídos ({counts.completed})
            </button>
          </div>
        </div>

        {/* Seletor de Ordenação */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label htmlFor="sort-select" className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" /> Ordenar por:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSelectSort(e.target.value as SortOption)}
            className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="nearestDate">Vencimento mais próximo (Padrão)</option>
            <option value="latestDate">Data mais distante</option>
            <option value="amountDesc">Maior valor (R$)</option>
            <option value="amountAsc">Menor valor (R$)</option>
            <option value="titleAsc">Nome alfabético (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
