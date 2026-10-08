import React from 'react';
import { PageHeader, Card } from '../components/ui';

const RolesPermissionsPage = () => (
  <div>
    <PageHeader title="Roles & Permissions" subtitle="Manage RBAC roles and granular access rules" />
    <Card title="Roles & Permissions Matrix" description="Role-based access control">
      <p style={{ color: 'var(--text-secondary)' }}>System roles and permission assignments.</p>
    </Card>
  </div>
);

export default RolesPermissionsPage;
