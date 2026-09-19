// Matches the Rust PasswordEntry structure
export interface ILoginEntry {
    id: number | null;
    title: string; // REQUIRED
    username?: string;
    password?: string;
    url?: string;
    note?: string;
    created_at: string; // RFC3339 format
    updated_at: string; // RFC3339 format
}
