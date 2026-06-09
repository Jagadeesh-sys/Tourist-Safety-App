import PageHeader from '../../components/common/PageHeader';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';

export default function OfficerProfile() {
  const { user } = useAuth();
  return (
    <div className="page-container">
      <PageHeader title="Officer Profile" subtitle="Your responder credentials and availability." />
      <form className="glass-panel mx-auto max-w-md space-y-4 p-6">
        <Input label="Name" defaultValue={user?.name} />
        <Input label="Badge ID" defaultValue="OFF-2048" />
        <Input label="Unit" defaultValue="Coastal Response Team" />
        <Button type="button">Update profile</Button>
      </form>
    </div>
  );
}
