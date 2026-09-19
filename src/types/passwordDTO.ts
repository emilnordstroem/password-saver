// DTO interface for password data transfer
// This matches the backend EncryptionConfig structure
export interface IPasswordDTO {
    title: string;
    username: string;
    password: string;
    url: string;
    note: string;
}

// Encryption configuration from the backend
export interface IEncryptionConfig {
    salt: string;
    m_cost: number;
    t_cost: number;
    p_cost: number;
    initialized: boolean;
}
