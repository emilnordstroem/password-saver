import React from 'react';
import { Card, CardBody, CardHeader, Button, Divider } from '@nextui-org/react';
import { FiEye, FiEdit2, FiTrash2, FiCopy, FiGlobe } from 'react-icons/fi';
import type { PasswordEntry } from '../../types/password';
import { copyToClipboard, openUrl } from '../../utils/api';

interface PasswordCardProps {
  password: PasswordEntry;
  onClick: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

/**
 * PasswordCard - Individual password entry card
 * Displays title, username, URL with masked password
 * Provides action buttons for view, edit, delete, copy
 */
export function PasswordCard({ password, onClick, onDelete, onEdit }: PasswordCardProps) {
  const handleCopyPassword = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await copyToClipboard(password.password);
      // Could add toast notification here
    } catch (error) {
      console.error('Failed to copy password:', error);
    }
  };

  const handleOpenUrl = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (password.url) {
      try {
        await openUrl(password.url);
      } catch (error) {
        console.error('Failed to open URL:', error);
      }
    }
  };

  return (
    <Card
      isPressable
      isHoverable
      onClick={onClick}
      shadow="sm"
      radius="lg"
      className="password-card"
    >
      <CardHeader className="password-card-header">
        <div className="password-card-title-container">
          <h3 className="password-card-title">{password.title}</h3>
          {password.url && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onClick={handleOpenUrl}
              aria-label="Open URL"
              className="password-card-url-button"
            >
              <FiGlobe size={16} />
            </Button>
          )}
        </div>
      </CardHeader>

      <Divider />

      <CardBody className="password-card-body">
        <div className="password-card-info">
          {password.username && (
            <p className="password-card-username">
              <span className="password-card-label">Username:</span>
              <span className="password-card-value">{password.username}</span>
            </p>
          )}
          
          {password.url && (
            <p className="password-card-url">
              <span className="password-card-label">URL:</span>
              <span className="password-card-value password-card-url-text">
                {password.url}
              </span>
            </p>
          )}
          
          <p className="password-card-password">
            <span className="password-card-label">Password:</span>
            <span className="password-card-value password-card-password-masked">
              {'••••••••'}
            </span>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onClick={handleCopyPassword}
              aria-label="Copy password"
              className="password-card-copy-button"
            >
              <FiCopy size={14} />
            </Button>
          </p>
        </div>

        <div className="password-card-actions">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            aria-label="View password"
          >
            <FiEye size={16} />
          </Button>
          
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            aria-label="Edit password"
            color="secondary"
          >
            <FiEdit2 size={16} />
          </Button>
          
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label="Delete password"
            color="danger"
          >
            <FiTrash2 size={16} />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

export default PasswordCard;
