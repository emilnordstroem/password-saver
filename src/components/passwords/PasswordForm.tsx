import React, { useState, useEffect } from 'react';
import { Button, Input, Textarea, Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { FiEye, FiEyeOff, FiRefreshCw, FiSave, FiX } from 'react-icons/fi';
import type { PasswordEntry, PasswordFormState } from '../../types/password';
import { emptyPasswordFormState, passwordEntryToFormState } from '../../types/password';
import { generateRandomPassword } from '../../utils/api';

interface PasswordFormProps {
  initialData?: PasswordEntry | null;
  onSubmit: (data: PasswordFormState) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

/**
 * PasswordForm - Form for creating and editing password entries
 * Includes fields for title, username, password, URL, and notes
 * Supports password visibility toggle and random password generation
 */
export function PasswordForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false,
}: PasswordFormProps) {
  const [formState, setFormState] = useState<PasswordFormState>(emptyPasswordFormState);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with provided data
  useEffect(() => {
    if (initialData) {
      setFormState(passwordEntryToFormState(initialData));
    } else {
      setFormState(emptyPasswordFormState);
    }
  }, [initialData]);

  const handleChange = (field: keyof PasswordFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const generatePassword = () => {
    const newPassword = generateRandomPassword(16);
    handleChange('password', newPassword);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formState.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formState.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formState);
    }
  };

  return (
    <Card shadow="lg" radius="lg" className="password-form-card">
      <CardHeader className="password-form-header">
        <h2 className="password-form-title">
          {isEditing ? 'Edit Password' : 'Add New Password'}
        </h2>
      </CardHeader>

      <Divider />

      <CardBody>
        <form onSubmit={handleSubmit} className="password-form">
          {/* Title */}
          <Input
            label="Title"
            placeholder="e.g., My Email Account"
            value={formState.title}
            onChange={(e) => handleChange('title', e.target.value)}
            isRequired
            errorMessage={errors.title}
            isInvalid={!!errors.title}
            className="password-form-input"
          />

          {/* Username */}
          <Input
            label="Username / Email"
            placeholder="e.g., user@example.com"
            value={formState.username}
            onChange={(e) => handleChange('username', e.target.value)}
            className="password-form-input"
          />

          {/* Password */}
          <Input
            label="Password"
            placeholder="Enter password"
            type={showPassword ? 'text' : 'password'}
            value={formState.password}
            onChange={(e) => handleChange('password', e.target.value)}
            isRequired
            errorMessage={errors.password}
            isInvalid={!!errors.password}
            endContent={
              <div className="password-form-password-actions">
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
                  onClick={generatePassword}
                  aria-label="Generate random password"
                >
                  <FiRefreshCw size={16} />
                </Button>
              </div>
            }
            className="password-form-input"
          />

          {/* URL */}
          <Input
            label="URL"
            placeholder="e.g., https://example.com"
            value={formState.url}
            onChange={(e) => handleChange('url', e.target.value)}
            className="password-form-input"
          />

          {/* Notes */}
          <Textarea
            label="Notes"
            placeholder="Additional notes or information"
            value={formState.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            minRows={3}
            maxRows={6}
            className="password-form-input"
          />

          {/* Form Actions */}
          <div className="password-form-actions">
            <Button
              type="button"
              variant="light"
              onClick={onCancel}
              startContent={<FiX size={16} />}
              disabled={isLoading}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              color="primary"
              startContent={<FiSave size={16} />}
              isLoading={isLoading}
            >
              {isEditing ? 'Update Password' : 'Save Password'}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

export default PasswordForm;
