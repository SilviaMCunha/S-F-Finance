/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  MonthSelector 
} from './components/MonthSelector';
import { 
  SummaryCards 
} from './components/SummaryCards';
import { 
  FilterBar 
} from './components/FilterBar';
import { 
  TransactionCard 
} from './components/TransactionCard';
import { 
  TransactionFormModal 
} from './components/TransactionFormModal';
import { 
  ConfirmDeleteModal 
} from './components/ConfirmDeleteModal';
import { 
  EmptyState 
} from './components/EmptyState';
import { 
  Transaction, 
  TransactionFormData, 
  TransactionType, 
  SortOption, 
  StatusFilterOption, 
  FinancialSummary 
} from './types/finance';
import { storageService } from './services/storageService';
import { getCurrentMonthYear } from './utils/formatters';
import { CheckCircle2, Info, Plus } from 'lucide-react';

export default function App() {
  // Estado principal das transações
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mês selecionado (padrão: mês corrente YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState<string>(() => getCurrentMonthYear());

  // Filtros de interface
  const [selectedType, setSelectedType] = useState<'all' | TransactionType>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>('all');
  const [sortBy, setSortBy] = useState<SortOption>('nearestDate'); // Requisito: data de vencimento mais próxima para iniciar
  const [searchQuery, setSearchQuery] = useState('');

  // Modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [defaultFormType, setDefaultFormType] = useState<TransactionType>('expense');

  // Modal de exclusão com confirmação
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  // Mensagem de feedback temporária (toast simples e acolhedor)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3500);
  };

  // Carrega transações do serviço de armazenamento (localStorage)
  useEffect(() => {
    const loaded = storageService.getTransactions();
    setTransactions(loaded);
    setIsLoading(false);
  }, []);

  // Lista de meses que possuem registros cadastrados
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((tx) => {
      if (tx.date && tx.date.length >= 7) {
        set.add(tx.date.substring(0, 7));
      }
    });
    return Array.from(set).sort();
  }, [transactions]);

  // Transações filtradas por Mês
  const monthTransactions = useMemo(() => {
    if (selectedMonth === 'all') {
      return transactions;
    }
    return transactions.filter((tx) => tx.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  // Resumo Financeiro do mês em visualização
  const summary = useMemo<FinancialSummary>(() => {
    let totalIncome = 0;
    let totalExpenses = 0;
    let pendingIncome = 0;
    let receivedIncome = 0;
    let pendingExpenses = 0;
    let paidExpenses = 0;

    monthTransactions.forEach((tx) => {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
        if (tx.status === 'received') {
          receivedIncome += tx.amount;
        } else {
          pendingIncome += tx.amount;
        }
      } else {
        totalExpenses += tx.amount;
        if (tx.status === 'paid') {
          paidExpenses += tx.amount;
        } else {
          pendingExpenses += tx.amount;
        }
      }
    });

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      pendingIncome,
      receivedIncome,
      pendingExpenses,
      paidExpenses,
      transactionsCount: monthTransactions.length,
    };
  }, [monthTransactions]);

  // Contagens para os botões de filtro
  const filterCounts = useMemo(() => {
    let incomeCount = 0;
    let expenseCount = 0;
    let pendingCount = 0;
    let completedCount = 0;

    monthTransactions.forEach((tx) => {
      if (tx.type === 'income') incomeCount++;
      if (tx.type === 'expense') expenseCount++;
      if (tx.status === 'pending') pendingCount++;
      if (tx.status === 'paid' || tx.status === 'received') completedCount++;
    });

    return {
      all: monthTransactions.length,
      income: incomeCount,
      expense: expenseCount,
      pending: pendingCount,
      completed: completedCount,
    };
  }, [monthTransactions]);

  // Aplicação dos filtros secundários (Tipo, Status, Busca) e Ordenação
  const displayedTransactions = useMemo(() => {
    let list = [...monthTransactions];

    // Filtro por tipo
    if (selectedType !== 'all') {
      list = list.filter((tx) => tx.type === selectedType);
    }

    // Filtro por status
    if (statusFilter === 'pending') {
      list = list.filter((tx) => tx.status === 'pending');
    } else if (statusFilter === 'completed') {
      list = list.filter((tx) => tx.status === 'paid' || tx.status === 'received');
    }

    // Filtro por busca
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((tx) => {
        const titleMatch = tx.title.toLowerCase().includes(q);
        const descMatch = tx.description ? tx.description.toLowerCase().includes(q) : false;
        const catMatch = tx.category ? tx.category.toLowerCase().includes(q) : false;
        return titleMatch || descMatch || catMatch;
      });
    }

    // Ordenação
    list.sort((a, b) => {
      switch (sortBy) {
        case 'nearestDate':
          // Requisito: data de vencimento/crédito mais próxima no topo
          return a.date.localeCompare(b.date) || a.title.localeCompare(b.title);
        case 'latestDate':
          return b.date.localeCompare(a.date) || a.title.localeCompare(b.title);
        case 'amountDesc':
          return b.amount - a.amount;
        case 'amountAsc':
          return a.amount - b.amount;
        case 'titleAsc':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return list;
  }, [monthTransactions, selectedType, statusFilter, searchQuery, sortBy]);

  // Handlers de Ações
  const handleOpenCreateModal = (type: TransactionType = 'expense') => {
    setEditingTransaction(null);
    setDefaultFormType(type);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormModalOpen(true);
  };

  const handleSaveTransaction = (data: TransactionFormData, idToEdit?: string) => {
    if (idToEdit) {
      const updated = storageService.updateTransaction(idToEdit, data);
      if (updated) {
        setTransactions(storageService.getTransactions());
        showToast('Registro atualizado com sucesso!');
      }
    } else {
      const created = storageService.addTransaction(data);
      setTransactions(storageService.getTransactions());
      showToast(`${created.type === 'income' ? 'Receita cadastrada' : 'Despesa cadastrada'} com sucesso!`);
    }
  };

  const handleDeleteRequest = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (transactionToDelete) {
      storageService.deleteTransaction(transactionToDelete.id);
      setTransactions(storageService.getTransactions());
      showToast('Registro excluído com sucesso.');
      setTransactionToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleToggleStatus = (id: string) => {
    const updated = storageService.toggleStatus(id);
    if (updated) {
      setTransactions(storageService.getTransactions());
      const label = updated.status === 'paid' 
        ? 'Despesa marcada como Paga!' 
        : updated.status === 'received'
        ? 'Receita marcada como Recebida!'
        : 'Status retornado para Pendente.';
      showToast(label);
    }
  };

  const handleRestoreSamples = () => {
    const samples = storageService.restoreSampleData();
    setTransactions(samples);
    showToast('Exemplos práticos restaurados com sucesso!');
  };

  const handleClearFilters = () => {
    setSelectedType('all');
    setStatusFilter('all');
    setSearchQuery('');
  };

  const isFilteringActive = selectedType !== 'all' || statusFilter !== 'all' || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Cabeçalho */}
      <Header
        onNewTransaction={() => handleOpenCreateModal('expense')}
        onRestoreSamples={handleRestoreSamples}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Banner acolhedor de boas-vindas / dica rápida */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/60 rounded-2xl border border-emerald-100/90 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-emerald-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-emerald-950">
                Seu espaço de controle financeiro descomplicado
              </h2>
              <p className="text-xs sm:text-sm text-emerald-800/90">
                Cadastre suas receitas e despesas com vencimentos. Seus dados ficam salvos automaticamente no seu navegador.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
            <button
              onClick={() => handleOpenCreateModal('income')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-white hover:bg-emerald-100/70 border border-emerald-200 rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>+ Receita</span>
            </button>
            <button
              onClick={() => handleOpenCreateModal('expense')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-800 bg-white hover:bg-rose-50 border border-rose-200 rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-rose-600" />
              <span>+ Despesa</span>
            </button>
          </div>
        </div>

        {/* Navegação Mês a Mês */}
        <MonthSelector
          currentMonthYear={selectedMonth}
          onChangeMonth={setSelectedMonth}
          availableMonths={availableMonths}
          totalTransactionsInView={monthTransactions.length}
        />

        {/* Cartões de Resumo do Mês */}
        <SummaryCards summary={summary} />

        {/* Barra de Filtros, Abas e Ordenação */}
        <FilterBar
          selectedType={selectedType}
          onSelectType={setSelectedType}
          statusFilter={statusFilter}
          onSelectStatus={setStatusFilter}
          sortBy={sortBy}
          onSelectSort={setSortBy}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          counts={filterCounts}
        />

        {/* Lista de Transações em Cartões */}
        <section aria-label="Lista de transações" className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              {selectedType === 'income'
                ? 'Receitas do Período'
                : selectedType === 'expense'
                ? 'Despesas do Período'
                : 'Todas as Transações'}
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Ordenado por: <span className="font-semibold text-slate-700">Vencimento mais próximo</span>
            </span>
          </div>

          {displayedTransactions.length === 0 ? (
            <EmptyState
              isFiltered={isFilteringActive || monthTransactions.length > 0}
              onNewTransaction={() => handleOpenCreateModal('expense')}
              onClearFilters={handleClearFilters}
              onRestoreSamples={handleRestoreSamples}
            />
          ) : (
            <div className="grid grid-cols-1 gap-3.5">
              {displayedTransactions.map((tx) => (
                <TransactionCard
                  key={tx.id}
                  transaction={tx}
                  onEdit={handleOpenEditModal}
                  onDeleteRequest={handleDeleteRequest}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Rodapé Acolhedor */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-1">
          <p className="font-medium text-slate-600">
            S&F Finance — Organização pessoal e financeira com leveza e clareza.
          </p>
          <p>
            Todos os seus dados estão seguros e salvos localmente neste navegador (localStorage).
          </p>
        </div>
      </footer>

      {/* Modal de Cadastro / Edição */}
      <TransactionFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveTransaction}
        initialTransaction={editingTransaction}
        defaultType={defaultFormType}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        transaction={transactionToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setTransactionToDelete(null);
        }}
      />

      {/* Notificação Toast amigável */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/20 text-xs sm:text-sm font-medium animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
