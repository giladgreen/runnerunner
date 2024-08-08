const { db } = require('@vercel/postgres');
const _ = require('lodash');

function reverse(str) {
  // Step 1. Use the split() method to return a new array
  var splitString = str.split(''); // var splitString = "hello".split("");
  // ["h", "e", "l", "l", "o"]

  // Step 2. Use the reverse() method to reverse the new created array
  var reverseArray = splitString.reverse(); // var reverseArray = ["h", "e", "l", "l", "o"].reverse();
  // ["o", "l", "l", "e", "h"]

  // Step 3. Use the join() method to join all elements of the array into a string
  var joinArray = reverseArray.join(''); // var joinArray = ["o", "l", "l", "e", "h"].join("");
  // "olleh"

  //Step 4. Return the reversed string
  return joinArray; // "olleh"
}

const levenshteinDistance = (s, t) => {
  if (!s.length) return t.length;
  if (!t.length) return s.length;
  const arr = [];
  for (let i = 0; i <= t.length; i++) {
    arr[i] = [i];
    for (let j = 1; j <= s.length; j++) {
      arr[i][j] =
        i === 0
          ? j
          : Math.min(
              arr[i - 1][j] + 1,
              arr[i][j - 1] + 1,
              arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1),
            );
    }
  }
  return arr[t.length][s.length];
};

async function main() {
  console.log('>> find start');

  const client = await db.connect();
  try {
    // Create the "rsvp" table if it doesn't exist
    const players = (await client.sql`SELECT * FROM players ORDER BY name ASC;`)
      .rows;
    for (let i = 0; i < players.length - 1; i++) {
      const playerA = players[i];
      const playerAName = playerA.name;
      const playerAPhone = playerA.phone_number;
      if (Number(playerAPhone) > 55555) {
        continue;
      }
      if (
        [
          '01004',
          '01019',
          '01007',
          '01010',
          '01034',
          '01090',
          '01110',
          '01116',
          '01123',
          '01177',
          '01186',
          '01203',
          '01232',
          '01247',
          '01298',
          '01333',
          '01354',
          '01358',
          '01366',
        ].includes(playerAPhone)
      ) {
        continue;
      }
      for (let j = 0; j < players.length; j++) {
        if (j === i) {
          continue;
        }
        const playerB = players[j];
        const playerBName = playerB.name;
        const playerBPhone = playerB.phone_number;
        if (['0502446359', '0548145677', '0524313053'].includes(playerBPhone)) {
          continue;
        }

        if (Number(playerBPhone) < 55555) {
          continue;
        }

        const dis = levenshteinDistance(
          playerA.name.replaceAll(' ', ''),
          playerB.name.replaceAll(' ', ''),
        );
        if (dis < 3) {
          console.log(
            '## ',
            reverse(playerAName),
            playerAPhone,
            ', balance:',
            playerA.balance,
            ' | ',
            reverse(playerBName),
            playerBPhone,
            ', balance:',
            playerB.balance,
          );
        }
      }
    }
    // console.log(`players`, players.rows.length);
  } catch (error) {
    console.error('Error finding duplications:', error);
    throw error;
  }

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to find player duplications',
    err,
  );
});
