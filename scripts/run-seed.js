const { seed } = require('./seed');

async function main() {
  console.log('>> running seed');
  await seed();
}

main();
