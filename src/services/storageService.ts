/**
 * Serviço de Armazenamento Local (localStorage) do S&F Finance
 * Responsável por persistir e gerenciar receitas e despesas sem necessidade de backend.
 */

import { Transaction, TransactionFormData } from '../types/finance';

const STORAGE_KEY = 'sf_finance_transactions_v1';
const INITIALIZED_FLAG_KEY = 'sf_finance_initialized_v1';

/**
 * Dados iniciais amigáveis para quem está começando agora, demonstrando receitas e despesas com vencimentos próximos.
 */
function createSampleTransactions(): Transaction[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  // Dias variados no mês corrente
  const d5 = `${year}-${month}-05`;
  const d10 = `${year}-${month}-10`;
  const d15 = `${year}-${month}-15`;
  const d20 = `${year}-${month}-20`;
  const d28 = `${year}-${month}-28`;

  return [
    {
      id: 'sf-sample-1',
      type: 'income',
      title: 'Salário Mensal',
      amount: 4200.0,
      description: 'Depósito em conta corrente da empresa',
      date: d5,
      status: 'received',
      category: 'Salário',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sf-sample-2',
      type: 'expense',
      title: 'Aluguel & Condomínio',
      amount: 1450.0,
      description: 'Boleto bancário via PIX',
      date: d10,
      status: 'paid',
      category: 'Moradia (Aluguel/Condomínio)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sf-sample-3',
      type: 'expense',
      title: 'Conta de Energia (Luz)',
      amount: 185.4,
      description: 'Vencimento na concessionária',
      date: d15,
      status: 'pending',
      category: 'Contas Básicas (Luz/Água/Gás)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sf-sample-4',
      type: 'income',
      title: 'Projeto Freelance',
      amount: 650.0,
      description: 'Consultoria de design e marketing',
      date: d20,
      status: 'pending',
      category: 'Freelance',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sf-sample-5',
      type: 'expense',
      title: 'Internet Fibra',
      amount: 119.9,
      description: 'Plano 500 Mega residencial',
      date: d28,
      status: 'pending',
      category: 'Contas Básicas (Luz/Água/Gás)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

export const storageService = {
  /**
   * Obtém todas as transações armazenadas no localStorage.
   * Se for a primeira execução da aplicação, carrega exemplos amigáveis e marca a inicialização.
   */
  getTransactions(): Transaction[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const isInitialized = localStorage.getItem(INITIALIZED_FLAG_KEY);

      if (stored !== null) {
        return JSON.parse(stored) as Transaction[];
      }

      // Se nunca foi inicializado, popula com dados de exemplo iniciais
      if (!isInitialized) {
        const samples = createSampleTransactions();
        this.saveTransactions(samples);
        localStorage.setItem(INITIALIZED_FLAG_KEY, 'true');
        return samples;
      }

      return [];
    } catch (error) {
      console.error('Erro ao ler dados do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva uma lista completa de transações no localStorage.
   */
  saveTransactions(transactions: Transaction[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Erro ao salvar dados no localStorage:', error);
    }
  },

  /**
   * Cadastra uma nova receita ou despesa.
   */
  addTransaction(data: TransactionFormData): Transaction {
    const transactions = this.getTransactions();
    const newTransaction: Transaction = {
      ...data,
      id: 'sf-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    transactions.push(newTransaction);
    this.saveTransactions(transactions);
    return newTransaction;
  },

  /**
   * Atualiza uma transação existente.
   */
  updateTransaction(id: string, updates: Partial<TransactionFormData>): Transaction | null {
    const transactions = this.getTransactions();
    const index = transactions.findIndex((t) => t.id === id);

    if (index === -1) return null;

    const updated: Transaction = {
      ...transactions[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    transactions[index] = updated;
    this.saveTransactions(transactions);
    return updated;
  },

  /**
   * Exclui uma transação com base no ID.
   */
  deleteTransaction(id: string): boolean {
    const transactions = this.getTransactions();
    const filtered = transactions.filter((t) => t.id !== id);

    if (filtered.length === transactions.length) {
      return false;
    }

    this.saveTransactions(filtered);
    return true;
  },

  /**
   * Alterna rapidamente o status da transação:
   * Despesa: pending <-> paid
   * Receita: pending <-> received
   */
  toggleStatus(id: string): Transaction | null {
    const transactions = this.getTransactions();
    const index = transactions.findIndex((t) => t.id === id);

    if (index === -1) return null;

    const current = transactions[index];
    let nextStatus = current.status;

    if (current.type === 'expense') {
      nextStatus = current.status === 'paid' ? 'pending' : 'paid';
    } else {
      nextStatus = current.status === 'received' ? 'pending' : 'received';
    }

    const updated: Transaction = {
      ...current,
      status: nextStatus,
      updatedAt: new Date().toISOString(),
    };

    transactions[index] = updated;
    this.saveTransactions(transactions);
    return updated;
  },

  /**
   * Restaura os dados de exemplo para o usuário
   */
  restoreSampleData(): Transaction[] {
    const samples = createSampleTransactions();
    this.saveTransactions(samples);
    localStorage.setItem(INITIALIZED_FLAG_KEY, 'true');
    return samples;
  },

  /**
   * Limpa todas as transações
   */
  clearAll(): void {
    this.saveTransactions([]);
    localStorage.setItem(INITIALIZED_FLAG_KEY, 'true');
  },
};
