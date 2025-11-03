import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import { Loader2, ThumbsUp, ThumbsDown, Search } from 'lucide-react';

export default function Leaders() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const { data: allLeaders, isLoading } = trpc.leaders.list.useQuery();
  const { data: searchResults } = trpc.leaders.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );

  const leaders = searchQuery ? searchResults : allLeaders;
  const regions = Array.from(new Set(allLeaders?.map(l => l.region).filter(Boolean))) || [];

  const filteredLeaders = selectedRegion
    ? leaders?.filter(l => l.region === selectedRegion)
    : leaders;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {t('nav.leaders')}
          </h1>
          <p className="text-slate-600">
            Discover and rate Nepal's Gen Z leaders
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <Input
              placeholder={t('nav.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 text-base"
            />
          </div>

          {/* Region Filter */}
          {regions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedRegion === null ? 'default' : 'outline'}
                onClick={() => setSelectedRegion(null)}
                size="sm"
              >
                All Regions
              </Button>
              {regions.map((region) => (
                <Button
                  key={region}
                  variant={selectedRegion === region ? 'default' : 'outline'}
                  onClick={() => setSelectedRegion(region)}
                  size="sm"
                >
                  {region}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Leaders Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : filteredLeaders && filteredLeaders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeaders.map((leader) => (
              <Link key={leader.id} href={`/leaders/${leader.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{leader.name}</CardTitle>
                        <CardDescription>{leader.affiliation}</CardDescription>
                      </div>
                      {leader.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {t('leader.verified')}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-1">{leader.bio}</p>
                    <div className="space-y-2 mb-4">
                      {leader.region && (
                        <p className="text-xs text-slate-500">
                          <span className="font-semibold">{t('leader.region')}:</span> {leader.region}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1">
                          <ThumbsUp size={16} className="text-green-600" />
                          <span className="text-sm">{leader.votes?.upvotes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsDown size={16} className="text-red-600" />
                          <span className="text-sm">{leader.votes?.downvotes || 0}</span>
                        </div>
                      </div>
                      <span className={`font-bold text-sm ${(leader.votes?.total || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {leader.votes?.total || 0}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
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
