import { useState } from "react";
import { NavigationBar } from "../components/NavigationBar";
import { PasswordPanel } from "@src/components/PasswordPanel";

export function Dashboard() {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        // Implement search logic here
        console.log("Searching for:", value);
    };

    const handleAddPassword = () => {
        // Handle add password logic
        console.log("Add password clicked");
    };

    return (
        <div className="flex flex-col gap-4 p-4 w-full h-full">
            <NavigationBar
                searchQuery={searchQuery}
                handleSearch={handleSearch}
                handleAddPassword={handleAddPassword}
            />
            <PasswordPanel />
        </div>
    );
}
