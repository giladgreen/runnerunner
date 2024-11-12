const HOUR = 60 * 60 * 1000;

export function getCurrentDate(date?: string | number) {
  return date ? new Date(date) : new Date();
}

export function getDayOfTheWeek(date?: Date) {
  let base = date ?? getCurrentDate();
  base = getCurrentDate(base.getTime() - 6 * HOUR);
  return base.toLocaleString('en-us', { weekday: 'long' });
}

export function getTodayShortDate(date?: string | number) {
  return getCurrentDate(getCurrentDate(date).getTime() - 6 * HOUR)
    .toISOString()
    .slice(0, 10);
}

export function getUpdatedAtFormat() {
  return getCurrentDate().toISOString();
}

export const formatDateToLocal = (dateStr: string, locale: string = 'he') => {
  const date = getCurrentDate(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    dateStyle: 'full',
    timeZone: 'Asia/Jerusalem',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const formatDateToLocalWithTime = (
  dateStr: string,
  locale: string = 'he',
) => {
  const date = formatDateToLocal(dateStr, locale);
  const dateObject = getCurrentDate(
    getCurrentDate(dateStr).getTime() + 2 * HOUR,
  );
  const time = `${dateObject.getHours()}:${dateObject.getMinutes()}`;
  const dateparts = date.split(',');
  return `${dateparts[1]}, ${dateparts[0]},  בשעה ${time}`;
};

export const getTime = (dateStr: string) => {
  const date = getCurrentDate(dateStr);
  const modifiedDate = getCurrentDate(date.getTime() + 3 * HOUR);
  return modifiedDate
    .toLocaleString('en-GB')
    .split(',')[1]
    .trim()
    .substring(0, 5);
};

export const formatTimePassedSince = (dateStr: string) => {
  const date = getCurrentDate(dateStr);
  const dateAsMiilis = date.getTime();
  // const now = getCurrentDate().getTime();
  // const modifiedNow = getCurrentDate(now - 2 * HOUR);
  const timePassedInMillis = (new Date()).getTime() - dateAsMiilis;
  const timePassedInSeconds = Math.floor(timePassedInMillis / 1000);

  if (timePassedInSeconds < 120){
    return 'לפני רגע';
  }

  if (timePassedInSeconds < 3600){
    return `לפני ${Math.floor(timePassedInSeconds / 60)} דקות`;
  }

  if (timePassedInSeconds < 7200){
      return 'לפני כשעה';
  }
  if (timePassedInSeconds < 86400){
    return `לפני ${Math.floor(timePassedInSeconds / 3600)} שעות`;
  }

  return formatDateToLocalWithTime(dateStr);
}
