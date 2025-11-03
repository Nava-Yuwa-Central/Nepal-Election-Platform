import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const leaderData = [
  {
    name: "Rakshya Bam",
    bio: "Activist from Kailali (Sudurpaschim); former social-work student and community volunteer.",
    manifesto: "Urges Nepali youth to stay politically engaged; calls for accountability on past corruption and fair elections.",
    affiliation: "Gen Z Movement",
    region: "Sudurpaschim",
    verified: true
  },
  {
    name: "Prabesh Dahal",
    bio: "Biratnagar law student; Gen Z faction leader advocating reform.",
    manifesto: "Supports introducing a directly elected executive head (with recall option) in upcoming elections.",
    affiliation: "Gen Z Movement",
    region: "Koshi",
    verified: true
  },
  {
    name: "Miraj Dhungana",
    bio: "Prominent Gen Z activist (Kathmandu); recently announced a new political party.",
    manifesto: "Calls for a directly elected executive and overseas voting rights for Nepalis.",
    affiliation: "Gen Z Movement",
    region: "Bagmati",
    verified: true
  },
  {
    name: "Yujan Rajbhandari",
    bio: "24-year-old student leader who united Gen Z protesters online.",
    manifesto: "Demands corruption-free institutions and youth-focused reforms; helped select Sushila Karki as interim PM.",
    affiliation: "Gen Z Movement Alliance",
    region: "Bagmati",
    verified: true
  },
  {
    name: "Amit Khanal",
    bio: "24-year-old youth activist; part of the Gen-Z Movement Alliance.",
    manifesto: "Calls for controlling corruption and greater accountability in government.",
    affiliation: "Gen Z Movement Alliance",
    region: "Bagmati",
    verified: true
  },
  {
    name: "Purushottam Yadav",
    bio: "27-year-old youth leader from Siraha; MBA student turned anti-corruption activist.",
    manifesto: "Demands integrity, transparency and anti-corruption reforms in governance.",
    affiliation: "Gen Z Movement",
    region: "Madhesh",
    verified: true
  },
  {
    name: "Tanuja Pandey",
    bio: "Gen-Z activist and advocate of inclusive federalism.",
    manifesto: "Insists reforms stay within the constitution; opposes direct election of the prime minister; promotes accountability and inclusion.",
    affiliation: "Gen Z Movement",
    region: "Bagmati",
    verified: true
  },
  {
    name: "Sudan Gurung",
    bio: "36-year-old founder of the youth group Hami Nepal; former DJ who organized the protests via Discord.",
    manifesto: "Advocates transparency and people's power; vows to bring corrupt leaders to justice.",
    affiliation: "Hami Nepal",
    region: "Bagmati",
    verified: true
  },
  {
    name: "Ojaswi Raj Thapa",
    bio: "24-year-old cafe owner; Gen-Z volunteer and protest organizer.",
    manifesto: "Demands judicial independence and upholding the constitution.",
    affiliation: "Gen Z Movement",
    region: "Bagmati",
    verified: true
  },
  {
    name: "Rehan Raj Dangal",
    bio: "Law graduate; Gen-Z activist coordinating Hami Nepal's online channels.",
    manifesto: "Supports judicial independence and protecting constitutional democracy.",
    affiliation: "Hami Nepal",
    region: "Bagmati",
    verified: true
  },
  {
    name: "Bablu Gupta",
    bio: "Gen-Z activist; links governance with the economy; calls for stable government and rule of law.",
    manifesto: "Advocates performance-based federalism and transparent, development-oriented governance.",
    affiliation: "Gen Z Movement",
    region: "Bagmati",
    verified: true
  },
  {
    name: "Bikash Yadav",
    bio: "Gen-Z activist; emphasizes that corruption is a systemic problem.",
    manifesto: "Demands depoliticized oversight bodies, stronger audits, and a merit-based civil service.",
    affiliation: "Gen Z Movement",
    region: "Bagmati",
    verified: true
  },
  {
    name: "James Karki",
    bio: "Gen-Z activist; emphasizes constitutional democracy and rule of law.",
    manifesto: "Advocates upholding the constitution and vigilant citizen oversight.",
    affiliation: "Gen Z Movement",
    region: "Bagmati",
    verified: true
  },
  {
    name: "Diwakar Dangal",
    bio: "Gen-Z leader; part of the delegation in talks with Nepal's president and army.",
    manifesto: "Calls for dissolving parliament while preserving the constitution.",
    affiliation: "Gen Z Movement",
    region: "Bagmati",
    verified: true
  }
];

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

async function seed() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    const db = drizzle(connection);

    console.log('🌱 Seeding database...');

    // Insert leaders
    console.log('📝 Inserting leaders...');
    await connection.query(`
      INSERT INTO leaders (name, bio, manifesto, affiliation, region, verified, createdAt, updatedAt)
      VALUES ${leaderData.map(() => '(?, ?, ?, ?, ?, ?, NOW(), NOW())').join(',')}
    `, leaderData.flatMap(l => [l.name, l.bio, l.manifesto, l.affiliation, l.region, l.verified ? 1 : 0]));
    console.log(`✅ Inserted ${leaderData.length} leaders`);

    // Insert agendas for each leader
    console.log('📋 Inserting agendas...');
    const agendaValues = [];
    for (let i = 1; i <= leaderData.length; i++) {
      const agendaCount = i % 2 === 0 ? 2 : 1;
      for (let j = 0; j < agendaCount; j++) {
        const agendaIndex = (i + j) % agendaData.length;
        agendaValues.push([
          i,
          agendaData[agendaIndex].title,
          agendaData[agendaIndex].description,
          'Policy'
        ]);
      }
    }
    
    if (agendaValues.length > 0) {
      await connection.query(`
        INSERT INTO agendas (leaderId, title, description, category, createdAt, updatedAt)
        VALUES ${agendaValues.map(() => '(?, ?, ?, ?, NOW(), NOW())').join(',')}
      `, agendaValues.flat());
      console.log(`✅ Inserted ${agendaValues.length} agendas`);
    }

    console.log('🎉 Database seeding completed!');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
