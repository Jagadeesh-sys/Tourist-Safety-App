import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import { communityService } from '../../services/communityService';

export default function CommunityFeed() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');

  const load = () => communityService.getPosts().then(setPosts);

  useEffect(() => {
    load();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await communityService.createPost(text);
    setText('');
    load();
  };

  return (
    <div className="page-container">
      <PageHeader title="Community Feed" subtitle="Travel tips and safety updates from fellow tourists." />
      <form onSubmit={handlePost} className="glass-panel mb-6 flex gap-2 p-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 rounded-xl border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
          placeholder="Share a safety tip…"
        />
        <Button type="submit">Post</Button>
      </form>
      <div className="space-y-4">
        {posts.map((p) => (
          <article key={p.id} className="glass-panel p-5">
            <p className="font-semibold">{p.user}</p>
            <p className="mt-2 text-slate-600 dark:text-slate-300">{p.text}</p>
            <p className="mt-3 text-xs text-slate-400">❤️ {p.likes} helpful</p>
          </article>
        ))}
      </div>
    </div>
  );
}
