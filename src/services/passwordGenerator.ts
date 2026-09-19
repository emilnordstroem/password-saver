export interface PasswordOptions {
    length: number;
    useUppercase: boolean;
    useLowercase: boolean;
    useNumbers: boolean;
    useSpecialChars: boolean;
}

const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const NUMBER_CHARS = "0123456789";
const SPECIAL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

function getRandomInt(max: number): number {
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    return randomBuffer[0] % max;
}

export function generatePassword(options: PasswordOptions): string {
    const charSets = [];
    if (options.useUppercase) charSets.push(UPPERCASE_CHARS);
    if (options.useLowercase) charSets.push(LOWERCASE_CHARS);
    if (options.useNumbers) charSets.push(NUMBER_CHARS);
    if (options.useSpecialChars) charSets.push(SPECIAL_CHARS);

    if (charSets.length === 0) {
        return "";
    }

    let chars = "";
    if (options.useUppercase) chars += UPPERCASE_CHARS;
    if (options.useLowercase) chars += LOWERCASE_CHARS;
    if (options.useNumbers) chars += NUMBER_CHARS;
    if (options.useSpecialChars) chars += SPECIAL_CHARS;

    let newPassword = "";

    // Ensure at least one character from each selected set
    for (const charSet of charSets) {
        const randomIndex = getRandomInt(charSet.length);
        newPassword += charSet[randomIndex];
    }

    // Fill the rest of the password with random characters from all selected sets
    for (let i = newPassword.length; i < options.length; i++) {
        const randomIndex = getRandomInt(chars.length);
        newPassword += chars[randomIndex];
    }

    // Shuffle the password to mix the required characters
    const passwordArray = newPassword.split("");
    for (let i = passwordArray.length - 1; i > 0; i--) {
        const j = getRandomInt(i + 1);
        [passwordArray[i], passwordArray[j]] = [
            passwordArray[j],
            passwordArray[i],
        ];
    }

    return passwordArray.join("");
}
