/**
 * Utilitários de formatação para S&F Finance
 */

export const CATEGORIES_INCOME = [
  'Salário',
  'Adiantamento',
  'Freelance',
  'Venda',
  'Rendimento',
  'Benefício',
  'Outras Receitas'
];

export const CATEGORIES_EXPENSE = [
  'Moradia (Aluguel/Condomínio)',
  'Contas Básicas (Luz/Água/Gás)',
  'Alimentação & Supermercado',
  'Transporte & Combustível',
  'Saúde & Farmácia',
  'Educação & Cursos',
  'Lazer & Assinaturas',
  'Cartão de Crédito',
  'Outras Despesas'
];

/**
 * Formata um valor numérico para a moeda brasileira (BRL)
 */
export function formatCurrency(value: number): string {
  if (isNaN(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Converte data YYYY-MM-DD para DD/MM/AAAA
 */
export function formatDateBR(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

/**
 * Retorna uma formatação humana e informativa sobre o prazo de vencimento/crédito
 */
export function getDateRelativeLabel(dateStr: string, type: 'income' | 'expense', status: string): { label: string; urgency: 'overdue' | 'today' | 'upcoming' | 'done' } {
  const isDone = status === 'paid' || status === 'received';
  if (isDone) {
    return {
      label: type === 'income' ? 'Recebido' : 'Pago',
      urgency: 'done',
    };
  }

  if (!dateStr) return { label: 'Sem data', urgency: 'upcoming' };

  const [year, month, day] = dateStr.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      label: type === 'expense' 
        ? `Venceu há ${overdueDays} ${overdueDays === 1 ? 'dia' : 'dias'}` 
        : `Previsto há ${overdueDays} ${overdueDays === 1 ? 'dia' : 'dias'}`,
      urgency: 'overdue',
    };
  } else if (diffDays === 0) {
    return {
      label: type === 'expense' ? 'Vence hoje!' : 'Crédito previsto hoje!',
      urgency: 'today',
    };
  } else if (diffDays === 1) {
    return {
      label: type === 'expense' ? 'Vence amanhã' : 'Crédito amanhã',
      urgency: 'upcoming',
    };
  } else if (diffDays <= 7) {
    return {
      label: type === 'expense' ? `Vence em ${diffDays} dias` : `Crédito em ${diffDays} dias`,
      urgency: 'upcoming',
    };
  } else {
    return {
      label: formatDateBR(dateStr),
      urgency: 'upcoming',
    };
  }
}

/**
 * Retorna o mês e ano corrente no padrão YYYY-MM
 */
export function getCurrentMonthYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Retorna o nome amigável do mês e ano (ex: "Outubro de 2026")
 */
export function formatMonthYear(monthYearStr: string): string {
  if (!monthYearStr || monthYearStr === 'all') return 'Todos os meses';
  const parts = monthYearStr.split('-');
  if (parts.length !== 2) return monthYearStr;
  
  const year = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const date = new Date(year, month, 1);

  const monthName = date.toLocaleDateString('pt-BR', { month: 'long' });
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  return `${capitalizedMonth} de ${year}`;
}

/**
 * Retorna a data de hoje no formato YYYY-MM-DD
 */
export function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
