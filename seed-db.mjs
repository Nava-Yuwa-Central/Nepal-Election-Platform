import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './drizzle/schema.ts';
import fs from 'fs';
import { parse } from 'csv-parse';

// Hardcoded agenda data - assuming this might still be static for now or come from a separate source
const agendaData = [
  { title: "Anti-Corruption Reforms", description: "Establish independent oversight bodies and strengthen audits" },
  { title: "Constitutional Democracy", description: "Uphold constitutional values and strengthen democratic institutions" },
  { title: "Youth Empowerment", description: "Create opportunities and policies focused on youth development" },
  { title: "Judicial Independence", description: "Ensure independent and impartial judiciary" },
  { title: "Electoral Transparency", description: "Implement fair and transparent election processes" },
  { title: "Federalism Reforms", description: "Strengthen federal structure with inclusive governance" },
  { title: "Accountability in Government", description: "Hold leaders accountable for their actions" },
  { title: "Merit-Based Civil Service", description: "Establish merit-based hiring and promotion in government" }
];

async function readCsv(filePath) {
  return new Promise((resolve, reject) => {
    const records = [];
    fs.createReadStream(filePath)
      .pipe(parse({
        columns: true, // Treat the first row as column headers
        skip_empty_lines: true
      }))
      .on('data', (record) => {
        records.push(record);
      })
      .on('end', () => {
        resolve(records);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

async function seed() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set in .env.local');
    }

    const client = new Client(process.env.DATABASE_URL);
    await client.connect();
    const db = drizzle(client, { schema });

    console.log('🌱 Seeding database...');

    // Read leader data from CSV
    console.log('📖 Reading leader data from CSV...');
    const rawLeaderData = await readCsv('./data/leaders.csv'); // Assuming leaders.csv
    console.log(`✅ Read ${rawLeaderData.length} leaders from CSV`);

    // Map CSV data to Drizzle schema format using the actual CSV headers
    const leaderData = rawLeaderData.map(record => ({
      name: record['Column 1'], // Mapped from 'Column 1'
      bio: record.Background,   // Mapped from 'Background'
      manifesto: record.Agenda, // Mapped from 'Agenda'
      photoUrl: '',             // Not in CSV, set to empty string
      affiliation: record.Leadership, // Mapped from 'Leadership'
      region: '',               // Not in CSV, set to empty string
      // Convert "Yes" to true, anything else (like "No") to false
      verified: record['Verified Source'] === 'Yes',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Insert leaders
    console.log('📝 Inserting leaders...');
    const insertedLeaders = await db.insert(schema.leaders).values(leaderData)
      .returning({ id: schema.leaders.id });
    console.log(`✅ Inserted ${insertedLeaders.length} leaders`);

    // Insert agendas, linking them to leaders
    console.log('📋 Inserting agendas...');
    const agendasToInsert = [];
    for (let i = 0; i < insertedLeaders.length; i++) {
      const leaderId = insertedLeaders[i].id;
      const agendaCount = (i + 1) % 2 === 0 ? 2 : 1;
      for (let j = 0; j < agendaCount; j++) {
        const agendaIndex = (i + j) % agendaData.length;
        agendasToInsert.push({
          leaderId: leaderId,
          title: agendaData[agendaIndex].title,
          description: agendaData[agendaIndex].description,
          category: 'Policy',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    if (agendasToInsert.length > 0) {
      await db.insert(schema.agendas).values(agendasToInsert);
      console.log(`✅ Inserted ${agendasToInsert.length} agendas`);
    }

    console.log('🎉 Database seeding completed!');
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();