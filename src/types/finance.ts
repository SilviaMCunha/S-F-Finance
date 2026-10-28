/**
 * Tipos de dados para o S&F Finance
 */

export type TransactionType = 'income' | 'expense';

export type IncomeStatus = 'pending' | 'received';
export type ExpenseStatus = 'pending' | 'paid';

export type TransactionStatus = IncomeStatus | ExpenseStatus;

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  description?: string;
  /** Data no formato YYYY-MM-DD (vencimento para despesa, crédito para receita) */
  date: string;
  status: TransactionStatus;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionFormData = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;

export type SortOption = 
  | 'nearestDate' 
  | 'latestDate' 
  | 'amountDesc' 
  | 'amountAsc' 
  | 'titleAsc';

export type StatusFilterOption = 'all' | 'pending' | 'completed';

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  pendingIncome: number;
  receivedIncome: number;
  pendingExpenses: number;
  paidExpenses: number;
  transactionsCount: number;
}
