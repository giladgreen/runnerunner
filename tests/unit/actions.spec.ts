jest.mock('node-fetch', () => jest.fn());

import { PlayerDB, UserDB, LogDB, BugDB, ImageDB } from '@/app/lib/definitions';
import {
  signUp,
  createReport,
  createPlayer,
  State,
  deleteBug,
} from '../../app/lib/actions';
import {
  createDefaultUser,
  getHistoryLogs,
  getFormData,
  clearDB,
  getAllBugs,
  getAllPlayers, getAllUsers, getAllImages
} from "../helpers/dbHelper";



describe('actions', () => {
  const PHONE = '0587869900';
  const tournamentId = 'tournamentId';
  beforeEach(async () => {
    await clearDB()
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('bugs', () => {
    describe('get create and delete bugs', () => {
      it('should all work as expected', async () => {
        // arrange 1
        const bugsBefore: BugDB[] = await getAllBugs();
        expect(bugsBefore).toEqual([]);
        const description = 'do that and that';
        const  formData = getFormData({ description });
        // act 1
        await createReport('prevPage', formData);

        // assert 1
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
        const bugsAfterAddingOneMore: BugDB[] =await getAllBugs();
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
      }, 10000);
    });
  });

  describe('signUp', () => {
    describe('when creating a new user', () => {
      it('should return correct results', async () => {
        //assert 1
        const playersHistoryBefore: LogDB[] = await getHistoryLogs();
        expect(playersHistoryBefore).toEqual([]);

        const playersBefore: PlayerDB[] = await getAllPlayers();
        expect(playersBefore).toEqual([]);

        const usersBefore: UserDB[] = await getAllUsers()
        expect(usersBefore).toEqual([]);

        // arrange
        const formData = getFormData({
          phone_number: PHONE,
          password: '123456',
          name: 'israel israeli',
          marketing_approve: 'on',
        });
        process.env.LOCAL = 'true'

        // act
        await signUp(null, 'prevState', formData);

        // assert
        const usersAfter = await getAllUsers()
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
      });
    });
    describe('when trying to create existing user', () => {
      it('should return correct error', async () => {
        // arrange
        const formData = getFormData({
          phone_number: PHONE,
          password: '123456',
          name: 'israel israeli',
          marketing_approve: 'on',
        });
        process.env.LOCAL = 'true'

        // act
        await signUp(null, 'prevState', formData);
        const secondTryResult = await signUp(null, 'prevState', formData);
        // assert
        expect(secondTryResult).toEqual(
            'משתמש בעל אותו מספר טלפון כבר קיים במערכת',
        );
      });
    });
  });

  describe('players', () => {
    const userId = 'b96c34a5-57dd-4ac2-9393-3890a2531f2d';
    const phoneNumber = '0587861100';
    const otherPlayerPhone = '0587861101';
    const name = 'do a didi';
    const balance = 200;
    const note = 'some note';
    const notes = 'some note';
    const imageUrl =
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Smiley.svg/220px-Smiley.svg.png';
    beforeEach(async () => {
      await createDefaultUser(userId)
    });

    describe('when creating a legal new player', () => {
      it('should return correct results', async () => {
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
        const playerHistoryBefore: LogDB[] = await getHistoryLogs(phoneNumber);
        expect(playerHistoryBefore).toEqual([]);
        const playersBefore: PlayerDB[] = await getAllPlayers();
        expect(playersBefore).toEqual([]);
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

        // const secondTryResult = await createPlayer(
        //   'prevState',
        //   {} as State,
        //   formData,
        // );
        // expect(secondTryResult).toEqual({
        //   errors: {
        //     phone_number: ['player already exists'],
        //   },
        // });
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
        // await createPlayerUsageLog(
        //   { player: createdPlayer, prevPage: 'prevPage', userId, tournamentId },
        //   {} as State,
        //   getFormData({
        //     type: 'credit',
        //     change: 100,
        //     note,
        //   }),
        // );

        // await createPlayerUsageLog(
        //   { player: createdPlayer, prevPage: 'prevPage', userId, tournamentId },
        //   {} as State,
        //   getFormData({
        //     type: 'credit_by_other',
        //     change: 300,
        //     note,
        //     other_player: otherPlayerPhone,
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
      });
    });
    describe('when creating an existing player', () => {
      it('should return correct error', async () => {
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
        // await createPlayerUsageLog(
        //   { player: createdPlayer, prevPage: 'prevPage', userId, tournamentId },
        //   {} as State,
        //   getFormData({
        //     type: 'credit',
        //     change: 100,
        //     note,
        //   }),
        // );

        // await createPlayerUsageLog(
        //   { player: createdPlayer, prevPage: 'prevPage', userId, tournamentId },
        //   {} as State,
        //   getFormData({
        //     type: 'credit_by_other',
        //     change: 300,
        //     note,
        //     other_player: otherPlayerPhone,
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
      });
    });
    describe('when trying to create illegal player', () => {
      it('when no name - should return correct error', async () => {
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
      });
      it('when empty name - should return correct error', async () => {
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
      });
      it('when too short phone number name - should return correct error', async () => {
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
      });
      it('when ilegal balance - should return correct error', async () => {
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
      });
    });
  });
});
