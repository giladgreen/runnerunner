jest.mock('node-fetch', ()=>jest.fn())

import { sql } from '@vercel/postgres';
import {
    fetchAllUsers, fetchAllPlayersForExport, getPlayerHistory
} from '../../app/lib/data';

import {PlayerDB, UserDB, LogDB} from '@/app/lib/definitions';

import {signUp} from '../../app/lib/actions';

describe('actions utils', () => {
    const PHONE = '0587869900';
    beforeEach(async () => {
        await sql`DELETE FROM users`;
        await sql`DELETE FROM players`;
        await sql`DELETE FROM history`;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('signUp', () => {
        let formData: FormData;
        beforeEach(async () => {
            formData = {
                get: (prop: string)=>{
                    if (prop === 'phone_number') return PHONE;
                    if (prop === 'password') return '123456';
                    if (prop === 'marketing_approve') return 'on';
                }
            } as FormData
        });
        describe('when creating a new user', () => {
            it('should return correct results', async () => {
                // arrange
                const playerHistoryBefore: LogDB[] = await getPlayerHistory(PHONE);
                expect(playerHistoryBefore).toEqual([]);
                const playersBefore: PlayerDB[] = await fetchAllPlayersForExport();
                expect(playersBefore).toEqual([]);
                const usersBefore: UserDB[] = await fetchAllUsers();
                expect(usersBefore).toEqual([]);

                // act
                await signUp( null, 'prevState', formData);

                // assert
                const usersAfter = await fetchAllUsers();
                expect(usersAfter.length).toEqual(1);
                const newUser = usersAfter[0];
                expect(newUser?.phone_number).toEqual(PHONE);
                expect(newUser?.is_admin).toEqual(false);
                expect(newUser?.is_worker).toEqual(false);
                expect(newUser?.name).toEqual('UNKNOWN PLAYER');


                const playersAfter: PlayerDB[] = await fetchAllPlayersForExport();
                expect(playersAfter.length).toEqual(1);
                const createdPlayer = playersAfter[0];
                expect(createdPlayer?.phone_number).toEqual(PHONE);
                expect(createdPlayer?.allowed_marketing).toEqual(true);
                expect(createdPlayer?.balance).toEqual(0);
                expect(createdPlayer?.image_url).toEqual('/players/default.png');
                expect(createdPlayer?.name).toEqual('UNKNOWN PLAYER');
                expect(createdPlayer?.rsvpForToday).toEqual(false);
                expect(createdPlayer?.rsvps).toEqual([]);

                const playerHistoryAfter: LogDB[] = await getPlayerHistory('0587869900');
                expect(playerHistoryAfter.length).toEqual(1);
                const playerHistory = playerHistoryAfter[0];
                expect(playerHistory.phone_number).toEqual(PHONE);
                expect(playerHistory?.archive).toEqual(true);
                expect(playerHistory?.change).toEqual(0);
                expect(playerHistory?.note).toEqual("אתחול");
                expect(playerHistory?.other_player_phone_number).toEqual(null);
                expect(playerHistory?.type).toEqual('credit');
                expect(playerHistory?.updated_by).toEqual('admin');

                const secondTryResult = await signUp( null, 'prevState', formData);
                expect(secondTryResult).toEqual('User with phone number already exists');

            });
        });
    });
});
