jest.mock('node-fetch', ()=>jest.fn())
import { sql } from '@vercel/postgres';
import {
    fetchAllUsers, fetchAllPlayersForExport, getPlayerHistory, fetchAllBugs, getAllImages
} from '../../app/lib/data';
import {PlayerDB, UserDB, LogDB, BugDB, ImageDB} from '@/app/lib/definitions';
import {signUp, createReport, createPlayer, State} from '../../app/lib/actions';

describe('actions utils', () => {
    const PHONE = '0587869900';
    beforeEach(async () => {
        await sql`DELETE FROM bugs`;
        await sql`DELETE FROM users`;
        await sql`DELETE FROM players`;
        await sql`DELETE FROM history`;
        /*

  await seedPlayers(client);
  await seedHistory(client);
  await seedWinners(client);
  await seedRSVP(client);
  await seedPrizes(client);
  await seedImages(client);
  await seedFF(client);
         */
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('bugs', () => {
        const description = 'do that and that';
        let formData: FormData;
        beforeEach(async () => {
            formData = {
                get: (prop: string)=>{
                    if (prop === 'description') return description;
                }
            } as FormData
        });
        describe('when creating a new bug', () => {
            it('should return correct results', async () => {
                // arrange
                const bugsBefore: BugDB[] = await fetchAllBugs();
                expect(bugsBefore).toEqual([]);

                // act
                await createReport('prevPage', formData)

                // assert
                const bugsAfter: BugDB[] = await fetchAllBugs();
                expect(bugsAfter.length).toEqual(1);
                const bug = bugsAfter[0];
                expect(bug.description).toEqual(description);

                await createReport('prevPage', formData)

                const bugsAfter2: BugDB[] = await fetchAllBugs();
                expect(bugsAfter2.length).toEqual(2);

            });
        });
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
    describe('players', () => {
        const phoneNumber = '0587861100';
        const name = 'do a didi';
        const balance = 200;
        const note = 'some note';
        const notes = 'some note';
        const imageUrl = 'some imageUrl';
        let formData: FormData;
        beforeEach(async () => {
            formData = {
                get: (prop: string)=>{
                    if (prop === 'phone_number') return phoneNumber;
                    if (prop === 'name') return name;
                    if (prop === 'balance') return balance;
                    if (prop === 'note') return note;
                    if (prop === 'notes') return notes;
                    if (prop === 'image_url') return imageUrl;
                }
            } as FormData
        });
        describe('when creating a new player', () => {
            it('should return correct results', async () => {
                // arrange
                const imagesBefore = await getAllImages();
                expect(imagesBefore).toEqual([]);
                const playerHistoryBefore: LogDB[] = await getPlayerHistory(phoneNumber);
                expect(playerHistoryBefore).toEqual([]);
                const playersBefore: PlayerDB[] = await fetchAllPlayersForExport();
                expect(playersBefore).toEqual([]);

                // act
                await createPlayer( 'prevState',{} as State, formData);

                // assert
                const imagesAfter: ImageDB[] = await getAllImages();
                expect(imagesAfter.length).toEqual(1);
                expect(imagesAfter[0].phone_number).toEqual(phoneNumber);
                expect(imagesAfter[0].image_url).toEqual(imageUrl);

                const playersAfter: PlayerDB[] = await fetchAllPlayersForExport();
                expect(playersAfter.length).toEqual(1);
                const createdPlayer = playersAfter[0];
                expect(createdPlayer?.phone_number).toEqual(phoneNumber);
                expect(createdPlayer?.allowed_marketing).toEqual(false);
                expect(createdPlayer?.balance).toEqual(balance);
                expect(createdPlayer?.notes).toEqual(notes);
                expect(createdPlayer?.image_url).toEqual(imageUrl);
                expect(createdPlayer?.name).toEqual(name);
                expect(createdPlayer?.rsvpForToday).toEqual(false);
                expect(createdPlayer?.rsvps).toEqual([]);

                const playerHistoryAfter: LogDB[] = await getPlayerHistory(phoneNumber);
                expect(playerHistoryAfter.length).toEqual(1);
                const playerHistory = playerHistoryAfter[0];
                expect(playerHistory.phone_number).toEqual(phoneNumber);
                expect(playerHistory?.archive).toEqual(false);
                expect(playerHistory?.change).toEqual(balance);
                expect(playerHistory?.note).toEqual(note);
                expect(playerHistory?.other_player_phone_number).toEqual(null);
                expect(playerHistory?.type).toEqual('credit');
                expect(playerHistory?.updated_by).toEqual('admin');


                const secondTryResult = await createPlayer( 'prevState',{} as State, formData);
                expect(secondTryResult).toEqual({
                    errors: {
                        phone_number: ['player already exists'],
                    },
                });

            });
        });
    });
});
