import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  getAllLeaders,
  getLeaderById,
  getLeaderVotes,
  getUserLeaderVote,
  addLeaderVote,
  updateLeaderVote,
  getLeaderAgendas,
  getAllAgendas,
  getAgendaById,
  getAgendaVotes,
  addAgendaVote,
  getLeaderComments,
  getAgendaComments,
  addComment,
  getLeaderboard,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Leaders endpoints
  leaders: router({
    // Get all leaders with vote counts
    list: publicProcedure.query(async () => {
      const allLeaders = await getAllLeaders();
      const leadersWithVotes = await Promise.all(
        allLeaders.map(async (leader) => {
          const votes = await getLeaderVotes(leader.id);
          return {
            ...leader,
            votes,
          };
        })
      );
      return leadersWithVotes;
    }),

    // Get leader details by ID
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const leader = await getLeaderById(input.id);
        if (!leader) return null;
        const votes = await getLeaderVotes(leader.id);
        const agendas = await getLeaderAgendas(leader.id);
        const comments = await getLeaderComments(leader.id);
        return {
          ...leader,
          votes,
          agendas,
          comments,
        };
      }),

    // Get leaderboard (top leaders by approval rating)
    leaderboard: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        const limit = input?.limit || 10;
        return getLeaderboard(limit);
      }),

    // Search leaders by name, region, or affiliation
    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        const allLeaders = await getAllLeaders();
        const query = input.query.toLowerCase();
        const filtered = allLeaders.filter(
          (leader) =>
            leader.name.toLowerCase().includes(query) ||
            leader.region?.toLowerCase().includes(query) ||
            leader.affiliation?.toLowerCase().includes(query)
        );
        const withVotes = await Promise.all(
          filtered.map(async (leader) => {
            const votes = await getLeaderVotes(leader.id);
            return { ...leader, votes };
          })
        );
        return withVotes;
      }),
  }),

  // Votes endpoints
  votes: router({
    // Get vote summary for a leader
    getLeaderVotes: publicProcedure
      .input(z.object({ leaderId: z.number() }))
      .query(async ({ input }) => {
        return getLeaderVotes(input.leaderId);
      }),

    // Submit or update a vote on a leader
    submitLeaderVote: publicProcedure
      .input(z.object({ leaderId: z.number(), voteType: z.number() }))
      .mutation(async ({ input, ctx }) => {
        // Use user ID if authenticated, otherwise use device fingerprint
        const userId = ctx.user?.id?.toString() || ctx.req.headers["user-agent"] || "anonymous";
        
        // Check if user already voted
        const existingVote = await getUserLeaderVote(input.leaderId, userId);
        
        if (existingVote) {
          // Update existing vote
          if (existingVote.voteType === input.voteType) {
            // Same vote, remove it
            await updateLeaderVote(input.leaderId, userId, 0);
          } else {
            // Different vote, update it
            await updateLeaderVote(input.leaderId, userId, input.voteType);
          }
        } else {
          // Add new vote
          await addLeaderVote(input.leaderId, userId, input.voteType);
        }
        
        return getLeaderVotes(input.leaderId);
      }),

    // Get vote summary for an agenda
    getAgendaVotes: publicProcedure
      .input(z.object({ agendaId: z.number() }))
      .query(async ({ input }) => {
        return getAgendaVotes(input.agendaId);
      }),

    // Submit a vote on an agenda
    submitAgendaVote: publicProcedure
      .input(z.object({ agendaId: z.number(), voteType: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const userId = ctx.user?.id?.toString() || ctx.req.headers["user-agent"] || "anonymous";
        await addAgendaVote(input.agendaId, userId, input.voteType);
        return getAgendaVotes(input.agendaId);
      }),
  }),

  // Agendas endpoints
  agendas: router({
    // Get all agendas
    list: publicProcedure.query(async () => {
      const allAgendas = await getAllAgendas();
      const agendasWithVotes = await Promise.all(
        allAgendas.map(async (agenda) => {
          const votes = await getAgendaVotes(agenda.id);
          return { ...agenda, votes };
        })
      );
      return agendasWithVotes;
    }),

    // Get agenda details by ID
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const agenda = await getAgendaById(input.id);
        if (!agenda) return null;
        const votes = await getAgendaVotes(agenda.id);
        const comments = await getAgendaComments(agenda.id);
        return { ...agenda, votes, comments };
      }),

    // Get agendas for a specific leader
    getByLeader: publicProcedure
      .input(z.object({ leaderId: z.number() }))
      .query(async ({ input }) => {
        const agendas = await getLeaderAgendas(input.leaderId);
        const withVotes = await Promise.all(
          agendas.map(async (agenda) => {
            const votes = await getAgendaVotes(agenda.id);
            return { ...agenda, votes };
          })
        );
        return withVotes;
      }),
  }),

  // Comments/Discussion endpoints
  comments: router({
    // Get comments for a leader
    getLeaderComments: publicProcedure
      .input(z.object({ leaderId: z.number() }))
      .query(async ({ input }) => {
        return getLeaderComments(input.leaderId);
      }),

    // Get comments for an agenda
    getAgendaComments: publicProcedure
      .input(z.object({ agendaId: z.number() }))
      .query(async ({ input }) => {
        return getAgendaComments(input.agendaId);
      }),

    // Add a comment to a leader's profile
    addLeaderComment: publicProcedure
      .input(z.object({
        leaderId: z.number(),
        commentText: z.string().min(1).max(1000),
        userName: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const userId = ctx.user?.id?.toString() || ctx.req.headers["user-agent"] || "anonymous";
        const userName = input.userName || ctx.user?.name || "Anonymous";
        
        await addComment(input.leaderId, null, userId, userName, input.commentText);
        return getLeaderComments(input.leaderId);
      }),

    // Add a comment to an agenda
    addAgendaComment: publicProcedure
      .input(z.object({
        agendaId: z.number(),
        commentText: z.string().min(1).max(1000),
        userName: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const userId = ctx.user?.id?.toString() || ctx.req.headers["user-agent"] || "anonymous";
        const userName = input.userName || ctx.user?.name || "Anonymous";
        
        await addComment(null, input.agendaId, userId, userName, input.commentText);
        return getAgendaComments(input.agendaId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
