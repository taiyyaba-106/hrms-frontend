import React from 'react';
import { PageHeader, Card } from '../components/ui';

const UsersPage = () => (
  <div>
    <PageHeader title="User Accounts" subtitle="System user administration" />
    <Card title="Users Management" description="Manage application accounts">
      <p style={{ color: 'var(--text-secondary)' }}>User accounts directory.</p>
    </Card>
  </div>
);

export default UsersPage;
