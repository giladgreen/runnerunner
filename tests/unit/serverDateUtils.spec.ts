import {
  formatDateToLocal,
  getCurrentDate,
  getDayOfTheWeek,
  getTime,
  getTodayShortDate,
  formatDateToLocalWithTime,
} from '../../app/lib/serverDateUtils';

describe('test utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentDate', () => {
    describe('when not passing anything in', () => {
      it('should return current date;', async () => {
        const now = new Date();
        const result = getCurrentDate();
        expect(result.getTime() - now.getTime() < 100).toBeTruthy();
      });
    });
    describe('when passing in a string', () => {
      it('should return current date;', async () => {
        const stringDate = '2021-01-01';
        const date = new Date(stringDate);
        const result = getCurrentDate(stringDate);
        expect(result).toEqual(date);
      });
    });
    describe('when passing in a number', () => {
      it('should return current date;', async () => {
        const numberDate = 1723551171491;
        const date = new Date(numberDate);
        const result = getCurrentDate(numberDate);
        expect(result).toEqual(date);
      });
    });
  });
  describe('formatDateToLocal', () => {
    describe('when passing in a string of date only', () => {
      it('should return correct format', async () => {
        const stringDate = '2021-01-01';
        const result = formatDateToLocal(stringDate);
        expect(result).toEqual('יום שישי, 1 בינואר 2021');
      });
    });
    describe('when passing in a string of date with time', () => {
      it('should return correct format', async () => {
        const stringDate = '2021-01-01T03:00:00';
        const result = formatDateToLocal(stringDate);
        expect(result).toEqual('יום שישי, 1 בינואר 2021');
      });
      it('should return correct format', async () => {
        const stringDate = '2021-01-01T23:00:00';
        const result = formatDateToLocal(stringDate);
        expect(result).toEqual('יום שישי, 1 בינואר 2021');
      });
    });
  });
  describe('getTime', () => {
    describe('when passing in a string of date only', () => {
      it('should return correct format', async () => {
        const stringDate = '2021-01-01';
        const result = getTime(stringDate);
        expect(result).toEqual('05:00');
      });
    });
    describe('when passing in a string of date with time', () => {
      it('should return correct format', async () => {
        const stringDate = '2021-01-01T01:00:00';
        const result = getTime(stringDate);
        expect(result).toEqual('04:00');
      });
      it('should return correct format', async () => {
        const stringDate = '2021-01-01T23:00:00';
        const result = getTime(stringDate);
        expect(result).toEqual('02:00');
      });
    });
  });
  describe('getDayOfTheWeek', () => {
    describe('when not passing in anything', () => {
      it('should return correct day', async () => {
        const result = getDayOfTheWeek();
        expect(result).toEqual(
          new Date().toLocaleString('en-us', { weekday: 'long' }),
        );
      });
    });
    describe('when passing in a string of date only', () => {
      it('should return correct day', async () => {
        const date = new Date('2021-01-07');
        const result = getDayOfTheWeek(date);
        expect(result).toEqual('Wednesday');
      });
    });
    describe('when passing in a string of date with time', () => {
      it('should return correct day', async () => {
        const date = new Date('2021-01-07T01:00:00');
        const result = getDayOfTheWeek(date);
        expect(result).toEqual('Wednesday');
      });
      it('should return correct day', async () => {
        const date = new Date('2021-01-07T08:00:00');
        const result = getDayOfTheWeek(date);
        expect(result).toEqual('Thursday');
      });
      it('should return correct day', async () => {
        const date = new Date('2021-01-07T23:00:00');
        const result = getDayOfTheWeek(date);
        expect(result).toEqual('Thursday');
      });
    });
    describe('when passing in a number', () => {
      it('should return correct day', async () => {
        const date = new Date(1723551171491);
        const result = getDayOfTheWeek(date);
        expect(result).toEqual('Tuesday');
      });
    });
  });

  describe('getTodayShortDate', () => {
    describe('when not passing any argument', () => {
      it('should return correct date', async () => {
        const result = getTodayShortDate();
        expect(result).toEqual(new Date().toISOString().slice(0, 10));
      });
    });
    describe('when passing a string date', () => {
      it('should return correct date', async () => {
        const stringDate = '2021-01-09T01:00:00';
        const result = getTodayShortDate(stringDate);
        const expected = '2021-01-08';
        expect(result).toEqual(expected);
      });
      it('should return correct date', async () => {
        const stringDate = '2021-01-09T05:00:00';
        const result = getTodayShortDate(stringDate);
        const expected = '2021-01-08';
        expect(result).toEqual(expected);
      });
      it('should return correct date', async () => {
        const stringDate = '2021-01-09T07:00:00';
        const result = getTodayShortDate(stringDate);
        const expected = '2021-01-08';
        expect(result).toEqual(expected);
      });
      it('should return correct date', async () => {
        const stringDate = '2021-01-09T08:00:00';
        const result = getTodayShortDate(stringDate);
        const expected = '2021-01-09';
        expect(result).toEqual(expected);
      });
      it('should return correct date', async () => {
        const stringDate = '2021-01-09T09:00:00';
        const result = getTodayShortDate(stringDate);
        const expected = '2021-01-09';
        expect(result).toEqual(expected);
      });
      it('should return correct date', async () => {
        const stringDate = '2021-01-09T23:00:00';
        const result = getTodayShortDate(stringDate);
        const expected = '2021-01-09';
        expect(result).toEqual(expected);
      });
    });
  });
  describe('formatDateToLocalWithTime', () => {
    describe('when passing an empty string argument', () => {
      it('should return current time', async () => {
        const dateStr = '';
        const result = formatDateToLocalWithTime(dateStr);

        const options: Intl.DateTimeFormatOptions = {
          dateStyle: 'full',
          timeZone: 'Asia/Jerusalem',
        };
        const formatter = new Intl.DateTimeFormat('he', options);
        const date = formatter.format(new Date());
        const dateObject = new Date(new Date().getTime() + 3 * 60 * 60 * 1000);
        expect(result).toEqual(
          `${dateObject.getHours()}:${dateObject.getMinutes()},     ${date}`,
        );
      });
    });
    describe('when passing a string argument', () => {
      it('should return current time', async () => {
        const dateStr = '2024-08-16T12:07:45.332Z';
        const result = formatDateToLocalWithTime(dateStr);

        const options: Intl.DateTimeFormatOptions = {
          dateStyle: 'full',
          timeZone: 'Asia/Jerusalem',
        };
        const formatter = new Intl.DateTimeFormat('he', options);
        const date = formatter.format(new Date());
        const dateObject = new Date(
          new Date('2024-08-16T12:07:45.332Z').getTime() + 3 * 60 * 60 * 1000,
        );
        expect(result).toEqual(
          `${dateObject.getHours()}:${dateObject.getMinutes()},     ${date}`,
        );
      });
    });
  });
});
