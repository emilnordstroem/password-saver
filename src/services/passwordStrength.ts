/**
 * NIST SP 800-63B Password Strength Assessment
 * 
 * Simplified 3-level system per user requirement:
 * - Very Strong: 16+ characters
 * - Strong: 12-15 characters
 * - Weak: < 12 characters (including < 8 which violates NIST minimum)
 */

export function getPasswordStrength(
    password: string | null | undefined,
): string {
    if (!password || password.length === 0) return "Weak";
    
    const length = password.length;

    // Simplified 3-level assessment (per user requirement)
    if (length >= 16) return "Very Strong";
    if (length >= 12) return "Strong";
    return "Weak";
}

export function getStrengthColor(password: string) {
    const strength = getPasswordStrength(password);
    switch (strength) {
        case "Very Strong":
            return "text-success";
        case "Strong":
            return "text-success";
        case "Weak":
            return "text-danger";
        default:
            return "text-default-500";
    }
}

// NIST SP 800-63B: Additional utility functions
export function getStrengthDescription(password: string): string {
    const strength = getPasswordStrength(password);
    const length = password ? password.length : 0;
    
    const descriptions: Record<string, string> = {
        "Weak": length < 8 
            ? "Password must be at least 8 characters (NIST SP 800-63B)" 
            : `Length: ${length} chars. Consider longer password (12+ chars recommended)`,
        "Strong": `Length: ${length} chars. Strong password meeting NIST guidelines`,
        "Very Strong": `Length: ${length} chars. Very strong password exceeding NIST recommendations`,
    };
    
    return descriptions[strength] || "";
}
