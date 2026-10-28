import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, CalendarDays } from 'lucide-react';
import { formatMonthYear, getCurrentMonthYear } from '../utils/formatters';

interface MonthSelectorProps {
  currentMonthYear: string; // YYYY-MM ou 'all'
  onChangeMonth: (monthYear: string) => void;
  availableMonths: string[]; // Lista de meses com dados
  totalTransactionsInView: number;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  currentMonthYear,
  onChangeMonth,
  availableMonths,
  totalTransactionsInView,
}) => {
  const currentActualMonth = getCurrentMonthYear();

  // Navegação para mês anterior
  const handlePrevMonth = () => {
    if (currentMonthYear === 'all') {
      onChangeMonth(currentActualMonth);
      return;
    }
    const [yearStr, monthStr] = currentMonthYear.split('-');
    let year = Number(yearStr);
    let month = Number(monthStr) - 1;
    if (month < 1) {
      month = 12;
      year -= 1;
    }
    const formatted = `${year}-${String(month).padStart(2, '0')}`;
    onChangeMonth(formatted);
  };

  // Navegação para próximo mês
  const handleNextMonth = () => {
    if (currentMonthYear === 'all') {
      onChangeMonth(currentActualMonth);
      return;
    }
    const [yearStr, monthStr] = currentMonthYear.split('-');
    let year = Number(yearStr);
    let month = Number(monthStr) + 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
    const formatted = `${year}-${String(month).padStart(2, '0')}`;
    onChangeMonth(formatted);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Controle Mês a Mês */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Mês anterior"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 border border-slate-200/70 rounded-xl min-w-[200px] justify-center">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-800 text-sm sm:text-base">
              {formatMonthYear(currentMonthYear)}
            </span>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Próximo mês"
            aria-label="Próximo mês"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Atalhos rápidos e contador */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          <button
            onClick={() => onChangeMonth(currentActualMonth)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              currentMonthYear === currentActualMonth
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Mês Atual
          </button>

          <button
            onClick={() => onChangeMonth('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              currentMonthYear === 'all'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" />
              Todos os Meses
            </span>
          </button>

          <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg ml-auto sm:ml-0 font-medium">
            {totalTransactionsInView} {totalTransactionsInView === 1 ? 'registro' : 'registros'}
          </span>
        </div>
      </div>
    </div>
  );
};
