import {formatCurrency, formatType, formatDateToLocal} from "../../app/lib/utils";

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
        describe('when input us legal date', () => {
            it('should return correct value', async () => {
                const result = formatDateToLocal((new Date('2024-04-23')).toISOString());
                expect(result).toEqual('יום שלישי, 23 באפריל 2024');
            });
        });
        describe('when input us legal date', () => {
            it('should return correct value', async () => {
                const result = formatDateToLocal((new Date('2024-02-31')).toISOString());
                expect(result).toEqual( 'יום שבת, 2 במרץ 2024');
            });
        });


    });
});
