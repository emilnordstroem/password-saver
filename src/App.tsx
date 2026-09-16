import { useState, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { PasswordList } from './components/passwords/PasswordList';
import { PasswordForm } from './components/passwords/PasswordForm';
import { PasswordDetail } from './components/passwords/PasswordDetail';
import { DeleteConfirm } from './components/passwords/DeleteConfirm';
import { Modal } from './components/common/Modal';
import { usePasswords } from './hooks/usePasswords';
import type { PasswordEntry, PasswordFormState } from './types/password';
import { formStateToDto } from './types/password';

/**
 * App - Main application component
 * Manages all application state and integrates all components
 */
function App() {
  // Custom hook for password data
  const { passwords, loading, error, create, update, remove, search, refresh } = usePasswords();
  
  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  
  // Current password states
  const [editingPassword, setEditingPassword] = useState<PasswordEntry | null>(null);
  const [viewingPassword, setViewingPassword] = useState<PasswordEntry | null>(null);
  const [deletingPassword, setDeletingPassword] = useState<PasswordEntry | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Form loading state
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      search(query);
    } else {
      refresh();
    }
  }, [search, refresh]);

  // Open modals
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const openEditModal = (password: PasswordEntry) => {
    setEditingPassword(password);
    setIsEditModalOpen(true);
  };

  const openViewModal = (password: PasswordEntry) => {
    setViewingPassword(password);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (password: PasswordEntry) => {
    setDeletingPassword(password);
    setIsDeleteModalOpen(true);
  };

  // Close modals
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingPassword(null);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewingPassword(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingPassword(null);
  };

  // Handle form submission
  const handleAddSubmit = async (data: PasswordFormState) => {
    setFormLoading(true);
    try {
      await create(formStateToDto(data));
      closeAddModal();
    } catch (err) {
      console.error('Failed to create password:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditSubmit = async (data: PasswordFormState) => {
    if (!editingPassword) return;
    
    setFormLoading(true);
    try {
      const updateData = {
        ...formStateToDto(data),
        id: editingPassword.id!,
        created_at: editingPassword.created_at,
      };
      await update(editingPassword.id!, updateData);
      closeEditModal();
    } catch (err) {
      console.error('Failed to update password:', err);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingPassword) return;
    
    setDeleteLoading(true);
    try {
      await remove(deletingPassword.id!);
      closeDeleteModal();
    } catch (err) {
      console.error('Failed to delete password:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle delete from card
  const handleDeleteFromCard = (id: number) => {
    const passwordToDelete = passwords.find(p => p.id === id);
    if (passwordToDelete) {
      openDeleteModal(passwordToDelete);
    }
  };

  // Handle edit from detail view
  const handleEditFromDetail = () => {
    if (viewingPassword) {
      closeViewModal();
      openEditModal(viewingPassword);
    }
  };

  // Handle delete from detail view
  const handleDeleteFromDetail = () => {
    if (viewingPassword) {
      closeViewModal();
      openDeleteModal(viewingPassword);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <Header
        onAddNew={openAddModal}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />

      {/* Main Content */}
      <main className="app-main">
        {error && (
          <div className="app-error">
            <p>Error: {error}</p>
            <button onClick={refresh}>Retry</button>
          </div>
        )}

        <PasswordList
          passwords={passwords}
          loading={loading}
          onDelete={handleDeleteFromCard}
          onEdit={openEditModal}
          onView={openViewModal}
          searchQuery={searchQuery}
        />
      </main>

      {/* Add Password Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        title="Add New Password"
        size="md"
      >
        <PasswordForm
          onSubmit={handleAddSubmit}
          onCancel={closeAddModal}
          isLoading={formLoading}
          isEditing={false}
        />
      </Modal>

      {/* Edit Password Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Edit Password"
        size="md"
      >
        <PasswordForm
          initialData={editingPassword}
          onSubmit={handleEditSubmit}
          onCancel={closeEditModal}
          isLoading={formLoading}
          isEditing={true}
        />
      </Modal>

      {/* View Password Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        title="Password Details"
        size="md"
      >
        {viewingPassword && (
          <PasswordDetail
            password={viewingPassword}
            onClose={closeViewModal}
            onEdit={handleEditFromDetail}
            onDelete={handleDeleteFromDetail}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Confirm Deletion"
        size="sm"
      >
        {deletingPassword && (
          <DeleteConfirm
            password={deletingPassword}
            onConfirm={handleDelete}
            onCancel={closeDeleteModal}
            isLoading={deleteLoading}
          />
        )}
      </Modal>
    </div>
  );
}

export default App;
