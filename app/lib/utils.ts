const HOUR = 60 * 60 * 1000;

export const formatCurrency = (balance: number) => {
  const res = (balance).toLocaleString('en-US', {
    style: 'currency',
    currency: 'ILS',
  })

  const shortenedString = res. substring(0, res. length - 3);

  return shortenedString;
};

export const formatType = (type: string) => {
  if (type === 'credit') {
    return 'קרדיט';
  }
  if (type === 'credit_by_other') {
    return 'קרדיט של מישהו אחר';
  }
  if (type === 'credit_to_other') {
    return 'קרדיט לטובת מישהו אחר';
  }
  if (type === 'wire') {
    return 'העברה בנקאית';
  }
  if (type === 'cash') {
    return 'מזומן';
  }

  if (type === 'prize') {
    return 'פרס';
  }

  return type;
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'he',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    dateStyle: 'full',
    // timeStyle: 'long',
    timeZone: 'Asia/Jerusalem',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};



export const getTime = (
  dateStr: string,
) => {
  const date = new Date(dateStr);
  const modifiedDate = new Date(date.getTime() + 3 * HOUR);
  return  modifiedDate.toLocaleString("en-GB").split(',')[1].trim().substring(0, 5);

};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
