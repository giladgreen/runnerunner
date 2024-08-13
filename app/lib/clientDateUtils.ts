'use client';

const HOUR = 60 * 60 * 1000;

export function getCurrentDate(date?: string | number){
    return date ? new Date(date) : new Date();
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

export const getTime = (serverDateStr: string) => {
    const date = getCurrentDate(serverDateStr);
    const modifiedDate = getCurrentDate(date.getTime() + 3 * HOUR);
    return modifiedDate
        .toLocaleString('en-GB')
        .split(',')[1]
        .trim()
        .substring(0, 5);
};

export function getDayOfTheWeek(date?: string | number){
    let base = date ? getCurrentDate(date) : getCurrentDate();
    base = getCurrentDate(base.getTime() -(6 * HOUR));
    return base.toLocaleString('en-us', { weekday: 'long' });
}

export function getTodayDate(){
    return  getCurrentDate().toISOString().slice(0, 10);
}

