import { useMemo } from "react";

export function Footer() {
    const currentYear = useMemo(() => new Date().getFullYear(), []);
    
    return (
        <footer className="w-full py-2 text-center">
            <p className="text-sm text-default-500">
                Copyright {currentYear} Apache Software Foundation
            </p>
        </footer>
    );
}
