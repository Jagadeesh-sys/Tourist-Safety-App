import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import { communityService } from '../../services/communityService';

export default function CommunityModeration() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    communityService.getModerationQueue().then((posts) =>
      setRows(posts.map((p) => ({ id: p.id, user: p.user, content: p.text, flags: p.flags }))),
    );
  }, []);

  const columns = [
    { key: 'user', label: 'User' },
    { key: 'content', label: 'Post' },
    { key: 'flags', label: 'Flags' },
  ];

  return (
    <div className="page-container">
      <PageHeader title="Community Moderation" subtitle="Review flagged posts and community content." />
      <DataTable columns={columns} rows={rows} />
    </div>
  );
}
