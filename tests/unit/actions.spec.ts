jest.mock('node-fetch', () => jest.fn());
import { signIn } from '../../auth';

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
  deletePlayer,
  createPlayerUsageLog,
  authenticate,
  deleteUser,
  updatePlayer,
  updateTournament,
  updatePrizeInfo,
  updateNewPlayerName,
  updateFFValue,
  updateIsUserWorker,
  updateIsUserAdmin,
  undoPlayerLastLog,
  givePlayerPrizeOrCredit,
  rsvpPlayerForDay,
  setPlayerPosition,
  setPrizesCreditWorth,
  resetTournamentPositions,
  removeOldRsvp,
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
  getAllDeletedPlayers,
  createDefaultPlayer,
  createDefaultTournament,
  createOtherPlayer,
  getAllFF,
  insertFF,
  getTournamentWinners,
  createTestPlayer,
  getAllRSVPs,
  getAllDeletedRSVPs,
} from '../helpers/dbHelper';
import assert from 'node:assert';

describe('actions', () => {
  const PHONE = '0587869900';
  beforeEach(async () => {
    process.env.LOCAL = 'true';
    await clearDB();
  }, TEST_TIMEOUT);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('user / signUp', () => {
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
          const usersAfterSignup = await getAllUsers();
          expect(usersAfterSignup.length).toEqual(1);
          const newUser = usersAfterSignup[0];
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

          const newName = 'new name';
          //act
          await updateNewPlayerName(
            createdPlayer.id,
            undefined,
            getFormData({
              name: newName,
            }),
          );

          //assert
          const usersAfterNameUpdate = await getAllUsers();
          const userAfterNameUpdate = usersAfterNameUpdate[0];
          expect(userAfterNameUpdate?.name).toEqual(newName);

          const playersAfterNameUpdate: PlayerDB[] = await getAllPlayers();
          const playerAfterNameUpdate = playersAfterNameUpdate[0];
          expect(playerAfterNameUpdate?.name).toEqual(newName);

          //act
          await updateIsUserWorker({ id: newUser.id, prevPage: 'prev' });
          //assert
          const usersAfterIsWorkerUpdate = await getAllUsers();
          const userAfterIsWorkerUpdate = usersAfterIsWorkerUpdate[0];
          expect(userAfterIsWorkerUpdate?.phone_number).toEqual(PHONE);
          expect(userAfterIsWorkerUpdate?.is_admin).toEqual(false);
          expect(userAfterIsWorkerUpdate?.is_worker).toEqual(true);

          //act
          await updateIsUserAdmin({ id: newUser.id, prevPage: 'prev' });
          //assert
          const usersAfterIsAdminUpdate = await getAllUsers();
          const userAfterIsAdminUpdate = usersAfterIsAdminUpdate[0];
          expect(userAfterIsAdminUpdate?.phone_number).toEqual(PHONE);
          expect(userAfterIsAdminUpdate?.is_admin).toEqual(true);
          expect(userAfterIsAdminUpdate?.is_worker).toEqual(true);

          // act
          await deleteUser({ id: newUser.id, prevPage: 'prevPage' });

          // assert
          const usersAfterFailDelete = await getAllUsers();
          expect(usersAfterFailDelete).toEqual(usersAfterIsAdminUpdate);

          await updateIsUserWorker({ id: newUser.id, prevPage: 'prev' });
          await updateIsUserAdmin({ id: newUser.id, prevPage: 'prev' });
          // act
          await deleteUser({ id: newUser.id, prevPage: 'prevPage' });

          // assert
          const usersAfterDelete = await getAllUsers();
          expect(usersAfterDelete.length).toEqual(0);
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

  describe('authenticate', () => {
    describe('when calling authenticate with a phone number', () => {
      it(
        'should call the signIn with correct arguments',
        async () => {
          // arrange
          const formData = getFormData({
            email: '587-869900 -',
          });

          // act
          await authenticate('prevState', formData);

          // assert
          expect(signIn).toHaveBeenCalledWith('credentials', formData);
        },
        TEST_TIMEOUT,
      );
    });
  });

  describe('reports', () => {
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

    describe('get, create,update and delete tournaments', () => {
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
          expect(tournament.i).toEqual(2);
          expect(tournament.name).toEqual(name);
          expect(tournament.buy_in).toEqual(buy_in);
          expect(tournament.re_buy).toEqual(re_buy);
          expect(tournament.max_players).toEqual(max_players);
          expect(tournament.rsvp_required).toEqual(rsvp_required);

          const newName = 'new name';
          const newBuyIn = 700;
          const newReBuy = 600;
          const newMaxPlayers = 200;
          const newRsvpRequired = false;
          await updateTournament(
            { id: tournament.id, prevPage: 'prevPage' },
            {} as State,
            getFormData({
              name: newName,
              buy_in: newBuyIn,
              re_buy: newReBuy,
              max_players: newMaxPlayers,
              rsvp_required: newRsvpRequired,
            }),
          );

          //assert
          const tournamentsAfterUpdate: TournamentDB[] =
            await getAllTournaments();
          expect(tournamentsAfterUpdate.length).toEqual(1);
          const tournamentAfterUpdate = tournamentsAfterUpdate[0];
          expect(tournamentAfterUpdate.day).toEqual(day);
          expect(tournamentAfterUpdate.i).toEqual(2);
          expect(tournamentAfterUpdate.name).toEqual(newName);
          expect(tournamentAfterUpdate.buy_in).toEqual(newBuyIn);
          expect(tournamentAfterUpdate.re_buy).toEqual(newReBuy);
          expect(tournamentAfterUpdate.max_players).toEqual(newMaxPlayers);
          expect(tournamentAfterUpdate.rsvp_required).toEqual(newRsvpRequired);

          //act
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
          expect(deletedTournament.name).toEqual(newName);
          expect(deletedTournament.buy_in).toEqual(newBuyIn);
          expect(deletedTournament.re_buy).toEqual(newReBuy);
          expect(deletedTournament.max_players).toEqual(newMaxPlayers);
          expect(deletedTournament.rsvp_required).toEqual(newRsvpRequired);
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

    describe('get, create, update and delete prizes info', () => {
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

          const newName = 'new name';
          const newExtra = 'new extra';
          const newCredit = '999';
          //act
          await updatePrizeInfo(
            { prizeId: prizeInfo.id, prevPage: 'prevPage' },
            {} as State,
            getFormData({ name: newName, extra: newExtra, credit: newCredit }),
          );
          //assert
          const PrizesInfoAfterUpdate: PrizeInfoDB[] = await getAllPrizesInfo();
          const PrizeInfoAfterUpdate = PrizesInfoAfterUpdate[0];
          expect(PrizeInfoAfterUpdate.id).toEqual(prizeInfo.id);
          expect(PrizeInfoAfterUpdate.name).toEqual(newName);
          expect(PrizeInfoAfterUpdate.extra).toEqual(newExtra);
          expect(PrizeInfoAfterUpdate.credit).toEqual(Number(newCredit));

          //act
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
          expect(deletedPrizeInfo.name).toEqual(newName);
          expect(deletedPrizeInfo.extra).toEqual(newExtra);
          expect(deletedPrizeInfo.credit).toEqual(Number(newCredit));
        },
        TEST_TIMEOUT,
      );
    });
  });

  describe('feature flags', () => {
    describe('update ff value', () => {
      it(
        'should all work as expected',
        async () => {
          // arrange
          const ffName = 'enable something';
          const initValue = false;
          const newValue = true;

          const noFeatureFlags = await getAllFF();
          expect(noFeatureFlags).toEqual([]);
          await insertFF(ffName, initValue);
          const featureFlagsBefore = await getAllFF();
          expect(featureFlagsBefore.length).toEqual(1);
          expect(featureFlagsBefore[0].flag_name).toEqual(ffName);
          expect(featureFlagsBefore[0].is_open).toEqual(initValue);

          //act
          await updateFFValue(ffName, newValue, 'prevPage');

          // assert
          const featureFlagsAfter = await getAllFF();
          expect(featureFlagsAfter.length).toEqual(1);
          const featureFlagAfter = featureFlagsAfter[0];
          expect(featureFlagAfter.flag_name).toEqual(ffName);
          expect(featureFlagAfter.is_open).toEqual(newValue);
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
      describe('when creating a legal new player, then update it then delete it', () => {
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
            const deletedPlayersBefore: PlayerDB[] =
              await getAllDeletedPlayers();
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

            const playerHistoryAfter: LogDB[] =
              await getHistoryLogs(phoneNumber);
            expect(playerHistoryAfter.length).toEqual(1);
            const playerHistory = playerHistoryAfter[0];
            expect(playerHistory.phone_number).toEqual(phoneNumber);
            expect(playerHistory?.archive).toEqual(false);
            expect(playerHistory?.change).toEqual(balance);
            expect(playerHistory?.note).toEqual(note);
            expect(playerHistory?.other_player_phone_number).toEqual(null);
            expect(playerHistory?.type).toEqual('credit');
            expect(playerHistory?.updated_by).toEqual('admin');

            //arrange
            const newName = 'new name';
            const newNotes = 'some new notes';
            //act
            await updatePlayer(
              { id: createdPlayer.id, prevPage: 'prevPage' },
              {} as State,
              getFormData({
                name: newName,
                notes: newNotes,
              }),
            );

            //assert
            const playersAfterUpdate: PlayerDB[] = await getAllPlayers();
            expect(playersAfterUpdate.length).toEqual(1);
            const updatedPlayer = playersAfterUpdate[0];
            expect(updatedPlayer?.phone_number).toEqual(phoneNumber);
            expect(updatedPlayer?.allowed_marketing).toEqual(false);
            expect(updatedPlayer?.notes).toEqual(newNotes);
            expect(updatedPlayer?.image_url).toEqual(imageUrl);
            expect(updatedPlayer?.name).toEqual(newName);

            // act
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
            expect(deletedPlayer?.notes).toEqual(newNotes);
            expect(deletedPlayer?.image_url).toEqual(imageUrl);
            expect(deletedPlayer?.name).toEqual(newName);
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
            const deletedPlayersBefore: PlayerDB[] =
              await getAllDeletedPlayers();
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
                name: ['חסר שם'],
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
                name: ['חסר שם'],
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
                phone_number: ['חסר מספר טלפון'],
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
                balance: ['קרדיט לא חוקי'],
              },
            });
          },
          TEST_TIMEOUT,
        );
      });
    });

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
        it(
          'should return correct results',
          async () => {
            const playerHistoryBefore = await getHistoryLogs('0587869910');
            expect(playerHistoryBefore.length).toEqual(1);

            await createPlayerUsageLog(
              { player, prevPage: 'prevPage', userId, tournamentId },
              {} as State,
              getFormData({
                type: 'credit',
                change: 250,
                note: 'first entrance',
              }),
            );

            const playerHistoryLogsAfter = await getHistoryLogs('0587869910');
            expect(playerHistoryLogsAfter.length).toEqual(2);
            const playerHistoryAfter = playerHistoryLogsAfter[1];
            expect(playerHistoryAfter.change).toEqual(-250);
            expect(playerHistoryAfter.type).toEqual('credit');
            expect(playerHistoryAfter.tournament_id).toEqual(tournamentId);
          },
          TEST_TIMEOUT,
        );
      });
      describe('create player usage - cash + undo', () => {
        it(
          'should return correct results',
          async () => {
            const playerHistoryBefore = await getHistoryLogs('0587869910');
            expect(playerHistoryBefore.length).toEqual(1);

            await createPlayerUsageLog(
              { player, prevPage: 'prevPage', userId, tournamentId },
              {} as State,
              getFormData({
                type: 'cash',
                change: 250,
                note: 'first entrance',
              }),
            );

            const playerHistoryLogsAfter = await getHistoryLogs('0587869910');
            expect(playerHistoryLogsAfter.length).toEqual(2);
            const playerHistoryAfter = playerHistoryLogsAfter[1];
            expect(playerHistoryAfter.change).toEqual(-250);
            expect(playerHistoryAfter.type).toEqual('cash');
            expect(playerHistoryAfter.tournament_id).toEqual(tournamentId);

            //act
            await undoPlayerLastLog(player.phone_number, '');
            //assert
            const playerHistoryLogsAfterUndo =
              await getHistoryLogs('0587869910');
            expect(playerHistoryLogsAfterUndo).toEqual(playerHistoryBefore);
          },
          TEST_TIMEOUT,
        );
      });
      describe('create player usage - missing fields', () => {
        it(
          'should return correct results',
          async () => {
            const result = await createPlayerUsageLog(
              { player, prevPage: 'prevPage', userId, tournamentId },
              {} as State,
              getFormData({}),
            );

            expect(result).toEqual({
              message: 'שדה חסר, אין אפשרות לסיים את הפעולה',
              errors: {
                change: ['Expected number, received nan'],
                note: ['Required'],
              },
            });
          },
          TEST_TIMEOUT,
        );
      });

      describe('create player usage - credit by other', () => {
        describe('when other player exist', () => {
          it(
            'should return correct results',
            async () => {
              const playerPhoneNumber = player.phone_number;
              const otherPlayerPhoneNumber = otherPlayer.phone_number;
              const playerHistoryBefore =
                await getHistoryLogs(playerPhoneNumber);
              expect(playerHistoryBefore.length).toEqual(1);

              const otherPlayerHistoryBefore = await getHistoryLogs(
                otherPlayerPhoneNumber,
              );
              expect(otherPlayerHistoryBefore.length).toEqual(1);

              await createPlayerUsageLog(
                { player, prevPage: 'prevPage', userId, tournamentId },
                {} as State,
                getFormData({
                  type: 'credit_by_other',
                  change: 250,
                  note: 'first entrance',
                  other_player: otherPlayerPhoneNumber,
                }),
              );

              const playerHistoryLogsAfter =
                await getHistoryLogs(playerPhoneNumber);
              expect(playerHistoryLogsAfter.length).toEqual(2);
              const playerHistoryAfter = playerHistoryLogsAfter[1];
              expect(playerHistoryAfter.change).toEqual(0);
              expect(playerHistoryAfter.type).toEqual('credit_by_other');
              expect(playerHistoryAfter.tournament_id).toEqual(tournamentId);
              expect(playerHistoryAfter.other_player_phone_number).toEqual(
                otherPlayerPhoneNumber,
              );

              const otherPlayerHistoryLogsAfter = await getHistoryLogs(
                otherPlayerPhoneNumber,
              );
              expect(otherPlayerHistoryLogsAfter.length).toEqual(2);
              const otherPlayerHistoryAfter = otherPlayerHistoryLogsAfter[1];
              expect(otherPlayerHistoryAfter.change).toEqual(-250);
              expect(otherPlayerHistoryAfter.type).toEqual('credit_to_other');
              expect(otherPlayerHistoryAfter.tournament_id).toEqual(
                tournamentId,
              );
            },
            TEST_TIMEOUT,
          );
        });
        describe('when other player phone does not exist in DB', () => {
          it(
            'should return correct error',
            async () => {
              const playerPhoneNumber = player.phone_number;
              const playerHistoryBefore =
                await getHistoryLogs(playerPhoneNumber);
              expect(playerHistoryBefore.length).toEqual(1);

              const result = await createPlayerUsageLog(
                { player, prevPage: 'prevPage', userId, tournamentId },
                {} as State,
                getFormData({
                  type: 'credit_by_other',
                  change: 250,
                  note: 'first entrance',
                  other_player: '12345',
                }),
              );
              expect(result).toEqual({ message: 'לא נמצא מידע על שחקן' });

              const playerHistoryLogsAfter =
                await getHistoryLogs(playerPhoneNumber);
              expect(playerHistoryLogsAfter).toEqual(playerHistoryBefore);
            },
            TEST_TIMEOUT,
          );
        });
        describe('when not passing other player phone ', () => {
          it(
            'should return correct error',
            async () => {
              const playerPhoneNumber = player.phone_number;
              const playerHistoryBefore =
                await getHistoryLogs(playerPhoneNumber);
              expect(playerHistoryBefore.length).toEqual(1);

              const result = await createPlayerUsageLog(
                { player, prevPage: 'prevPage', userId, tournamentId },
                {} as State,
                getFormData({
                  type: 'credit_by_other',
                  change: 250,
                  note: 'first entrance',
                }),
              );
              expect(result).toEqual({
                message: 'חסר מספר הטלפון של השחקן האחר',
              });

              const playerHistoryLogsAfter =
                await getHistoryLogs(playerPhoneNumber);
              expect(playerHistoryLogsAfter).toEqual(playerHistoryBefore);
            },
            TEST_TIMEOUT,
          );
        });
      });

      describe('give player prize or credit', () => {
        describe('give prize', () => {
          it(
            'should return correct results',
            async () => {
              const playerHistoryBefore = await getHistoryLogs('0587869910');
              expect(playerHistoryBefore.length).toEqual(1);
              //arrange
              const type = 'prize';
              const credit = '';
              const prize = '';
              const prize_worth = '';
              const credit_worth = '';
              const update_player_credit = '';
              const stringDate = 'sunday 7';
              //act
              await givePlayerPrizeOrCredit(
                {
                  stringDate,
                  userId,
                  playerId: player.id,
                  prevPage: '',
                  tournamentId,
                },
                {} as State,
                getFormData({
                  type,
                  credit,
                  prize,
                  prize_worth,
                  credit_worth,
                  update_player_credit,
                }),
              );

              //assert
              const playerHistoryLogsAfterUndo =
                await getHistoryLogs('0587869910');
              expect(playerHistoryLogsAfterUndo).toEqual(playerHistoryBefore);
            },
            TEST_TIMEOUT,
          );
        });
      });
    });

    describe('tournaments rsvp, places, places worth', () => {
      const player1PhoneNumber = '0587869901';
      const player2PhoneNumber = '0587869902';
      const player3PhoneNumber = '0587869903';
      let player1: PlayerDB;
      let player2: PlayerDB;
      let player3: PlayerDB;
      let tournament: TournamentDB;
      let tournamentId: string;
      beforeEach(async () => {
        player1 = await createTestPlayer(player1PhoneNumber, 'player1');
        player2 = await createTestPlayer(player2PhoneNumber, 'player2');
        player3 = await createTestPlayer(player3PhoneNumber, 'player3');
        tournament = await createDefaultTournament();
        tournamentId = tournament.id;
      }, TEST_TIMEOUT);
      describe('rsvps', () => {
        it(
          'should return correct results',
          async () => {
            //assert
            const rsvpsBefore = await getAllRSVPs();
            const deletedRsvpsBefore = await getAllDeletedRSVPs();
            expect(rsvpsBefore.length).toEqual(0);
            expect(deletedRsvpsBefore.length).toEqual(0);
            //arrange
            const date = new Date().toISOString().slice(0, 10);

            //act
            await rsvpPlayerForDay(
              player1PhoneNumber,
              date,
              tournamentId,
              true,
              'prevPage',
            );
            await rsvpPlayerForDay(
              player2PhoneNumber,
              date,
              tournamentId,
              true,
              'prevPage',
            );
            await rsvpPlayerForDay(
              player3PhoneNumber,
              date,
              tournamentId,
              true,
              'prevPage',
            );

            //assert
            const rsvpsAfterFirstRsvp = await getAllRSVPs();
            const deletedRsvpsAfterFirstRsvp = await getAllDeletedRSVPs();
            expect(rsvpsAfterFirstRsvp.length).toEqual(3);
            expect(deletedRsvpsAfterFirstRsvp.length).toEqual(0);

            await rsvpPlayerForDay(
              player3PhoneNumber,
              date,
              tournamentId,
              false,
              'prevPage',
            );

            //assert
            const rsvpsAfterSecondRsvp = await getAllRSVPs();
            const deletedRsvpsAfterSecondRsvp = await getAllDeletedRSVPs();
            expect(rsvpsAfterSecondRsvp.length).toEqual(2);
            expect(deletedRsvpsAfterSecondRsvp.length).toEqual(1);
          },
          TEST_TIMEOUT,
        );
      });
      describe('tournament places', () => {
        it(
          'should return correct results',
          async () => {
            //assert
            const tournamentWinnersBefore =
              await getTournamentWinners(tournamentId);
            expect(tournamentWinnersBefore).toEqual(undefined);

            //act
            await setPlayerPosition(
              {
                playerId: player3.id,
                prevPage: 'prevPage',
                tournamentId,
              },
              getFormData({ position: 3 }),
            );
            await setPlayerPosition(
              {
                playerId: player2.id,
                prevPage: 'prevPage',
                tournamentId,
              },
              getFormData({ position: 2 }),
            );
            await setPlayerPosition(
              {
                playerId: player1.id,
                prevPage: 'prevPage',
                tournamentId,
              },
              getFormData({ position: 1 }),
            );

            //assert
            const tournamentWinnersAfter =
              await getTournamentWinners(tournamentId);
            expect(tournamentWinnersAfter?.tournament_id).toEqual(tournamentId);
            expect(tournamentWinnersAfter?.tournament_name).toEqual(
              tournament.name,
            );
            const winners = JSON.parse(tournamentWinnersAfter?.winners || '{}');
            expect(winners[player1PhoneNumber]).toEqual({
              position: 1,
              hasReceived: false,
              creditWorth: -1,
            });
            expect(winners[player2PhoneNumber]).toEqual({
              position: 2,
              hasReceived: false,
              creditWorth: -1,
            });
            expect(winners[player3PhoneNumber]).toEqual({
              position: 3,
              hasReceived: false,
              creditWorth: -1,
            });

            //act
            const res = await setPrizesCreditWorth(
              {
                date: tournamentWinnersAfter.date,
                tournamentId: '123',
                prevPage: 'prevPage',
              },
              {} as State,
              getFormData({ '#1': 1000, '#2': 500, '#3': 250 }),
            );
            //assert
            expect(res).toEqual({ message: 'איראה שגיאה' });
            //act
            await setPrizesCreditWorth(
              {
                date: tournamentWinnersAfter.date,
                tournamentId,
                prevPage: 'prevPage',
              },
              {} as State,
              getFormData({ '#1': 1000, '#2': 500, '#3': 250 }),
            );

            //assert
            const tournamentWinnersAfterCreditWorth =
              await getTournamentWinners(tournamentId);
            expect(tournamentWinnersAfterCreditWorth?.tournament_id).toEqual(
              tournamentId,
            );
            expect(tournamentWinnersAfterCreditWorth?.tournament_name).toEqual(
              tournament.name,
            );
            const winnersAfterCreditWorth = JSON.parse(
              tournamentWinnersAfterCreditWorth?.winners || '{}',
            );
            expect(winnersAfterCreditWorth[player1PhoneNumber]).toEqual({
              position: 1,
              hasReceived: false,
              creditWorth: 1000,
            });
            expect(winnersAfterCreditWorth[player2PhoneNumber]).toEqual({
              position: 2,
              hasReceived: false,
              creditWorth: 500,
            });
            expect(winnersAfterCreditWorth[player3PhoneNumber]).toEqual({
              position: 3,
              hasReceived: false,
              creditWorth: 250,
            });

            //act
            await setPlayerPosition(
              {
                playerId: player3.id,
                prevPage: 'prevPage',
                tournamentId,
              },
              getFormData({ position: 0 }),
            );
            //assert
            const tournamentWinnersAfterRemoveOnePlayerPosition =
              await getTournamentWinners(tournamentId);
            expect(
              tournamentWinnersAfterRemoveOnePlayerPosition?.tournament_id,
            ).toEqual(tournamentId);
            expect(
              tournamentWinnersAfterRemoveOnePlayerPosition?.tournament_name,
            ).toEqual(tournament.name);
            const winnersAfterRemoveOnePlayerPosition = JSON.parse(
              tournamentWinnersAfterRemoveOnePlayerPosition?.winners || '{}',
            );
            expect(
              winnersAfterRemoveOnePlayerPosition[player1PhoneNumber],
            ).toEqual({ position: 1, hasReceived: false, creditWorth: 1000 });
            expect(
              winnersAfterRemoveOnePlayerPosition[player2PhoneNumber],
            ).toEqual({ position: 2, hasReceived: false, creditWorth: 500 });
            expect(
              winnersAfterRemoveOnePlayerPosition[player3PhoneNumber],
            ).toEqual(undefined);

            //arrange
            const stringDate = 'sunday 7';
            //act
            await givePlayerPrizeOrCredit(
              {
                stringDate: tournamentWinnersAfter.date,
                userId,
                playerId: player1.id,
                prevPage: '',
                tournamentId,
              },
              {} as State,
              getFormData({
                type: 'prize',
                credit: '',
                prize: 'air pods',
                prize_worth: '600',
                credit_worth: '',
                update_player_credit: 'on',
              }),
            );

            //act
            await resetTournamentPositions(
              tournamentId,
              tournamentWinnersAfter.date,
              'prevPage',
            );

            //assert
            const tournamentWinnersAfterReset =
              await getTournamentWinners(tournamentId);
            expect(tournamentWinnersAfterReset).toEqual(undefined);

            await removeOldRsvp();
          },
          TEST_TIMEOUT,
        );
      });
    });
  });
});

//TODO:

//setPlayerPrize
//setPrizeAsReadyToBeDelivered
//setPrizeAsNotReadyToBeDelivered
//convertPrizeToCredit

// removeOldRsvp
//importPlayers
