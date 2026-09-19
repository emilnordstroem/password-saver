// TypeScript interface for PasswordEntry
// Matches the Rust PasswordEntry structure
export interface IPasswordEntry {
    id: number | null;
    title: string; // REQUIRED
    username?: string | null;
    password?: string | null;
    url?: string | null;
    notes?: string | null;
    created_at: string; // RFC3339 format
    updated_at: string; // RFC3339 format
}
