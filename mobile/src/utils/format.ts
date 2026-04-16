export function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString));
}

export function formatRelativeVisit(dateString: string) {
  const visitDate = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - visitDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return 'Hoje';
  }

  if (diffDays === 1) {
    return 'Ontem';
  }

  return `${diffDays} dias atras`;
}

export function formatCurrency(value?: number) {
  if (value === undefined) {
    return '-';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatQuantity(value?: number) {
  if (value === undefined) {
    return '-';
  }

  return `${value} kg`;
}
