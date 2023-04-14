export const formatStringDate = (date: Date) => {
  const monthYear = date
    .toLocaleString('es-ES', {
      month: 'long',
      year: 'numeric',
    })
    .split('de');
  return monthYear.join('/');
}

export const formatStringPickDate = (date: Date) => {
  const monthYear = date
    .toLocaleString('es-ES', {
      month: 'numeric',
      year: 'numeric',
    })
    .split('/');
  const yearMonth = [monthYear[1], Number(monthYear[0]) <= 9 ? `0${monthYear[0]}` : monthYear[0] ];
  return yearMonth.join('-');
}