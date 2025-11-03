import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Leaders table - stores information about political leaders
export const leaders = mysqlTable("leaders", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  bio: text("bio"),
  manifesto: text("manifesto"),
  photoUrl: varchar("photoUrl", { length: 500 }),
  affiliation: varchar("affiliation", { length: 255 }),
  region: varchar("region", { length: 255 }),
  verified: boolean("verified").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Leader = typeof leaders.$inferSelect;
export type InsertLeader = typeof leaders.$inferInsert;

// Agendas table - stores policy agendas/issues
export const agendas = mysqlTable("agendas", {
  id: int("id").autoincrement().primaryKey(),
  leaderId: int("leaderId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Agenda = typeof agendas.$inferSelect;
export type InsertAgenda = typeof agendas.$inferInsert;

// Votes table - tracks upvotes/downvotes on leaders
export const leaderVotes = mysqlTable("leaderVotes", {
  id: int("id").autoincrement().primaryKey(),
  leaderId: int("leaderId").notNull(),
  userId: varchar("userId", { length: 255 }).notNull(),
  voteType: int("voteType").notNull(), // +1 for upvote, -1 for downvote
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LeaderVote = typeof leaderVotes.$inferSelect;
export type InsertLeaderVote = typeof leaderVotes.$inferInsert;

// Agenda votes table - tracks upvotes/downvotes on agendas
export const agendaVotes = mysqlTable("agendaVotes", {
  id: int("id").autoincrement().primaryKey(),
  agendaId: int("agendaId").notNull(),
  userId: varchar("userId", { length: 255 }).notNull(),
  voteType: int("voteType").notNull(), // +1 for upvote, -1 for downvote
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AgendaVote = typeof agendaVotes.$inferSelect;
export type InsertAgendaVote = typeof agendaVotes.$inferInsert;

// Comments/Discussion threads table
export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  leaderId: int("leaderId"),
  agendaId: int("agendaId"),
  userId: varchar("userId", { length: 255 }).notNull(),
  userName: varchar("userName", { length: 255 }),
  commentText: text("commentText").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;