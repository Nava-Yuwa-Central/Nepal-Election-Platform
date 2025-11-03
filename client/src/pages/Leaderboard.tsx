import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import { Loader2, ThumbsUp, ThumbsDown, Trophy } from 'lucide-react';

export default function Leaderboard() {
  const { t } = useLanguage();
  const { data: leaderboard, isLoading } = trpc.leaders.leaderboard.useQuery({ limit: 50 });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="text-yellow-600" size={32} />
            <h1 className="text-4xl font-bold text-slate-900">
              {t('leaderboard.title')}
            </h1>
          </div>
          <p className="text-slate-600">
            Top-rated leaders by public approval
          </p>
        </div>

        {/* Leaderboard Table */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : leaderboard && leaderboard.length > 0 ? (
          <div className="space-y-4">
            {leaderboard.map((leader, index) => {
              const medal =
                index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : null;

              return (
                <Link key={leader.id} href={`/leaders/${leader.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div className="text-center min-w-16">
                          {medal ? (
                            <span className="text-3xl">{medal}</span>
                          ) : (
                            <span className="text-2xl font-bold text-slate-400">
                              #{index + 1}
                            </span>
                          )}
                        </div>

                        {/* Leader Info */}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900">
                            {leader.name}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {leader.affiliation}
                            {leader.region && ` • ${leader.region}`}
                          </p>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {leader.bio}
                          </p>
                        </div>

                        {/* Vote Stats */}
                        <div className="flex items-center gap-6 min-w-fit">
                          <div className="text-center">
                            <div className="flex items-center gap-1 mb-1">
                              <ThumbsUp size={16} className="text-green-600" />
                              <span className="font-semibold text-green-600">
                                {(leader as any).votes?.upvotes || 0}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              {t('vote.upvotes')}
                            </p>
                          </div>

                          <div className="text-center">
                            <div className="flex items-center gap-1 mb-1">
                              <ThumbsDown size={16} className="text-red-600" />
                              <span className="font-semibold text-red-600">
                                {(leader as any).votes?.downvotes || 0}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              {t('vote.downvotes')}
                            </p>
                          </div>

                          {/* Net Score */}
                          <div className="text-center min-w-20">
                            <div
                              className={`text-3xl font-bold ${
                                ((leader as any).votes?.total || 0) > 0
                                  ? 'text-green-600'
                                  : ((leader as any).votes?.total || 0) < 0
                                  ? 'text-red-600'
                                  : 'text-slate-600'
                              }`}
                            >
                              {(leader as any).votes?.total || 0}
                            </div>
                            <p className="text-xs text-slate-500">
                              {t('vote.net')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">{t('general.noResults')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
