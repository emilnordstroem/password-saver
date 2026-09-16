import { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { FiEye, FiEyeOff, FiCopy, FiGlobe, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import type { PasswordEntry } from '../../types/password';
import { copyToClipboard, openUrl } from '../../utils/api';

interface PasswordDetailProps {
  password: PasswordEntry;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * PasswordDetail - Modal/drawer for viewing password details
 * Displays all fields with options to copy, edit, and delete
 */
export function PasswordDetail({ password, onClose, onEdit, onDelete }: PasswordDetailProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleCopyPassword = async () => {
    try {
      await copyToClipboard(password.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy password:', error);
    }
  };

  const handleCopyUsername = async () => {
    if (password.username) {
      try {
        await copyToClipboard(password.username);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy username:', error);
      }
    }
  };

  const handleCopyUrl = async () => {
    if (password.url) {
      try {
        await copyToClipboard(password.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy URL:', error);
      }
    }
  };

  const handleOpenUrl = async () => {
    if (password.url) {
      try {
        await openUrl(password.url);
      } catch (error) {
        console.error('Failed to open URL:', error);
      }
    }
  };

  return (
    <Card shadow="lg" radius="lg" className="password-detail-card">
      <CardHeader className="password-detail-header">
        <div className="password-detail-title-container">
          <h2 className="password-detail-title">{password.title}</h2>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={onClose}
            aria-label="Close"
          >
            <FiX size={18} />
          </Button>
        </div>
      </CardHeader>

      <Divider />

      <CardBody className="password-detail-body">
        <div className="password-detail-grid">
          {/* Username */}
          {password.username && (
            <div className="password-detail-field">
              <label className="password-detail-label">Username</label>
              <div className="password-detail-value-container">
                <span className="password-detail-value">{password.username}</span>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={handleCopyUsername}
                  aria-label="Copy username"
                >
                  <FiCopy size={14} />
                </Button>
              </div>
            </div>
          )}

          {/* Password */}
          <div className="password-detail-field">
            <label className="password-detail-label">Password</label>
            <div className="password-detail-value-container">
              <span className="password-detail-value">
                {showPassword ? password.password : '••••••••'}
              </span>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={handleCopyPassword}
                aria-label="Copy password"
              >
                <FiCopy size={14} />
              </Button>
            </div>
          </div>

          {/* URL */}
          {password.url && (
            <div className="password-detail-field">
              <label className="password-detail-label">URL</label>
              <div className="password-detail-value-container">
                <span className="password-detail-value">{password.url}</span>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={handleCopyUrl}
                  aria-label="Copy URL"
                >
                  <FiCopy size={14} />
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={handleOpenUrl}
                  aria-label="Open URL"
                >
                  <FiGlobe size={14} />
                </Button>
              </div>
            </div>
          )}

          {/* Notes */}
          {password.notes && (
            <div className="password-detail-field password-detail-notes">
              <label className="password-detail-label">Notes</label>
              <span className="password-detail-value password-detail-notes-value">
                {password.notes}
              </span>
            </div>
          )}

          {/* Created At */}
          <div className="password-detail-field">
            <label className="password-detail-label">Created</label>
            <span className="password-detail-value">
              {new Date(password.created_at).toLocaleString()}
            </span>
          </div>

          {/* Updated At */}
          <div className="password-detail-field">
            <label className="password-detail-label">Updated</label>
            <span className="password-detail-value">
              {new Date(password.updated_at).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <Divider className="password-detail-divider" />
        
        <div className="password-detail-actions">
          <Button
            variant="light"
            onPress={onClose}
            startContent={<FiX size={16} />}
          >
            Close
          </Button>
          
          <Button
            color="secondary"
            variant="flat"
            onPress={onEdit}
            startContent={<FiEdit2 size={16} />}
          >
            Edit
          </Button>
          
          <Button
            color="danger"
            variant="flat"
            onPress={onDelete}
            startContent={<FiTrash2 size={16} />}
          >
            Delete
          </Button>
        </div>

        {copied && (
          <div className="password-detail-copied-notification">
            Copied to clipboard!
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export default PasswordDetail;
