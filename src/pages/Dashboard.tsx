import { useState } from "react";
import { PasswordOverview } from "../components/PasswordOverview";
import { ScrollableMenu } from "../components/ScrollableMenu";
import { PasswordEntry } from "@src/types/password";
import { NavigationBar } from "../components/NavigationBar";

export function Dashboard() {
    const [selectedPassword, setSelectedPassword] =
        useState<PasswordEntry | null>(null);
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
            <div className="flex flex-row gap-4 w-full h-full">
                <div className="flex-1 min-w-0">
                    <ScrollableMenu
                        passwords={[]}
                        onSelectPassword={setSelectedPassword}
                        selectedPassword={selectedPassword}
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <PasswordOverview password={selectedPassword} />
                </div>
            </div>
        </div>
    );
}
