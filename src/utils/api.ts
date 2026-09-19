import { invoke } from "@tauri-apps/api/core";
import { ICredentialsEntry } from "@src/types/credentials";

// Map the frontend ICredentialsEntry to the backend PasswordEntry format
export interface IPasswordEntry {
    id: number | null;
    title: string;
    username?: string | null;
    password?: string | null;
    url?: string | null;
    notes?: string | null;
    created_at: string;
    updated_at: string;
}

// Convert frontend credentials to backend format
function toBackendEntry(cred: ICredentialsEntry, forCreate: boolean = false): IPasswordEntry {
    return {
        id: forCreate ? 0 : (cred.id || 0),
        title: cred.title,
        username: cred.username || null,
        password: cred.password || null,
        url: cred.url || null,
        notes: cred.note || null,
        created_at: cred.created_at,
        updated_at: cred.updated_at,
    };
}

// Convert backend entry to frontend format
function fromBackendEntry(entry: any): ICredentialsEntry {
    return {
        id: entry.id,
        title: entry.title,
        username: entry.username || undefined,
        password: entry.password || undefined,
        url: entry.url || undefined,
        note: entry.notes || entry.note || undefined,
        created_at: entry.created_at,
        updated_at: entry.updated_at,
    };
}

export async function addPassword(cred: ICredentialsEntry): Promise<ICredentialsEntry> {
    const backendEntry = toBackendEntry(cred, true);
    const result = await invoke("add_password", { entry: backendEntry });
    return fromBackendEntry(result);
}

export async function getPassword(id: number): Promise<ICredentialsEntry | null> {
    const result = await invoke("get_password_command", { id });
    if (!result) return null;
    return fromBackendEntry(result);
}

export async function listPasswords(): Promise<ICredentialsEntry[]> {
    const result = await invoke("list_passwords_command");
    return (result as any[]).map(fromBackendEntry);
}

export async function updatePassword(id: number, cred: ICredentialsEntry): Promise<ICredentialsEntry> {
    const backendEntry = toBackendEntry(cred);
    const result = await invoke("update_password_command", { id, entry: backendEntry });
    return fromBackendEntry(result);
}

export async function deletePassword(id: number): Promise<boolean> {
    return await invoke("delete_password_command", { id });
}

export async function searchPasswords(query: string): Promise<ICredentialsEntry[]> {
    const result = await invoke("search_passwords_command", { query });
    return (result as any[]).map(fromBackendEntry);
}
