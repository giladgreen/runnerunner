jest.mock('node-fetch', () => jest.fn());
const TEST_TIMEOUT = 15000;
import {
  PlayerDB,
  UserDB,
  LogDB,
  BugDB,
  ImageDB,
  TournamentDB,
  PrizeInfoDB,
} from '@/app/lib/definitions';
import {
    signUp,
    createReport,
    createPlayer,
    State,
    deleteBug,
    createTournament,
    deleteTournament,
    createPrizeInfo,
    deletePrizeInfo,
    deletePlayer, createPlayerUsageLog,
} from '../../app/lib/actions';
import {
    createDefaultUser,
    getHistoryLogs,
    getFormData,
    clearDB,
    getAllBugs,
    getAllPlayers,
    getAllUsers,
    getAllImages,
    getAllTournaments,
    getAllDeletedTournaments,
    getAllDeletedBugs,
    getAllPrizesInfo,
    getAllDeletedPrizesInfo,
    getAllDeletedPlayers, createDefaultPlayer, createDefaultTournament, createOtherPlayer,
} from '../helpers/dbHelper';

describe('actions', () => {
  const PHONE = '0587869900';
  beforeEach(async () => {
    process.env.LOCAL = 'true';
    await clearDB();
  }, TEST_TIMEOUT);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('bugs', () => {
    describe('get create and delete bugs', () => {
      it(
        'should all work as expected',
        async () => {
          // arrange 1
          const bugsBefore: BugDB[] = await getAllBugs();
          expect(bugsBefore).toEqual([]);
          const deletedBugsBefore: BugDB[] = await getAllDeletedBugs();
          expect(deletedBugsBefore).toEqual([]);
          const description = 'do that and that';
          const formData = getFormData({ description });
          // act 1
          await createReport('prevPage', formData);

          // assert 1
          const deletedBugsAfter: BugDB[] = await getAllDeletedBugs();
          expect(deletedBugsAfter).toEqual([]);
          const bugsAfter: BugDB[] = await getAllBugs();
          expect(bugsAfter.length).toEqual(1);
          const bug = bugsAfter[0];
          expect(bug.description).toEqual(description);

          // arrange 2
          const description2 = 'something else';
          const formData2 = getFormData({ description: description2 });
          // act 2
          await createReport('prevPage', formData2);

          // assert 2
          const bugsAfterAddingOneMore: BugDB[] = await getAllBugs();
          expect(bugsAfterAddingOneMore.length).toEqual(2);
          const secondBug = bugsAfterAddingOneMore.find((b) => b.id !== bug.id);
          expect(secondBug?.description).toEqual(description2);

          // act 3
          await deleteBug({ prevPage: 'prevPage', id: bug.id });

          // assert 3
          const bugsAfterDelete: BugDB[] = await getAllBugs();
          expect(bugsAfterDelete.length).toEqual(1);
          const bugAfterDelete = bugsAfterDelete[0];
          expect(bugAfterDelete).toEqual(secondBug);

          const deletedBugsAfterDelete: BugDB[] = await getAllDeletedBugs();
          expect(deletedBugsAfterDelete.length).toEqual(1);
          const deletedBug = deletedBugsAfterDelete[0];
          expect(deletedBug.id).toEqual(bug.id);
          expect(deletedBug.description).toEqual(bug.description);
        },
        TEST_TIMEOUT,
      );
    });
  });

  describe('tournaments', () => {
    const userId = 'b96c34a5-57dd-4ac2-9393-3890a2531f23';

    beforeEach(async () => {
      await createDefaultUser(userId);
    });

    describe('get create and delete tournaments', () => {
      it(
        'should all work as expected',
        async () => {
          // arrange
          const deletedTournamentsBefore: TournamentDB[] =
            await getAllDeletedTournaments();
          const tournamentsBefore: TournamentDB[] = await getAllTournaments();
          expect(deletedTournamentsBefore).toEqual([]);
          expect(tournamentsBefore).toEqual([]);
          const day = 'Monday';
          const name = 'Tel-Aviv';
          const buy_in = 400;
          const re_buy = 300;
          const max_players = 50;
          const rsvp_required = true;
          const formData = getFormData({
            day,
            name,
            buy_in,
            re_buy,
            max_players,
            rsvp_required,
          });

          //act
          await createTournament(
            { prevPage: 'prevPage' },
            {} as State,
            formData,
          );

          // assert
          const deletedTournamentsAfter: TournamentDB[] =
            await getAllDeletedTournaments();
          expect(deletedTournamentsAfter).toEqual([]);

          const tournamentsAfter: TournamentDB[] = await getAllTournaments();
          expect(tournamentsAfter.length).toEqual(1);
          const tournament = tournamentsAfter[0];
          expect(tournament.day).toEqual(day);
          // @ts-ignore
          expect(tournament.i).toEqual(2);
          expect(tournament.name).toEqual(name);
          expect(tournament.buy_in).toEqual(buy_in);
          expect(tournament.re_buy).toEqual(re_buy);
          expect(tournament.max_players).toEqual(max_players);
          expect(tournament.rsvp_required).toEqual(rsvp_required);

          await deleteTournament(tournament.id, 'prevPage', userId);
          const tournamentsAfterDelete: TournamentDB[] =
            await getAllTournaments();
          expect(tournamentsAfterDelete).toEqual([]);

          const deletedTournamentsAfterDelete: TournamentDB[] =
            await getAllDeletedTournaments();
          expect(deletedTournamentsAfterDelete.length).toEqual(1);
          const deletedTournament = deletedTournamentsAfterDelete[0];
          expect(deletedTournament.id).toEqual(tournament.id);
          expect(deletedTournament.day).toEqual(day);
          // @ts-ignore
          expect(deletedTournament.i).toEqual(2);
          expect(deletedTournament.name).toEqual(name);
          expect(deletedTournament.buy_in).toEqual(buy_in);
          expect(deletedTournament.re_buy).toEqual(re_buy);
          expect(deletedTournament.max_players).toEqual(max_players);
          expect(deletedTournament.rsvp_required).toEqual(rsvp_required);
        },
        TEST_TIMEOUT,
      );
    });
  });

  describe('prizes info', () => {
    const userId = 'b96c34a5-55dd-4ac2-9393-3890a2531f23';

    beforeEach(async () => {
      await createDefaultUser(userId);
    });

    describe('get create and delete prizes info', () => {
      it(
        'should all work as expected',
        async () => {
          // arrange
          const deletedPrizeInfoBefore: PrizeInfoDB[] =
            await getAllDeletedPrizesInfo();
          const PrizeInfoBefore: PrizeInfoDB[] = await getAllPrizesInfo();
          expect(deletedPrizeInfoBefore).toEqual([]);
          expect(PrizeInfoBefore).toEqual([]);
          const name = 'Air-pods';
          const extra = 'extra..';
          const credit = '500';
          const formData = getFormData({ name, extra, credit });

          //act
          await createPrizeInfo(
            { prevPage: 'prevPage' },
            {} as State,
            formData,
          );

          // assert
          const deletedPrizeInfoAfter: PrizeInfoDB[] =
            await getAllDeletedPrizesInfo();
          const PrizeInfoAfter: PrizeInfoDB[] = await getAllPrizesInfo();
          expect(deletedPrizeInfoAfter).toEqual([]);
          expect(PrizeInfoAfter.length).toEqual(1);
          const prizeInfo = PrizeInfoAfter[0];
          expect(prizeInfo.name).toEqual(name);
          expect(prizeInfo.extra).toEqual(extra);
          expect(prizeInfo.credit).toEqual(Number(credit));

          await deletePrizeInfo({
            prizeId: prizeInfo.id,
            prevPage: 'prevPage',
          });

          const deletedPrizeInfoAfterDelete: PrizeInfoDB[] =
            await getAllDeletedPrizesInfo();
          const PrizeInfoAfterDelete: PrizeInfoDB[] = await getAllPrizesInfo();
          expect(deletedPrizeInfoAfterDelete.length).toEqual(1);
          expect(PrizeInfoAfterDelete).toEqual([]);

          const deletedPrizeInfo = deletedPrizeInfoAfterDelete[0];
          expect(deletedPrizeInfo.id).toEqual(prizeInfo.id);
          expect(deletedPrizeInfo.name).toEqual(name);
          expect(deletedPrizeInfo.extra).toEqual(extra);
          expect(deletedPrizeInfo.credit).toEqual(Number(credit));
        },
        TEST_TIMEOUT,
      );
    });
  });

  describe('signUp', () => {
    describe('when creating a new user', () => {
      it(
        'should return correct results',
        async () => {
          //assert 1
          const playersHistoryBefore: LogDB[] = await getHistoryLogs();
          expect(playersHistoryBefore).toEqual([]);

          const playersBefore: PlayerDB[] = await getAllPlayers();
          expect(playersBefore).toEqual([]);

          const usersBefore: UserDB[] = await getAllUsers();
          expect(usersBefore).toEqual([]);

          // arrange
          const formData = getFormData({
            phone_number: PHONE,
            password: '123456',
            name: 'israel israeli',
            marketing_approve: 'on',
          });

          // act
          await signUp(null, 'prevState', formData);

          // assert
          const usersAfter = await getAllUsers();
          expect(usersAfter.length).toEqual(1);
          const newUser = usersAfter[0];
          expect(newUser?.phone_number).toEqual(PHONE);
          expect(newUser?.is_admin).toEqual(false);
          expect(newUser?.is_worker).toEqual(false);
          expect(newUser?.name).toEqual('israel israeli');

          const playersAfter: PlayerDB[] = await getAllPlayers();
          expect(playersAfter.length).toEqual(1);
          const createdPlayer = playersAfter[0];
          expect(createdPlayer?.phone_number).toEqual(PHONE);
          expect(createdPlayer?.allowed_marketing).toEqual(true);
          expect(createdPlayer?.image_url).toEqual('/players/default.png');
          expect(createdPlayer?.name).toEqual('israel israeli');

          const playerHistoryAfter: LogDB[] = await getHistoryLogs();
          expect(playerHistoryAfter.length).toEqual(1);
          const playerHistory = playerHistoryAfter[0];
          expect(playerHistory.phone_number).toEqual(PHONE);
          expect(playerHistory?.archive).toEqual(true);
          expect(playerHistory?.change).toEqual(0);
          expect(playerHistory?.note).toEqual('אתחול');
          expect(playerHistory?.other_player_phone_number).toEqual(null);
          expect(playerHistory?.type).toEqual('credit');
          expect(playerHistory?.updated_by).toEqual('admin');
        },
        TEST_TIMEOUT,
      );
    });
    describe('when trying to create existing user', () => {
      it(
        'should return correct error',
        async () => {
          // arrange
          const formData = getFormData({
            phone_number: PHONE,
            password: '123456',
            name: 'israel israeli',
            marketing_approve: 'on',
          });
          process.env.LOCAL = 'true';

          // act
          await signUp(null, 'prevState', formData);
          const secondTryResult = await signUp(null, 'prevState', formData);
          // assert
          expect(secondTryResult).toEqual(
            'משתמש בעל אותו מספר טלפון כבר קיים במערכת',
          );
        },
        TEST_TIMEOUT,
      );
    });
  });

  describe('players', () => {
    const userId = 'b96c34a5-57dd-4ac2-9393-3890a2531f2d';
    const phoneNumber = '0587861100';
    const name = 'do a didi';
    const balance = 200;
    const note = 'some note';
    const notes = 'some note';
    const imageUrl =
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Smiley.svg/220px-Smiley.svg.png';
    beforeEach(async () => {
      await createDefaultUser(userId);
    });

    describe('create players', () => {
        describe('when creating a legal new player & delete it', () => {
            it(
                'should return correct results',
                async () => {
                    // arrange
                    const formData = getFormData({
                        phone_number: phoneNumber,
                        name,
                        balance,
                        note,
                        notes,
                        image_url: imageUrl,
                    });
                    // assert
                    const imagesBefore = await getAllImages();
                    expect(imagesBefore).toEqual([]);
                    const playerHistoryBefore: LogDB[] =
                        await getHistoryLogs(phoneNumber);
                    expect(playerHistoryBefore).toEqual([]);
                    const playersBefore: PlayerDB[] = await getAllPlayers();
                    const deletedPlayersBefore: PlayerDB[] = await getAllDeletedPlayers();
                    expect(playersBefore).toEqual([]);
                    expect(deletedPlayersBefore).toEqual([]);

                    // act
                    await createPlayer('prevState', {} as State, formData);

                    // assert
                    const imagesAfter: ImageDB[] = await getAllImages();
                    expect(imagesAfter.length).toEqual(1);
                    expect(imagesAfter[0].phone_number).toEqual(phoneNumber);
                    expect(imagesAfter[0].image_url).toEqual(imageUrl);

                    const playersAfter: PlayerDB[] = await getAllPlayers();
                    expect(playersAfter.length).toEqual(1);
                    const createdPlayer = playersAfter[0];
                    expect(createdPlayer?.phone_number).toEqual(phoneNumber);
                    expect(createdPlayer?.allowed_marketing).toEqual(false);
                    expect(createdPlayer?.notes).toEqual(notes);
                    expect(createdPlayer?.image_url).toEqual(imageUrl);
                    expect(createdPlayer?.name).toEqual(name);

                    const playerHistoryAfter: LogDB[] = await getHistoryLogs(phoneNumber);
                    expect(playerHistoryAfter.length).toEqual(1);
                    const playerHistory = playerHistoryAfter[0];
                    expect(playerHistory.phone_number).toEqual(phoneNumber);
                    expect(playerHistory?.archive).toEqual(false);
                    expect(playerHistory?.change).toEqual(balance);
                    expect(playerHistory?.note).toEqual(note);
                    expect(playerHistory?.other_player_phone_number).toEqual(null);
                    expect(playerHistory?.type).toEqual('credit');
                    expect(playerHistory?.updated_by).toEqual('admin');

                    await deletePlayer({ id: createdPlayer.id, prevPage: '' });

                    const playersAfterDelete: PlayerDB[] = await getAllPlayers();
                    expect(playersAfterDelete).toEqual([]);
                    const deletedPlayersAfterDelete: PlayerDB[] =
                        await getAllDeletedPlayers();
                    expect(deletedPlayersAfterDelete.length).toEqual(1);
                    const deletedPlayer = deletedPlayersAfterDelete[0];
                    expect(deletedPlayer?.id).toEqual(createdPlayer.id);
                    expect(deletedPlayer?.phone_number).toEqual(phoneNumber);
                    expect(deletedPlayer?.allowed_marketing).toEqual(false);
                    expect(deletedPlayer?.notes).toEqual(notes);
                    expect(deletedPlayer?.image_url).toEqual(imageUrl);
                    expect(deletedPlayer?.name).toEqual(name);
                },
                TEST_TIMEOUT,
            );
        });
        describe('when creating a legal new player without image', () => {
            it(
                'should return correct results',
                async () => {
                    // arrange
                    const formData = getFormData({
                        phone_number: phoneNumber,
                        name,
                        balance,
                        note,
                        notes,
                        image_url: '',
                    });
                    // assert
                    const imagesBefore = await getAllImages();
                    expect(imagesBefore).toEqual([]);
                    const playerHistoryBefore: LogDB[] =
                        await getHistoryLogs(phoneNumber);
                    expect(playerHistoryBefore).toEqual([]);
                    const playersBefore: PlayerDB[] = await getAllPlayers();
                    const deletedPlayersBefore: PlayerDB[] = await getAllDeletedPlayers();
                    expect(playersBefore).toEqual([]);
                    expect(deletedPlayersBefore).toEqual([]);

                    // act
                    await createPlayer('prevState', {} as State, formData);

                    // assert
                    const imagesAfter: ImageDB[] = await getAllImages();
                    expect(imagesAfter).toEqual([]);

                    const playersAfter: PlayerDB[] = await getAllPlayers();
                    expect(playersAfter.length).toEqual(1);
                    const createdPlayer = playersAfter[0];
                    expect(createdPlayer?.phone_number).toEqual(phoneNumber);
                    expect(createdPlayer?.allowed_marketing).toEqual(false);
                    expect(createdPlayer?.notes).toEqual(notes);
                    expect(createdPlayer?.image_url).toEqual('/players/default.png');
                    expect(createdPlayer?.name).toEqual(name);
                },
                TEST_TIMEOUT,
            );
        });
        describe('when creating an existing player', () => {
            it(
                'should return correct error',
                async () => {
                    // arrange
                    const formData = getFormData({
                        phone_number: phoneNumber,
                        name,
                        balance,
                        note,
                        notes,
                        image_url: imageUrl,
                    });

                    // act
                    await createPlayer('prevState', {} as State, formData);
                    const secondTryResult = await createPlayer(
                        'prevState',
                        {} as State,
                        formData,
                    );
                    expect(secondTryResult).toEqual({
                        errors: {
                            phone_number: ['שחקן עם מספר זה כבר קיים'],
                        },
                    });
                    //
                    // await createPlayer(
                    //   'prevState',
                    //   {} as State,
                    //   getFormData({
                    //     phone_number: otherPlayerPhone,
                    //     name,
                    //     balance: 400,
                    //     note,
                    //     notes,
                    //     image_url: imageUrl,
                    //   }),
                    // );

                    // await createPlayerNewCreditLog(
                    //   { player: createdPlayer, prevPage: 'prevPage', userId, tournamentId },
                    //   {} as State,
                    //   getFormData({
                    //     type: 'credit',
                    //     change: 450,
                    //     note,
                    //   }),
                    // );
                    // const positionInput = {
                    //   playerId: createdPlayer.id,
                    //   prevPage: 'prevPage',
                    //   tournamentId,
                    // };
                    // // @ts-ignore
                    // await setPlayerPosition(
                    //   positionInput,
                    //   getFormData({
                    //     position: 3,
                    //   }),
                    // );
                    // // @ts-ignore
                    // await setPlayerPosition(
                    //   positionInput,
                    //   getFormData({
                    //     position: 0,
                    //   }),
                    // );
                    // const badRequestResult = await setPlayerPosition(
                    //   positionInput,
                    //   getFormData({
                    //     position: 'nan',
                    //   }),
                    // );
                    // expect(badRequestResult).toEqual({
                    //   message: 'איראה שגיאה',
                    // });
                },
                TEST_TIMEOUT,
            );
        });
        describe('when trying to create illegal player', () => {
            it(
                'when no name - should return correct error',
                async () => {
                    // arrange
                    const formData = getFormData({
                        phone_number: phoneNumber,
                        name: null,
                        balance,
                        note,
                        notes,
                        image_url: imageUrl,
                    });
                    // act
                    const resultObject = await createPlayer(
                        'prevState',
                        {} as State,
                        formData,
                    );

                    // assert
                    expect(resultObject).toEqual({
                        errors: {
                            name: ['missing name'],
                        },
                    });
                },
                TEST_TIMEOUT,
            );
            it(
                'when empty name - should return correct error',
                async () => {
                    // arrange
                    const formData = getFormData({
                        phone_number: phoneNumber,
                        name: '',
                        balance,
                        note,
                        notes,
                        image_url: imageUrl,
                    });

                    // act
                    const resultObject = await createPlayer(
                        'prevState',
                        {} as State,
                        formData,
                    );

                    // assert
                    expect(resultObject).toEqual({
                        errors: {
                            name: ['missing name'],
                        },
                    });
                },
                TEST_TIMEOUT,
            );
            it(
                'when too short phone number name - should return correct error',
                async () => {
                    // arrange
                    const formData = {
                        get: (prop: string) => {
                            if (prop === 'phone_number') return '1';
                            if (prop === 'name') return 'abcde';
                            if (prop === 'balance') return balance;
                            if (prop === 'note') return note;
                            if (prop === 'notes') return notes;
                            if (prop === 'image_url') return imageUrl;
                        },
                    } as FormData;
                    // act
                    const resultObject = await createPlayer(
                        'prevState',
                        {} as State,
                        formData,
                    );

                    // assert
                    expect(resultObject).toEqual({
                        errors: {
                            phone_number: ['missing phone'],
                        },
                    });
                },
                TEST_TIMEOUT,
            );
            it(
                'when ilegal balance - should return correct error',
                async () => {
                    // arrange
                    const formData = {
                        get: (prop: string) => {
                            if (prop === 'phone_number') return '123445';
                            if (prop === 'name') return 'abcde';
                            if (prop === 'balance') return 'nan';
                            if (prop === 'note') return note;
                            if (prop === 'notes') return notes;
                            if (prop === 'image_url') return imageUrl;
                        },
                    } as FormData;
                    // act
                    const resultObject = await createPlayer(
                        'prevState',
                        {} as State,
                        formData,
                    );

                    // assert
                    expect(resultObject).toEqual({
                        errors: {
                            balance: ['illegal credit'],
                        },
                    });
                },
                TEST_TIMEOUT,
            );
        });
    })

    describe('create player history', () => {
        let player: PlayerDB;
        let otherPlayer: PlayerDB;
        let tournamentId: string;
        beforeEach(async () => {
            player = await createDefaultPlayer();
            otherPlayer = await createOtherPlayer();
            tournamentId = (await createDefaultTournament()).id;
        }, TEST_TIMEOUT);
        describe('create player usage - credit', () => {
            it('should return correct results', async () => {
                const playerHistoryBefore = await getHistoryLogs('0587869910')
                expect(playerHistoryBefore.length).toEqual(1);


                await createPlayerUsageLog(
                  { player, prevPage: 'prevPage', userId, tournamentId },
                  {} as State,
                  getFormData({
                    type: 'credit',
                    change: 250,
                    note:'first entrance',
                  }),
                );

                const playerHistoryLogsAfter = await getHistoryLogs('0587869910');
                expect(playerHistoryLogsAfter.length).toEqual(2);
                const playerHistoryAfter = playerHistoryLogsAfter[1];
                expect(playerHistoryAfter.change).toEqual(-250);
                expect(playerHistoryAfter.type).toEqual('credit');
                expect(playerHistoryAfter.tournament_id).toEqual(tournamentId);
            }, TEST_TIMEOUT)
        })
        describe('create player usage - cash', () => {
            it('should return correct results', async () => {
                const playerHistoryBefore = await getHistoryLogs('0587869910')
                expect(playerHistoryBefore.length).toEqual(1);

                await createPlayerUsageLog(
                    { player, prevPage: 'prevPage', userId, tournamentId },
                    {} as State,
                    getFormData({
                        type: 'cash',
                        change: 250,
                        note:'first entrance',
                    }),
                );

                const playerHistoryLogsAfter = await getHistoryLogs('0587869910');
                expect(playerHistoryLogsAfter.length).toEqual(2);
                const playerHistoryAfter = playerHistoryLogsAfter[1];
                expect(playerHistoryAfter.change).toEqual(-250);
                expect(playerHistoryAfter.type).toEqual('cash');
                expect(playerHistoryAfter.tournament_id).toEqual(tournamentId);

            }, TEST_TIMEOUT)
        })
        describe('create player usage - credit by other', () => {
            it('should return correct results', async () => {
                const playerPhoneNumber = player.phone_number;
                const otherPlayerPhoneNumber = otherPlayer.phone_number;
                const playerHistoryBefore = await getHistoryLogs(playerPhoneNumber)
                expect(playerHistoryBefore.length).toEqual(1);

                const otherPlayerHistoryBefore = await getHistoryLogs(otherPlayerPhoneNumber)
                expect(otherPlayerHistoryBefore.length).toEqual(1);

                await createPlayerUsageLog(
                  { player, prevPage: 'prevPage', userId, tournamentId },
                  {} as State,
                  getFormData({
                    type: 'credit_by_other',
                    change: 250,
                    note:'first entrance',
                    other_player:otherPlayerPhoneNumber
                  }),
                );

                const playerHistoryLogsAfter = await getHistoryLogs(playerPhoneNumber);
                expect(playerHistoryLogsAfter.length).toEqual(2);
                const playerHistoryAfter = playerHistoryLogsAfter[1];
                expect(playerHistoryAfter.change).toEqual(0);
                expect(playerHistoryAfter.type).toEqual('credit_by_other');
                expect(playerHistoryAfter.tournament_id).toEqual(tournamentId);
                expect(playerHistoryAfter.other_player_phone_number).toEqual(otherPlayerPhoneNumber);

                const otherPlayerHistoryLogsAfter = await getHistoryLogs(otherPlayerPhoneNumber);
                expect(otherPlayerHistoryLogsAfter.length).toEqual(2);
                const otherPlayerHistoryAfter = otherPlayerHistoryLogsAfter[1]
                expect(otherPlayerHistoryAfter.change).toEqual(-250);
                expect(otherPlayerHistoryAfter.type).toEqual('credit_to_other');
                expect(otherPlayerHistoryAfter.tournament_id).toEqual(tournamentId);
            }, TEST_TIMEOUT)
        })
    })
  });
});
