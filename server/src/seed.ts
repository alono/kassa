import { getDb } from './models/schema.js';

async function seed() {
  const db = await getDb();

  console.log('Clearing existing data...');
  await db.run('DELETE FROM donations');
  await db.run('DELETE FROM users');
  await db.run('DELETE FROM sqlite_sequence WHERE name IN ("users", "donations")');

  const rootUsernames = ['Alice', 'Bob', 'Charlie', 'David'];
  const otherUsernames = [
    'Emma', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack', 'Kate', 'Leo', 'Mia', 'Noah',
    'Olivia', 'Paul', 'Quinn', 'Rose', 'Sam', 'Tara', 'Uma', 'Victor', 'Wendy', 'Xander',
    'Yara', 'Zane', 'Aiden', 'Bella', 'Caleb', 'Daisy', 'Ethan', 'Fiona', 'Gavin', 'Hazel',
    'Ian', 'Jade', 'Kai', 'Luna', 'Mason', 'Nora', 'Owen', 'Piper', 'Reed', 'Stella',
    'Theo', 'Veda', 'Wyatt', 'Xena', 'Yosef', 'Zoe', 'Aaron', 'Brooks', 'Clara', 'Duke',
    'Elena', 'Finn', 'Gia', 'Hugo', 'Isla', 'Jude', 'Kira', 'Luka', 'Maya', 'Nico',
    'Otis', 'Phoebe', 'Rhys', 'Sienna', 'Toby', 'Uri', 'Vera', 'Wells', 'Xia', 'Yael',
    'Zion', 'Amara', 'Bodhi', 'Callie', 'Dante', 'Elise', 'Felix', 'Gwen', 'Holden', 'Iris'
  ];

  console.log(`Seeding ${rootUsernames.length} root users...`);
  const rootIds: number[] = [];
  for (const username of rootUsernames) {
    const result = await db.run('INSERT INTO users (username, referrer_id) VALUES (?, ?)', [username, null]);
    rootIds.push(result.lastID!);
  }

  const allUserIds = [...rootIds];
  const userMap = new Map<number, string>();
  rootUsernames.forEach((name, i) => userMap.set(rootIds[i], name));

  console.log(`Seeding ${otherUsernames.length} referred users...`);
  for (const username of otherUsernames) {
    // Pick a random existing user as a referrer
    const referrerId = allUserIds[Math.floor(Math.random() * allUserIds.length)];
    const result = await db.run('INSERT INTO users (username, referrer_id) VALUES (?, ?)', [username, referrerId]);
    const userId = result.lastID!;
    allUserIds.push(userId);
    userMap.set(userId, username);
  }

  console.log('Seeding random donations...');
  for (const userId of allUserIds) {
    // 1 to 3 donations per user
    const donationCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < donationCount; i++) {
      const amount = Math.floor(Math.random() * 500) + 10; // $10 to $510
      await db.run('INSERT INTO donations (user_id, amount) VALUES (?, ?)', [userId, amount]);
    }
  }

  console.log('Seeding complete!');
  const userCount = await db.get('SELECT COUNT(*) as count FROM users');
  const donationCount = await db.get('SELECT COUNT(*) as count FROM donations');
  console.log(`Total users: ${userCount.count}`);
  console.log(`Total donations: ${donationCount.count}`);

  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
