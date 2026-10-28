import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { FinancialSummary } from '../types/finance';
import { formatCurrency } from '../utils/formatters';

interface SummaryCardsProps {
  summary: FinancialSummary;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const isPositiveBalance = summary.balance > 0;
  const isZeroBalance = summary.balance === 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card Receitas */}
      <div className="bg-white rounded-2xl border border-emerald-100 p-4 sm:p-5 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 opacity-70" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Receitas (Entradas)
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
            {formatCurrency(summary.totalIncome)}
          </div>
          <div className="flex flex-col gap-1 text-xs text-slate-500 border-t border-slate-100 pt-2.5">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="w-3 h-3" /> Já recebido:
              </span>
              <span className="font-semibold text-slate-700">{formatCurrency(summary.receivedIncome)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1 text-slate-500">
                <Clock className="w-3 h-3" /> A receber:
              </span>
              <span className="font-medium text-slate-600">{formatCurrency(summary.pendingIncome)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Despesas */}
      <div className="bg-white rounded-2xl border border-rose-100 p-4 sm:p-5 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -z-0 opacity-70" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-800">
              Despesas (Saídas)
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
            {formatCurrency(summary.totalExpenses)}
          </div>
          <div className="flex flex-col gap-1 text-xs text-slate-500 border-t border-slate-100 pt-2.5">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1 text-slate-600">
                <CheckCircle2 className="w-3 h-3 text-slate-500" /> Já pago:
              </span>
              <span className="font-semibold text-slate-700">{formatCurrency(summary.paidExpenses)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1 text-rose-700">
                <Clock className="w-3 h-3 text-rose-600" /> A pagar:
              </span>
              <span className="font-semibold text-rose-700">{formatCurrency(summary.pendingExpenses)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Saldo Líquido */}
      <div className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs relative overflow-hidden ${
        isPositiveBalance
          ? 'border-teal-200'
          : isZeroBalance
          ? 'border-slate-200'
          : 'border-amber-200'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Saldo do Período
          </span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            isPositiveBalance
              ? 'bg-teal-100 text-teal-700'
              : isZeroBalance
              ? 'bg-slate-100 text-slate-700'
              : 'bg-amber-100 text-amber-700'
          }`}>
            <Scale className="w-5 h-5" />
          </div>
        </div>
        <div className={`text-2xl font-bold tracking-tight mb-2 ${
          isPositiveBalance
            ? 'text-teal-700'
            : isZeroBalance
            ? 'text-slate-800'
            : 'text-amber-700'
        }`}>
          {formatCurrency(summary.balance)}
        </div>
        <div className="text-xs border-t border-slate-100 pt-2.5 flex items-center gap-1.5">
          {isPositiveBalance ? (
            <span className="text-teal-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Suas finanças estão positivas!
            </span>
          ) : isZeroBalance ? (
            <span className="text-slate-500 font-medium">Contas e receitas equilibradas.</span>
          ) : (
            <span className="text-amber-700 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Atenção: despesas excedem receitas.
            </span>
          )}
        </div>
      </div>

      {/* Card Status de Pendências */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Controle de Contas
          </span>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
          {summary.pendingExpenses > 0 ? (
            <span className="text-rose-600">Pendente</span>
          ) : summary.transactionsCount > 0 ? (
            <span className="text-emerald-600">Em dia!</span>
          ) : (
            <span className="text-slate-400">-</span>
          )}
        </div>
        <div className="text-xs text-slate-500 border-t border-slate-100 pt-2.5 flex flex-col gap-0.5">
          <span>
            {summary.pendingExpenses > 0
              ? `Você tem despesas pendentes a quitar neste período.`
              : `Nenhuma despesa pendente em atraso.`}
          </span>
        </div>
      </div>
    </div>
  );
};
