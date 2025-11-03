import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import { Loader2, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();
  const { data: leaders, isLoading } = trpc.leaders.list.useQuery();

  const topLeaders = leaders?.slice(0, 6) || [];
  const trendingLeaders = leaders?.sort((a, b) => (b.votes?.total || 0) - (a.votes?.total || 0)).slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            {t('home.hero.subtitle')}
          </p>
          <div className="flex gap-4">
            <Link href="/leaders">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                {t('nav.leaders')}
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
                {t('nav.leaderboard')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Leaders Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-slate-900">
            {t('home.featured')}
          </h2>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topLeaders.map((leader) => (
                <Link key={leader.id} href={`/leaders/${leader.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <CardTitle className="text-xl">{leader.name}</CardTitle>
                      <CardDescription>{leader.affiliation}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-3">{leader.bio}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex gap-4">
                          <div className="flex items-center gap-1">
                            <ThumbsUp size={16} className="text-green-600" />
                            <span>{leader.votes?.upvotes || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsDown size={16} className="text-red-600" />
                            <span>{leader.votes?.downvotes || 0}</span>
                          </div>
                        </div>
                        <span className={`font-bold ${(leader.votes?.total || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {leader.votes?.total || 0}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Leaders Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-slate-900">
            {t('home.trending')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingLeaders.map((leader, index) => (
              <Link key={leader.id} href={`/leaders/${leader.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{leader.name}</CardTitle>
                        <CardDescription className="text-xs">{leader.region}</CardDescription>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">#{index + 1}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${(leader.votes?.total || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {leader.votes?.total || 0}
                      </p>
                      <p className="text-xs text-slate-500">{t('vote.net')}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-slate-900">
            Join the Civic Movement
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Your voice matters. Rate leaders, discuss agendas, and help shape Nepal's future.
          </p>
          <Link href="/leaders">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              {t('nav.leaders')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
