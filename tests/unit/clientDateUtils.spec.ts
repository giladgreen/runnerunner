import {
  formatDateToLocal,
  getCurrentDate,
  getDayOfTheWeek,
  getTime,
  getTodayDate,
} from '../../app/lib/clientDateUtils';

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
        const stringDate = '2021-01-07';
        const result = getDayOfTheWeek(stringDate);
        expect(result).toEqual('Wednesday');
      });
    });
    describe('when passing in a string of date with time', () => {
      it('should return correct day', async () => {
        const stringDate = '2021-01-07T01:00:00';
        const result = getDayOfTheWeek(stringDate);
        expect(result).toEqual('Wednesday');
      });
      it('should return correct day', async () => {
        const stringDate = '2021-01-07T08:00:00';
        const result = getDayOfTheWeek(stringDate);
        expect(result).toEqual('Thursday');
      });
      it('should return correct day', async () => {
        const stringDate = '2021-01-07T23:00:00';
        const result = getDayOfTheWeek(stringDate);
        expect(result).toEqual('Thursday');
      });
    });
    describe('when passing in a number', () => {
      it('should return correct day', async () => {
        const numberDate = 1723551171491;
        const result = getDayOfTheWeek(numberDate);
        expect(result).toEqual('Tuesday');
      });
    });
  });
  describe('getTodayDate', () => {
    it('should return correct date', async () => {
      const result = getTodayDate();
      expect(result).toEqual(new Date().toISOString().slice(0, 10));
    });
  });
});
