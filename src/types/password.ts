// Password Entry types matching the Rust backend

export interface PasswordEntry {
  id: number | null;
  title: string;
  username: string | null;
  password: string;
  url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// DTO for creating a new password
export interface CreatePasswordDto {
  title: string;
  username?: string | null;
  password: string;
  url?: string | null;
  notes?: string | null;
}

// DTO for updating a password
export interface UpdatePasswordDto extends CreatePasswordDto {
  id: number;
  created_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Search parameters
export interface SearchParams {
  query: string;
}

// Form state for PasswordForm
export interface PasswordFormState {
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
}

// Initial empty form state
export const emptyPasswordFormState: PasswordFormState = {
  title: '',
  username: '',
  password: '',
  url: '',
  notes: '',
};

// Convert form state to CreatePasswordDto
export function formStateToDto(state: PasswordFormState): CreatePasswordDto {
  return {
    title: state.title,
    username: state.username || null,
    password: state.password,
    url: state.url || null,
    notes: state.notes || null,
  };
}

// Convert PasswordEntry to PasswordFormState
export function passwordEntryToFormState(entry: PasswordEntry): PasswordFormState {
  return {
    title: entry.title,
    username: entry.username || '',
    password: entry.password,
    url: entry.url || '',
    notes: entry.notes || '',
  };
}
