import { useState, useCallback, useEffect } from 'react';
import {
  fetchPasswords,
  fetchPassword,
  createPassword,
  updatePassword,
  deletePassword,
  searchPasswords,
} from '../utils/api';
import type {
  PasswordEntry,
  CreatePasswordDto,
  UpdatePasswordDto,
} from '../types/password';

interface UsePasswordsReturn {
  passwords: PasswordEntry[];
  loading: boolean;
  error: string | null;
  fetching: boolean;
  fetchAll: () => Promise<void>;
  fetchOne: (id: number) => Promise<PasswordEntry | null>;
  create: (entry: CreatePasswordDto) => Promise<PasswordEntry | null>;
  update: (id: number, entry: UpdatePasswordDto) => Promise<PasswordEntry | null>;
  remove: (id: number) => Promise<boolean>;
  search: (query: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function usePasswords(): UsePasswordsReturn {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);

  // Initial fetch on hook mount
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = useCallback(async () => {
    setFetching(true);
    setError(null);
    try {
      const data = await fetchPasswords();
      setPasswords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch passwords');
    } finally {
      setFetching(false);
    }
  }, []);

  const fetchOne = useCallback(async (id: number): Promise<PasswordEntry | null> => {
    setLoading(true);
    setError(null);
    try {
      return await fetchPassword(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch password');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(
    async (entry: CreatePasswordDto): Promise<PasswordEntry | null> => {
      setLoading(true);
      setError(null);
      try {
        const newEntry = await createPassword(entry);
        // Refresh the list to include the new entry
        await fetchAll();
        return newEntry;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create password');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchAll]
  );

  const update = useCallback(
    async (id: number, entry: UpdatePasswordDto): Promise<PasswordEntry | null> => {
      setLoading(true);
      setError(null);
      try {
        const updatedEntry = await updatePassword(id, entry);
        // Refresh the list to include the updated entry
        await fetchAll();
        return updatedEntry;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update password');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchAll]
  );

  const remove = useCallback(
    async (id: number): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const success = await deletePassword(id);
        if (success) {
          // Remove from local state immediately for better UX
          setPasswords((prev) => prev.filter((p) => p.id !== id));
        }
        return success;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete password');
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const search = useCallback(async (query: string): Promise<void> => {
    setFetching(true);
    setError(null);
    try {
      const results = await searchPasswords(query);
      setPasswords(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search passwords');
    } finally {
      setFetching(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchAll();
  }, [fetchAll]);

  return {
    passwords,
    loading,
    error,
    fetching,
    fetchAll,
    fetchOne,
    create,
    update,
    remove,
    search,
    refresh,
  };
}
