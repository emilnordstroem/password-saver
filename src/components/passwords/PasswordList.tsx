import { Spinner } from '@nextui-org/react';
import type { PasswordEntry } from '../../types/password';
import { PasswordCard } from './PasswordCard';
import { EmptyState } from '../common/EmptyState';

interface PasswordListProps {
  passwords: PasswordEntry[];
  loading?: boolean;
  onDelete: (id: number) => void;
  onEdit: (password: PasswordEntry) => void;
  onView: (password: PasswordEntry) => void;
  searchQuery?: string;
}

/**
 * PasswordList - Displays a grid of password cards
 * Shows loading state and empty state when appropriate
 */
export function PasswordList({
  passwords,
  loading = false,
  onDelete,
  onEdit,
  onView,
  searchQuery,
}: PasswordListProps) {
  if (loading) {
    return (
      <div className="password-list-loading">
        <Spinner size="lg" />
        <p>Loading passwords...</p>
      </div>
    );
  }

  if (passwords.length === 0) {
    return (
      <EmptyState
        icon={<span className="empty-state-icon">🔒</span>}
        title={searchQuery ? 'No results found' : 'No passwords yet'}
        description={
          searchQuery
            ? `No passwords match your search for "${searchQuery}"`
            : 'Start by adding your first password entry'
        }
        actionText="Add Password"
      />
    );
  }

  return (
    <div className="password-list">
      {passwords.map((password) => (
        <PasswordCard
          key={password.id || `new-${password.title}`}
          password={password}
          onClick={() => onView(password)}
          onDelete={() => onDelete(password.id!)}
          onEdit={() => onEdit(password)}
        />
      ))}
    </div>
  );
}

export default PasswordList;
