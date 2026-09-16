import { invoke } from '@tauri-apps/api/core';
import {
  PasswordEntry,
  CreatePasswordDto,
  UpdatePasswordDto,
} from '../types/password';

// Tauri command names (must match Rust backend)
const COMMANDS = {
  ADD_PASSWORD: 'add_password',
  GET_PASSWORD: 'get_password',
  LIST_PASSWORDS: 'list_passwords',
  UPDATE_PASSWORD: 'update_password',
  DELETE_PASSWORD: 'delete_password',
  SEARCH_PASSWORDS: 'search_passwords',
} as const;

/**
 * Fetch all passwords from the database
 * @returns Promise<PasswordEntry[]> - Array of all password entries
 */
export async function fetchPasswords(): Promise<PasswordEntry[]> {
  try {
    const result = await invoke<PasswordEntry[]>(COMMANDS.LIST_PASSWORDS);
    return result || [];
  } catch (error) {
    console.error('Failed to fetch passwords:', error);
    throw new Error('Failed to fetch passwords');
  }
}

/**
 * Fetch a single password by ID
 * @param id - The password entry ID
 * @returns Promise<PasswordEntry | null> - The password entry or null if not found
 */
export async function fetchPassword(id: number): Promise<PasswordEntry | null> {
  try {
    const result = await invoke<PasswordEntry | null>(COMMANDS.GET_PASSWORD, {
      id,
    });
    return result;
  } catch (error) {
    console.error(`Failed to fetch password with id ${id}:`, error);
    throw new Error('Failed to fetch password');
  }
}

/**
 * Create a new password entry
 * @param entry - The password entry to create
 * @returns Promise<PasswordEntry> - The created password entry with ID
 */
export async function createPassword(entry: CreatePasswordDto): Promise<PasswordEntry> {
  try {
    const now = new Date().toISOString();
    const fullEntry = {
      ...entry,
      username: entry.username ?? null,
      url: entry.url ?? null,
      notes: entry.notes ?? null,
      id: null,
      created_at: now,
      updated_at: now,
    } as PasswordEntry;
    const result = await invoke<PasswordEntry>(COMMANDS.ADD_PASSWORD, {
      entry: fullEntry,
    });
    return result;
  } catch (error) {
    console.error('Failed to create password:', error);
    throw new Error('Failed to create password');
  }
}

/**
 * Update an existing password entry
 * @param id - The password entry ID to update
 * @param entry - The updated password entry data
 * @returns Promise<PasswordEntry> - The updated password entry
 */
export async function updatePassword(
  id: number,
  entry: UpdatePasswordDto
): Promise<PasswordEntry> {
  try {
    const updatedEntry = {
      ...entry,
      id,
      username: entry.username ?? null,
      url: entry.url ?? null,
      notes: entry.notes ?? null,
      updated_at: new Date().toISOString(),
    } as PasswordEntry;
    const result = await invoke<PasswordEntry>(COMMANDS.UPDATE_PASSWORD, {
      id,
      entry: updatedEntry,
    });
    return result;
  } catch (error) {
    console.error(`Failed to update password with id ${id}:`, error);
    throw new Error('Failed to update password');
  }
}

/**
 * Delete a password entry by ID
 * @param id - The password entry ID to delete
 * @returns Promise<boolean> - True if deletion was successful
 */
export async function deletePassword(id: number): Promise<boolean> {
  try {
    const result = await invoke<boolean>(COMMANDS.DELETE_PASSWORD, {
      id,
    });
    return result;
  } catch (error) {
    console.error(`Failed to delete password with id ${id}:`, error);
    throw new Error('Failed to delete password');
  }
}

/**
 * Search passwords by query
 * @param query - The search query string
 * @returns Promise<PasswordEntry[]> - Array of matching password entries
 */
export async function searchPasswords(query: string): Promise<PasswordEntry[]> {
  try {
    const result = await invoke<PasswordEntry[]>(COMMANDS.SEARCH_PASSWORDS, {
      query,
    });
    return result || [];
  } catch (error) {
    console.error(`Failed to search passwords with query "${query}":`, error);
    throw new Error('Failed to search passwords');
  }
}

/**
 * Copy text to clipboard
 * @param text - The text to copy
 * @returns Promise<void>
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    // Clear clipboard after a delay for security
    setTimeout(async () => {
      try {
        await navigator.clipboard.writeText('');
      } catch {
        // Ignore clipboard clear errors
      }
    }, 10000); // Clear after 10 seconds
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    throw new Error('Failed to copy to clipboard');
  }
}

/**
 * Open URL in default browser
 * @param url - The URL to open (must include protocol)
 * @returns Promise<void>
 */
export async function openUrl(url: string): Promise<void> {
  try {
    // Ensure URL has a protocol
    let fullUrl = url;
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      fullUrl = `https://${url}`;
    }
    const { openUrl: tauriOpenUrl } = await import('@tauri-apps/plugin-opener');
    await tauriOpenUrl(fullUrl);
  } catch (error) {
    console.error(`Failed to open URL: ${url}`, error);
    throw new Error('Failed to open URL');
  }
}

/**
 * Generate a random secure password
 * @param length - Desired password length (default: 16)
 * @returns string - Random password
 */
export function generateRandomPassword(length: number = 16): string {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let password = '';
  
  // Use crypto.getRandomValues for secure randomness
  const randomValues = new Uint32Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues);
  } else {
    // Fallback for environments without crypto (less secure)
    for (let i = 0; i < length; i++) {
      randomValues[i] = Math.floor(Math.random() * charset.length);
    }
  }
  
  for (let i = 0; i < length; i++) {
    const randomIndex = randomValues[i] % charset.length;
    password += charset[randomIndex];
  }
  
  return password;
}
