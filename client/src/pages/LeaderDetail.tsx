import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/lib/trpc';
import { useRoute } from 'wouter';
import { Loader2, ThumbsUp, ThumbsDown, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function LeaderDetail() {
  const { t } = useLanguage();
  const [, params] = useRoute('/leaders/:id');
  const leaderId = params?.id ? parseInt(params.id) : null;

  const [commentText, setCommentText] = useState('');
  const [userName, setUserName] = useState('');
  const [userVote, setUserVote] = useState<number | null>(null);

  const { data: leader, isLoading, refetch } = trpc.leaders.getById.useQuery(
    { id: leaderId! },
    { enabled: !!leaderId }
  );

  const submitVoteMutation = trpc.votes.submitLeaderVote.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const addCommentMutation = trpc.comments.addLeaderComment.useMutation({
    onSuccess: () => {
      setCommentText('');
      setUserName('');
      refetch();
    },
  });

  const handleVote = (voteType: number) => {
    if (!leaderId) return;
    setUserVote(userVote === voteType ? null : voteType);
    submitVoteMutation.mutate({ leaderId, voteType });
  };

  const handleAddComment = () => {
    if (!leaderId || !commentText.trim()) return;
    addCommentMutation.mutate({
      leaderId,
      commentText,
      userName: userName || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (!leader) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/leaders">
            <Button variant="outline" className="mb-4">
              <ArrowLeft size={16} className="mr-2" />
              Back to Leaders
            </Button>
          </Link>
          <p className="text-slate-600">Leader not found</p>
        </div>
      </div>
    );
  }

  const approvalPercentage = leader.votes?.total
    ? Math.round((leader.votes.upvotes / (leader.votes.upvotes + leader.votes.downvotes)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/leaders">
          <Button variant="outline" className="mb-6">
            <ArrowLeft size={16} className="mr-2" />
            {t('nav.leaders')}
          </Button>
        </Link>

        {/* Leader Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-4xl mb-2">{leader.name}</CardTitle>
                <CardDescription className="text-lg">
                  {leader.affiliation}
                </CardDescription>
              </div>
              {leader.verified && (
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                  ✓ {t('leader.verified')}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {leader.region && (
              <p className="text-slate-600">
                <span className="font-semibold">{t('leader.region')}:</span> {leader.region}
              </p>
            )}
            {leader.bio && (
              <div>
                <h3 className="font-semibold mb-2">{t('leader.bio')}</h3>
                <p className="text-slate-700">{leader.bio}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Voting Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('leader.rating')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Approval Meter */}
              <div className="text-center">
                <div className="mb-4">
                  <div className="text-4xl font-bold text-blue-600">
                    {approvalPercentage}%
                  </div>
                  <p className="text-slate-600">{t('vote.net')}</p>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${approvalPercentage}%` }}
                  />
                </div>
              </div>

              {/* Vote Counts */}
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {leader.votes?.upvotes || 0}
                </div>
                <p className="text-slate-600">{t('vote.upvotes')}</p>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {leader.votes?.downvotes || 0}
                </div>
                <p className="text-slate-600">{t('vote.downvotes')}</p>
              </div>
            </div>

            {/* Vote Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={() => handleVote(1)}
                variant={userVote === 1 ? 'default' : 'outline'}
                className="flex-1 py-6"
                disabled={submitVoteMutation.isPending}
              >
                <ThumbsUp size={20} className="mr-2" />
                {t('vote.upvote')}
              </Button>
              <Button
                onClick={() => handleVote(-1)}
                variant={userVote === -1 ? 'default' : 'outline'}
                className="flex-1 py-6"
                disabled={submitVoteMutation.isPending}
              >
                <ThumbsDown size={20} className="mr-2" />
                {t('vote.downvote')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Manifesto Section */}
        {leader.manifesto && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t('leader.manifesto')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed">{leader.manifesto}</p>
            </CardContent>
          </Card>
        )}

        {/* Agendas Section */}
        {leader.agendas && leader.agendas.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t('leader.agendas')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leader.agendas.map((agenda) => (
                  <div key={agenda.id} className="p-4 bg-slate-50 rounded-lg border">
                    <h4 className="font-semibold text-slate-900 mb-2">{agenda.title}</h4>
                    {agenda.description && (
                      <p className="text-slate-600 text-sm">{agenda.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t('leader.discussions')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add Comment Form */}
            <div className="space-y-4 pb-6 border-b">
              <Input
                placeholder={t('comment.name')}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <Textarea
                placeholder={t('comment.placeholder')}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleAddComment}
                  disabled={!commentText.trim() || addCommentMutation.isPending}
                >
                  {t('comment.submit')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCommentText('');
                    setUserName('');
                  }}
                >
                  {t('comment.cancel')}
                </Button>
              </div>
            </div>

            {/* Comments List */}
            {leader.comments && leader.comments.length > 0 ? (
              <div className="space-y-4">
                {leader.comments.map((comment) => (
                  <div key={comment.id} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-slate-900">
                        {comment.userName || 'Anonymous'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-slate-700">{comment.commentText}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-center py-8">
                {t('comment.noComments')}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
