import { Button, Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { FiAlertTriangle, FiTrash2, FiX } from 'react-icons/fi';
import type { PasswordEntry } from '../../types/password';

interface DeleteConfirmProps {
  password: PasswordEntry;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * DeleteConfirm - Confirmation dialog for deleting a password
 * Shows the password title and asks for confirmation
 */
export function DeleteConfirm({ password, onConfirm, onCancel, isLoading = false }: DeleteConfirmProps) {
  return (
    <Card shadow="lg" radius="lg" className="delete-confirm-card">
      <CardHeader className="delete-confirm-header">
        <div className="delete-confirm-icon">
          <FiAlertTriangle size={24} color="#ef4444" />
        </div>
        <h2 className="delete-confirm-title">Delete Password</h2>
      </CardHeader>

      <Divider />

      <CardBody className="delete-confirm-body">
        <p className="delete-confirm-message">
          Are you sure you want to delete <strong>"{password.title}"</strong>?
        </p>
        
        <p className="delete-confirm-warning">
          This action cannot be undone. The password entry will be permanently removed.
        </p>

        <div className="delete-confirm-actions">
          <Button
            variant="light"
            onPress={onCancel}
            startContent={<FiX size={16} />}
            disabled={isLoading}
          >
            Cancel
          </Button>
          
          <Button
            color="danger"
            onPress={onConfirm}
            startContent={<FiTrash2 size={16} />}
            isLoading={isLoading}
          >
            Delete Permanently
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

export default DeleteConfirm;
