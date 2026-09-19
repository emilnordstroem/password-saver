import { useState, useRef } from "react";
import { NavigationBar } from "../components/NavigationBar";
import { PasswordPanel, PasswordPanelHandle } from "@src/components/PasswordPanel";

export function Dashboard() {
    const [searchQuery, setSearchQuery] = useState("");
    const passwordPanelRef = useRef<PasswordPanelHandle>(null);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        // Implement search logic here
        console.log("Searching for:", value);
    };

    const handleAddPassword = () => {
        // Trigger add password in PasswordPanel
        passwordPanelRef.current?.handleAddPassword();
    };

    return (
        <div className="flex flex-col gap-4 p-4 w-full h-full">
            <NavigationBar
                searchQuery={searchQuery}
                handleSearch={handleSearch}
                handleAddPassword={handleAddPassword}
            />
            <PasswordPanel ref={passwordPanelRef} />
        </div>
    );
}
