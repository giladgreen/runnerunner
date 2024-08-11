const HOUR = 60 * 60 * 1000;


export function getCurrentDate(date?: string | number){
    return date ? new Date(date) : new Date();
}


export function getDayOfTheWeek(date?: Date) {
    const base = date ?? getCurrentDate();
    return base.toLocaleString('en-us', { weekday: 'long' });
}

export function getTodayShortDate(date?: string | number) {//TODO: might need to adjust date to israel time - check where we call it from
    return getCurrentDate(date).toISOString().slice(0, 10);
}

export function getUpdatedAtFormat() {
    return getCurrentDate().toISOString()
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
    const dateObject = getCurrentDate(getCurrentDate(dateStr).getTime() + 3 * HOUR);
    const time = `${dateObject.getHours()}:${dateObject.getMinutes()}`;

    return `${time},     ${date}`;
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
