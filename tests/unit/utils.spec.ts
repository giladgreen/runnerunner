import {
  formatCurrency,
  formatType,
  generatePagination,
  positionComparator,
  phoneNumberComparator,
  nameComparator,
  sumArrayByProp,
} from '../../app/lib/utils';
import { PlayerDB, UserDB } from '../..//app/lib/definitions';
import {formatDateToLocal, getDayOfTheWeek, getTime, getTodayShortDate} from "../../app/lib/serverDateUtils";

describe('test utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('formatCurrency', () => {
    describe('when legal positive amount', () => {
      it('should return correct format', async () => {
        const result = formatCurrency(100);
        expect(result).toEqual('₪100');
      });
    });
    describe('when legal positive amount', () => {
      it('should return correct format', async () => {
        const result = formatCurrency(-999);
        expect(result).toEqual('-₪999');
      });
    });
    describe('when positive amount - with dot', () => {
      it('should return correct format', async () => {
        const result = formatCurrency(100.5);
        expect(result).toEqual('₪100');
      });
    });
  });

  describe('formatType', () => {
    describe('when type is credit', () => {
      it('should return correct translation', async () => {
        const result = formatType('credit');
        expect(result).toEqual('קרדיט');
      });
    });
    describe('when type is credit_by_other', () => {
      it('should return correct translation', async () => {
        const result = formatType('credit_by_other');
        expect(result).toEqual('קרדיט של מישהו אחר');
      });
    });
    describe('when type is credit_to_other', () => {
      it('should return correct translation', async () => {
        const result = formatType('credit_to_other');
        expect(result).toEqual('קרדיט לטובת מישהו אחר');
      });
    });
    describe('when type is wire', () => {
      it('should return correct translation', async () => {
        const result = formatType('wire');
        expect(result).toEqual('העברה בנקאית');
      });
    });
    describe('when type is cash', () => {
      it('should return correct translation', async () => {
        const result = formatType('cash');
        expect(result).toEqual('מזומן');
      });
    });
    describe('when type is prize', () => {
      it('should return correct translation', async () => {
        const result = formatType('prize');
        expect(result).toEqual('פרס');
      });
    });
    describe('when type is unknown', () => {
      it('should return correct translation', async () => {
        const result = formatType('xxxx');
        expect(result).toEqual('xxxx');
      });
    });
  });

  describe('formatDateToLocal', () => {
    describe('when input is legal date', () => {
      it('should return correct value', async () => {
        const result = formatDateToLocal(new Date('2024-04-23').toISOString());
        expect(result).toEqual('יום שלישי, 23 באפריל 2024');
      });
    });
    describe('when input is ilegal date', () => {
      it('should return correct value', async () => {
        const result = formatDateToLocal(new Date('2024-02-31').toISOString());
        expect(result).toEqual('יום שבת, 2 במרץ 2024');
      });
    });
  });

  describe('getTime', () => {
    describe('when input is date time string', () => {
      it('should return correct time', async () => {
        const result = getTime('2024-07-11T17:28:55.598Z');
        expect(result).toEqual('23:28');
      });
      it('should return correct time', async () => {
        const result = getTime('2024-07-11T18:28:55.598Z');
        expect(result).toEqual('00:28');
      });
      it('should return correct time', async () => {
        const result = getTime('2024-07-11T19:28:55.598Z');
        expect(result).toEqual('01:28');
      });
      it('should return correct time', async () => {
        const result = getTime('2024-07-11T20:28:55.598Z');
        expect(result).toEqual('02:28');
      });
      it('should return correct time', async () => {
        const result = getTime('2024-07-11T21:28:55.598Z');
        expect(result).toEqual('03:28');
      });
    });
  });

  describe('generatePagination', () => {
    describe('when totalPages <= 7', () => {
      it('should return correct value', async () => {
        const result = generatePagination(0, 1);
        expect(result).toEqual([1]);
      });
      it('should return correct value', async () => {
        const result = generatePagination(0, 4);
        expect(result).toEqual([1, 2, 3, 4]);
      });
      it('should return correct value', async () => {
        const result = generatePagination(0, 7);
        expect(result).toEqual([1, 2, 3, 4, 5, 6, 7]);
      });
      it('should return correct value', async () => {
        const result = generatePagination(8, 3);
        expect(result).toEqual([1, 2, 3]);
      });
    });
    describe('when totalPages > 7 AND currentPage <= 3', () => {
      it('should return correct value', async () => {
        const result = generatePagination(0, 10);
        expect(result).toEqual([1, 2, 3, '...', 9, 10]);
      });
      it('should return correct value', async () => {
        const result = generatePagination(1, 10);
        expect(result).toEqual([1, 2, 3, '...', 9, 10]);
      });
      it('should return correct value', async () => {
        const result = generatePagination(3, 10);
        expect(result).toEqual([1, 2, 3, '...', 9, 10]);
      });
    });
    describe('when totalPages > 7 AND currentPage >= totalPages - 2', () => {
      it('should return correct value', async () => {
        const result = generatePagination(8, 10);
        expect(result).toEqual([1, 2, '...', 8, 9, 10]);
      });
      it('should return correct value', async () => {
        const result = generatePagination(9, 10);
        expect(result).toEqual([1, 2, '...', 8, 9, 10]);
      });
      it('should return correct value', async () => {
        const result = generatePagination(20, 10);
        expect(result).toEqual([1, 2, '...', 8, 9, 10]);
      });
    });
    describe('when default', () => {
      it('should return correct value', async () => {
        const result = generatePagination(5, 10);
        expect(result).toEqual([1, '...', 4, 5, 6, '...', 10]);
      });
      it('should return correct value', async () => {
        const result = generatePagination(10, 20);
        expect(result).toEqual([1, '...', 9, 10, 11, '...', 20]);
      });
    });
  });

  describe('positionComparator', () => {
    describe('when given 2 players', () => {
      it('should return correct position order ', async () => {
        const playerA = {
          position: 1,
        } as PlayerDB;
        const playerB = {
          position: 2,
        } as PlayerDB;
        const result = positionComparator(playerA, playerB);
        expect(result).toEqual(-1);
      });
      it('should return correct position order ', async () => {
        const playerA = {
          position: 2,
        } as PlayerDB;
        const playerB = {
          position: 1,
        } as PlayerDB;
        const result = positionComparator(playerA, playerB);
        expect(result).toEqual(1);
      });
      it('should return correct position order ', async () => {
        const playerA = {
          position: 2,
        } as PlayerDB;
        const playerB = {
          position: 2,
        } as PlayerDB;
        const result = positionComparator(playerA, playerB);
        expect(result).toEqual(1);
      });
    });
  });

  describe('nameComparator', () => {
    describe('when given 2 players', () => {
      it('should return correct position order ', async () => {
        const playerA = {
          name: 'a',
        } as PlayerDB;
        const playerB = {
          name: 'b',
        } as PlayerDB;
        const result = nameComparator(playerA, playerB);
        expect(result).toEqual(-1);
      });
      it('should return correct position order ', async () => {
        const playerA = {
          name: 'b',
        } as PlayerDB;
        const playerB = {
          name: 'a',
        } as PlayerDB;
        const result = nameComparator(playerA, playerB);
        expect(result).toEqual(1);
      });
      it('should return correct position order ', async () => {
        const playerA = {
          name: 'b',
        } as PlayerDB;
        const playerB = {
          name: 'b',
        } as PlayerDB;
        const result = nameComparator(playerA, playerB);
        expect(result).toEqual(1);
      });
    });
  });

  describe('phoneNumberComparator', () => {
    describe('when given 2 users', () => {
      it('should return correct phone number order ', async () => {
        const playerA = {
          phone_number: '0587869910',
        } as UserDB;
        const playerB = {
          phone_number: '0542609910',
        } as UserDB;
        const result = phoneNumberComparator(playerA, playerB);
        expect(result).toEqual(1);
      });
      it('should return correct phone number order ', async () => {
        const playerA = {
          phone_number: '0542609910',
        } as UserDB;
        const playerB = {
          phone_number: '0587869910',
        } as UserDB;
        const result = phoneNumberComparator(playerA, playerB);
        expect(result).toEqual(-1);
      });
      it('should return correct phone number order ', async () => {
        const playerA = {
          phone_number: '0587869910',
        } as UserDB;
        const playerB = {
          phone_number: '0587869910',
        } as UserDB;
        const result = phoneNumberComparator(playerA, playerB);
        expect(result).toEqual(1);
      });
    });
  });

  describe('getTodayShortDate', () => {
    describe('when ', () => {
      it('should return correct val', async () => {
        const result = getTodayShortDate();
        const expectedResult = new Date().toISOString().slice(0, 10);
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('getDayOfTheWeek', () => {
    describe('when given a date', () => {
      it('should return correct day of the week', async () => {
        const result = getDayOfTheWeek(new Date('2024-06-11T23:00:00'));
        expect(result).toEqual('Tuesday');
      });
      it('should return correct day of the week', async () => {
        const result = getDayOfTheWeek(new Date('2024-06-12T03:00:00'));
        expect(result).toEqual('Tuesday');
      });
      it('should return correct day of the week', async () => {
        const result = getDayOfTheWeek(new Date('2024-07-11T23:00:00'));
        expect(result).toEqual('Thursday');
      });
      it('should return correct day of the week', async () => {
        const result = getDayOfTheWeek(new Date('2024-07-12T05:00:00'));
        expect(result).toEqual('Thursday');
      });
      it('should return correct day of the week', async () => {
        const result = getDayOfTheWeek(new Date('2024-08-11T23:00:00'));
        expect(result).toEqual('Sunday');
      });
      it('should return correct day of the week', async () => {
        const result = getDayOfTheWeek(new Date('2024-08-12T01:00:00'));
        expect(result).toEqual('Sunday');
      });
    });
  });

  describe('sumArrayByProp', () => {
    describe('when given an array and a prop', () => {
      it('should sum array By the given Prop', async () => {
        const result = sumArrayByProp([], 'x');
        expect(result).toEqual(0);
      });
      it('should sum array By the given Prop', async () => {
        const result = sumArrayByProp([{ x: 7 }, { x: 12 }], 'x');
        expect(result).toEqual(19);
      });
    });
  });
});
