import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, leaders, agendas, leaderVotes, agendaVotes, comments } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Leaders queries
export async function getAllLeaders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(leaders).orderBy(leaders.createdAt);
}

export async function getLeaderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(leaders).where(eq(leaders.id, id)).limit(1);
  return result[0];
}

// Vote queries
export async function getLeaderVotes(leaderId: number) {
  const db = await getDb();
  if (!db) return { upvotes: 0, downvotes: 0, total: 0 };
  const votes = await db.select().from(leaderVotes).where(eq(leaderVotes.leaderId, leaderId));
  const upvotes = votes.filter(v => v.voteType === 1).length;
  const downvotes = votes.filter(v => v.voteType === -1).length;
  return { upvotes, downvotes, total: upvotes - downvotes };
}

export async function getUserLeaderVote(leaderId: number, userId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(leaderVotes)
    .where(and(eq(leaderVotes.leaderId, leaderId), eq(leaderVotes.userId, userId)))
    .limit(1);
  return result[0];
}

export async function addLeaderVote(leaderId: number, userId: string, voteType: number) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(leaderVotes).values({ leaderId, userId, voteType });
}

export async function updateLeaderVote(leaderId: number, userId: string, voteType: number) {
  const db = await getDb();
  if (!db) return null;
  return db.update(leaderVotes)
    .set({ voteType })
    .where(and(eq(leaderVotes.leaderId, leaderId), eq(leaderVotes.userId, userId)));
}

// Agenda queries
export async function getLeaderAgendas(leaderId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(agendas).where(eq(agendas.leaderId, leaderId));
}

export async function getAllAgendas() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(agendas);
}

export async function getAgendaById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(agendas).where(eq(agendas.id, id)).limit(1);
  return result[0];
}

export async function getAgendaVotes(agendaId: number) {
  const db = await getDb();
  if (!db) return { upvotes: 0, downvotes: 0, total: 0 };
  const votes = await db.select().from(agendaVotes).where(eq(agendaVotes.agendaId, agendaId));
  const upvotes = votes.filter(v => v.voteType === 1).length;
  const downvotes = votes.filter(v => v.voteType === -1).length;
  return { upvotes, downvotes, total: upvotes - downvotes };
}

export async function addAgendaVote(agendaId: number, userId: string, voteType: number) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(agendaVotes).values({ agendaId, userId, voteType });
}

// Comment queries
export async function getLeaderComments(leaderId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(comments).where(eq(comments.leaderId, leaderId)).orderBy(comments.createdAt);
}

export async function getAgendaComments(agendaId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(comments).where(eq(comments.agendaId, agendaId)).orderBy(comments.createdAt);
}

export async function addComment(leaderId: number | null, agendaId: number | null, userId: string, userName: string | null, commentText: string) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(comments).values({ leaderId, agendaId, userId, userName, commentText });
}

// Leaderboard queries
export async function getLeaderboard(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  const allLeaders = await db.select().from(leaders);
  const leaderScores = await Promise.all(
    allLeaders.map(async (leader) => {
      const votes = await getLeaderVotes(leader.id);
      return { ...leader, score: votes.total };
    })
  );
  return leaderScores.sort((a, b) => b.score - a.score).slice(0, limit);
}
