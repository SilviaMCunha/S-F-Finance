import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Transaction } from '../types/finance';
import { formatCurrency, formatDateBR } from '../utils/formatters';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  transaction,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !transaction) return null;

  const isIncome = transaction.type === 'income';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-desc"
      >
        <div className="p-5 sm:p-6 text-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 id="delete-dialog-title" className="text-lg font-bold text-slate-900">
                Confirmar exclusão
              </h3>
              <p id="delete-dialog-desc" className="text-xs sm:text-sm text-slate-500 mt-1">
                Você tem certeza de que deseja remover esta {isIncome ? 'receita' : 'despesa'}? Esta ação não pode ser desfeita.
              </p>

              {/* Detalhes do item a ser excluído */}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                <div className="flex justify-between items-center text-sm font-semibold text-slate-900">
                  <span className="truncate pr-2">{transaction.title}</span>
                  <span className={isIncome ? 'text-emerald-600 shrink-0' : 'text-rose-600 shrink-0'}>
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>{transaction.category}</span>
                  <span>{formatDateBR(transaction.date)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={onCancel}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Sim, excluir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
