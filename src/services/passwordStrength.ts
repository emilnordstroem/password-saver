export function getPasswordStrength(
    password: string | null | undefined,
): string {
    if (!password || password.length === 0) return "Empty";
    if (password.length < 8) return "Weak";

    let score = 0;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score >= 5) return "Very Strong";
    if (score >= 3) return "Strong";
    return "Weak";
}

export function getStrengthColor(password: string) {
    const strength = getPasswordStrength(password);
    switch (strength) {
        case "Very Strong":
        case "Strong":
            return "text-success";
        case "Weak":
            return "text-danger";
        default:
            return "text-default-500";
    }
}
