import { invoke } from "@tauri-apps/api/core";
import { check, Update } from "@tauri-apps/plugin-updater";
import { getVersion } from "@tauri-apps/api/app";
import { ICredentialsEntry } from "@src/types/credentials";
import { IEncryptionConfig } from "@src/types/passwordDTO";

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

// ============================================
// Encryption API Functions
// ============================================

export async function initEncryption(masterPassword: string): Promise<IEncryptionConfig> {
    return await invoke("init_encryption", { masterPassword });
}

export async function unlockDatabase(masterPassword: string, config: IEncryptionConfig): Promise<boolean> {
    return await invoke("unlock_database", { masterPassword, config });
}

export async function lockDatabase(): Promise<boolean> {
    return await invoke("lock_database");
}

export async function isUnlocked(): Promise<boolean> {
    return await invoke("is_unlocked");
}

export async function loadEncryptionConfig(): Promise<IEncryptionConfig | null> {
    return await invoke("load_encryption_config");
}

export async function isEncryptionInitialized(): Promise<boolean> {
    return await invoke("is_encryption_initialized");
}

export async function saveEncryptionConfig(config: IEncryptionConfig): Promise<boolean> {
    return await invoke("save_encryption_config", { config });
}

// ============================================
// Updater API Functions
// ============================================

export async function checkForUpdates(): Promise<Update | null> {
    try {
        const update = await check();
        return update;
    } catch (error) {
        console.error("Failed to check for updates:", error);
        return null;
    }
}

export async function getAppVersion(): Promise<string> {
    try {
        return await getVersion();
    } catch (error) {
        console.error("Failed to get app version:", error);
        return "unknown";
    }
}
