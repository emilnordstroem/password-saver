export interface PasswordOptions {
    length: number;
    useUppercase: boolean;
    useLowercase: boolean;
    useNumbers: boolean;
    useSpecialChars: boolean;
}

// NIST SP 800-63B: All printable ASCII characters
// Printable ASCII: 32-126 (95 characters)
const PRINTABLE_ASCII = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

function getRandomInt(max: number): number {
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    return randomBuffer[0] % max;
}

export function generatePassword(options: PasswordOptions): string {
    // NIST SP 800-63B: Minimum 8 characters
    const length = Math.max(options.length, 8);
    
    // Build character set based on options (for backward compatibility with UI)
    // But use all printable ASCII when all options are selected (NIST approach)
    let chars = "";
    if (options.useUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (options.useLowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (options.useNumbers) chars += "0123456789";
    if (options.useSpecialChars) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    // If all character types are enabled, use full printable ASCII (NIST recommendation)
    if (options.useUppercase && options.useLowercase && options.useNumbers && options.useSpecialChars) {
        chars = PRINTABLE_ASCII;
    }
    
    // If no character types are selected, default to all printable ASCII
    if (chars === "") {
        chars = PRINTABLE_ASCII;
    }

    let newPassword = "";
    
    // Generate password with random characters from the selected set
    for (let i = 0; i < length; i++) {
        const randomIndex = getRandomInt(chars.length);
        newPassword += chars[randomIndex];
    }

    return newPassword;
}

// NIST SP 800-63B: Verify password meets minimum requirements
export function meetsNistRequirements(password: string): boolean {
    // Minimum length of 8 characters
    return password.length >= 8;
}
