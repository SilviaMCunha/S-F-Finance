import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar, 
  Tag, 
  Edit3, 
  Trash2, 
  Check, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';
import { Transaction } from '../types/finance';
import { 
  formatCurrency, 
  formatDateBR, 
  getDateRelativeLabel 
} from '../utils/formatters';

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDeleteRequest: (transaction: Transaction) => void;
  onToggleStatus: (id: string) => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onEdit,
  onDeleteRequest,
  onToggleStatus,
}) => {
  const isIncome = transaction.type === 'income';
  const isCompleted = transaction.status === 'paid' || transaction.status === 'received';
  const relativeDate = getDateRelativeLabel(transaction.date, transaction.type, transaction.status);

  // Cores dinâmicas com base no status de urgência da data
  const getUrgencyBadge = () => {
    if (isCompleted) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          <Check className="w-3 h-3" />
          {isIncome ? 'Recebido' : 'Quitado'}
        </span>
      );
    }

    if (relativeDate.urgency === 'overdue') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 animate-pulse">
          <AlertTriangle className="w-3 h-3" />
          {relativeDate.label}
        </span>
      );
    }

    if (relativeDate.urgency === 'today') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
          <Clock className="w-3 h-3" />
          {relativeDate.label}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
        <Clock className="w-3 h-3 text-slate-400" />
        {relativeDate.label}
      </span>
    );
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-200 hover:shadow-md p-4 sm:p-5 ${
        isIncome
          ? 'border-emerald-200/80 hover:border-emerald-400/90'
          : 'border-rose-200/80 hover:border-rose-400/90'
      }`}
    >
      {/* Barra de destaque sutil no topo do card */}
      <div
        className={`absolute top-0 left-6 right-6 h-1 rounded-b-sm ${
          isIncome ? 'bg-emerald-500' : 'bg-rose-500'
        }`}
      />

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pt-1">
        {/* Lado Esquerdo: Ícone + Título + Categoria + Descrição */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
              isIncome
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                : 'bg-rose-100 text-rose-700 border border-rose-200'
            }`}
          >
            {isIncome ? (
              <ArrowDownLeft className="w-5 h-5" />
            ) : (
              <ArrowUpRight className="w-5 h-5" />
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-900 tracking-tight truncate">
                {transaction.title}
              </h3>
              {transaction.category && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  <Tag className="w-2.5 h-2.5 text-slate-400" />
                  {transaction.category}
                </span>
              )}
            </div>

            {/* Descrição opcional */}
            {transaction.description && (
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {transaction.description}
              </p>
            )}

            {/* Data e indicador de prazo */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <strong className="font-semibold text-slate-700">
                  {isIncome ? 'Crédito:' : 'Vencimento:'}
                </strong>{' '}
                {formatDateBR(transaction.date)}
              </span>

              {getUrgencyBadge()}
            </div>
          </div>
        </div>

        {/* Lado Direito: Valor + Botão de Status Rápido */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div
            className={`text-lg sm:text-xl font-extrabold tracking-tight ${
              isIncome ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {isIncome ? '+ ' : '- '}
            {formatCurrency(transaction.amount)}
          </div>

          {/* Botão interativo para mudar status */}
          <button
            onClick={() => onToggleStatus(transaction.id)}
            title="Clique para alternar o status da conta"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
              isCompleted
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
            }`}
          >
            {isCompleted ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isIncome ? 'Recebido' : 'Pago'}</span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>{isIncome ? 'Pendente' : 'Pendente'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Ações inferiores: Editar e Excluir com confirmação */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Tipo: <span className="font-medium text-slate-600">{isIncome ? 'Receita' : 'Despesa'}</span>
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(transaction)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Editar este registro"
          >
            <Edit3 className="w-3 h-3 text-slate-500" />
            <span>Editar</span>
          </button>

          <button
            onClick={() => onDeleteRequest(transaction)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
            title="Excluir este registro"
          >
            <Trash2 className="w-3 h-3 text-rose-500" />
            <span>Excluir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
