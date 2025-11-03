// Change imports from 'mysql-core' to 'pg-core'
import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(), // Change 'int' to 'serial' for auto-incrementing PK in PostgreSQL
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  // Change 'mysqlEnum' to a standard varchar/text type or define a custom enum in SQL if needed
  role: varchar("role", { length: 64 }).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(), // PostgreSQL handles onUpdateNow differently, usually with triggers
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Leaders table - stores information about political leaders
export const leaders = pgTable("leaders", {
  id: serial("id").primaryKey(), // Change 'int' to 'serial'
  name: varchar("name", { length: 255 }).notNull(),
  bio: text("bio"),
  manifesto: text("manifesto"),
  photoUrl: varchar("photoUrl", { length: 500 }),
  affiliation: varchar("affiliation", { length: 255 }),
  region: varchar("region", { length: 255 }),
  verified: boolean("verified").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(), // PostgreSQL handles onUpdateNow differently
});

export type Leader = typeof leaders.$inferSelect;
export type InsertLeader = typeof leaders.$inferInsert;

// Agendas table - stores policy agendas/issues
export const agendas = pgTable("agendas", {
  id: serial("id").primaryKey(), // Change 'int' to 'serial'
  leaderId: integer("leaderId").notNull(), // Use 'integer' for foreign key
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(), // PostgreSQL handles onUpdateNow differently
});

export type Agenda = typeof agendas.$inferSelect;
export type InsertAgenda = typeof agendas.$inferInsert;

// Votes table - tracks upvotes/downvotes on leaders
export const leaderVotes = pgTable("leaderVotes", {
  id: serial("id").primaryKey(), // Change 'int' to 'serial'
  leaderId: integer("leaderId").notNull(), // Use 'integer'
  userId: varchar("userId", { length: 255 }).notNull(),
  voteType: integer("voteType").notNull(), // Use 'integer'
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LeaderVote = typeof leaderVotes.$inferSelect;
export type InsertLeaderVote = typeof leaderVotes.$inferInsert;

// Agenda votes table - tracks upvotes/downvotes on agendas
export const agendaVotes = pgTable("agendaVotes", {
  id: serial("id").primaryKey(), // Change 'int' to 'serial'
  agendaId: integer("agendaId").notNull(), // Use 'integer'
  userId: varchar("userId", { length: 255 }).notNull(),
  voteType: integer("voteType").notNull(), // Use 'integer'
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AgendaVote = typeof agendaVotes.$inferSelect;
export type InsertAgendaVote = typeof agendaVotes.$inferInsert;

// Comments/Discussion threads table
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(), // Change 'int' to 'serial'
  leaderId: integer("leaderId"), // Use 'integer'
  agendaId: integer("agendaId"), // Use 'integer'
  userId: varchar("userId", { length: 255 }).notNull(),
  userName: varchar("userName", { length: 255 }),
  commentText: text("commentText").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(), // PostgreSQL handles onUpdateNow differently
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;