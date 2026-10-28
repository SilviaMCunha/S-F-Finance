import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Calendar, 
  DollarSign, 
  FileText, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { 
  Transaction, 
  TransactionFormData, 
  TransactionType, 
  TransactionStatus 
} from '../types/finance';
import { 
  CATEGORIES_EXPENSE, 
  CATEGORIES_INCOME, 
  getTodayString 
} from '../utils/formatters';

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TransactionFormData, idToEdit?: string) => void;
  initialTransaction?: Transaction | null;
  defaultType?: TransactionType;
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTransaction,
  defaultType = 'expense',
}) => {
  const isEditing = !!initialTransaction;

  // Form state
  const [type, setType] = useState<TransactionType>(defaultType);
  const [title, setTitle] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [date, setDate] = useState(getTodayString());
  const [status, setStatus] = useState<TransactionStatus>('pending');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset or populate on open
  useEffect(() => {
    if (initialTransaction) {
      setType(initialTransaction.type);
      setTitle(initialTransaction.title);
      setAmountStr(String(initialTransaction.amount));
      setDate(initialTransaction.date);
      setStatus(initialTransaction.status);
      setCategory(initialTransaction.category || '');
      setDescription(initialTransaction.description || '');
    } else {
      setType(defaultType);
      setTitle('');
      setAmountStr('');
      setDate(getTodayString());
      setStatus('pending');
      setCategory(defaultType === 'income' ? CATEGORIES_INCOME[0] : CATEGORIES_EXPENSE[0]);
      setDescription('');
    }
    setErrors({});
  }, [initialTransaction, defaultType, isOpen]);

  // Altera categoria padrão se o tipo for trocado
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (!initialTransaction) {
      setCategory(newType === 'income' ? CATEGORIES_INCOME[0] : CATEGORIES_EXPENSE[0]);
    }
    // Ajustar status para o default correto se for incompatível
    if (newType === 'expense' && status === 'received') {
      setStatus('paid');
    } else if (newType === 'income' && status === 'paid') {
      setStatus('received');
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Por favor, informe o nome da receita ou despesa.';
    }

    const parsedAmount = parseFloat(amountStr.replace(',', '.'));
    if (!amountStr.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Informe um valor válido maior que zero (ex: 150,00).';
    }

    if (!date) {
      newErrors.date = 'Por favor, selecione a data correspondente.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedAmount = parseFloat(amountStr.replace(',', '.'));

    const formData: TransactionFormData = {
      type,
      title: title.trim(),
      amount: Math.round(parsedAmount * 100) / 100,
      date,
      status,
      category: category.trim() || (type === 'income' ? 'Outras Receitas' : 'Outras Despesas'),
      description: description.trim() || undefined,
    };

    onSave(formData, initialTransaction?.id);
    onClose();
  };

  if (!isOpen) return null;

  const categoryOptions = type === 'income' ? CATEGORIES_INCOME : CATEGORIES_EXPENSE;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Cabeçalho do Modal */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-slate-900">
              {isEditing ? 'Editar Registro Financeiro' : 'Novo Registro Financeiro'}
            </h2>
            <p className="text-xs text-slate-500">
              {isEditing 
                ? 'Atualize os dados da sua receita ou despesa.' 
                : 'Cadastre uma nova movimentação para manter suas finanças em dia.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário com scroll */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-slate-800">
          {/* Seletor de Tipo (Receita vs Despesa) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Tipo de Operação *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                  type === 'income'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>Receita (+)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                  type === 'expense'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-600/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Despesa (-)</span>
              </button>
            </div>
          </div>

          {/* Nome / Título */}
          <div>
            <label htmlFor="tx-title" className="block text-xs font-semibold text-slate-700 mb-1">
              Nome da {type === 'income' ? 'Receita' : 'Despesa'} *
            </label>
            <input
              id="tx-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'income' ? 'Ex: Salário, Projeto Freelance, Restituição' : 'Ex: Aluguel, Supermercado, Conta de Luz'}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.title
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-200/50'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
              </p>
            )}
          </div>

          {/* Valor e Data lado a lado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Valor */}
            <div>
              <label htmlFor="tx-amount" className="block text-xs font-semibold text-slate-700 mb-1">
                Valor (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                  R$
                </span>
                <input
                  id="tx-amount"
                  type="text"
                  inputMode="decimal"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  placeholder="0,00"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 transition-all ${
                    errors.amount
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-200/50'
                  }`}
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.amount}
                </p>
              )}
            </div>

            {/* Data (vencimento para despesa ou crédito para receita) */}
            <div>
              <label htmlFor="tx-date" className="block text-xs font-semibold text-slate-700 mb-1">
                {type === 'income' ? 'Data do Crédito Previsto *' : 'Data de Vencimento *'}
              </label>
              <div className="relative">
                <input
                  id="tx-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.date
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-200/50'
                  }`}
                />
              </div>
              {errors.date && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.date}
                </p>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Status da Conta *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {type === 'expense' ? (
                <>
                  <label className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all ${
                    status === 'pending'
                      ? 'bg-amber-50 border-amber-300 text-amber-900 ring-1 ring-amber-300'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="pending"
                      checked={status === 'pending'}
                      onChange={() => setStatus('pending')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span>A pagar (Pendente)</span>
                  </label>

                  <label className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all ${
                    status === 'paid'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-1 ring-emerald-300'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="paid"
                      checked={status === 'paid'}
                      onChange={() => setStatus('paid')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Já Pago
                    </span>
                  </label>
                </>
              ) : (
                <>
                  <label className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all ${
                    status === 'pending'
                      ? 'bg-blue-50 border-blue-300 text-blue-900 ring-1 ring-blue-300'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="pending"
                      checked={status === 'pending'}
                      onChange={() => setStatus('pending')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>A receber (Pendente)</span>
                  </label>

                  <label className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all ${
                    status === 'received'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-1 ring-emerald-300'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="received"
                      checked={status === 'received'}
                      onChange={() => setStatus('received')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Já Recebido
                    </span>
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label htmlFor="tx-category" className="block text-xs font-semibold text-slate-700 mb-1">
              Categoria
            </label>
            <select
              id="tx-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-200/50 transition-all bg-white cursor-pointer"
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Descrição (Opcional) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="tx-desc" className="block text-xs font-semibold text-slate-700">
                Descrição ou Observações <span className="text-slate-400 font-normal">(Opcional)</span>
              </label>
              <span className="text-[11px] text-slate-400">{description.length}/200</span>
            </div>
            <textarea
              id="tx-desc"
              rows={2}
              maxLength={200}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Pagar via PIX com desconto até o dia 10; comprovante guardado no e-mail..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-200/50 transition-all resize-none"
            />
          </div>

          {/* Botões do Rodapé */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
            >
              {isEditing ? 'Salvar Alterações' : 'Cadastrar Registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
