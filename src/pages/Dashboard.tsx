import { useState, useRef } from "react";
import { NavigationBar } from "../components/NavigationBar";
import {
    CredentialsPanel,
    CredentialPanelHandle,
} from "@src/components/CredentialsPanel";

export function Dashboard() {
    const [searchQuery, setSearchQuery] = useState("");
    const credentialsPanelRef = useRef<CredentialPanelHandle>(null);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        // Implement search logic here
        console.log("Searching for:", value);
    };

    const handleAddCredential = () => {
        // Trigger add credential in CredentialsPanel
        credentialsPanelRef.current?.handleAddCredentials();
    };

    const handleClearSearch = () => {
        setSearchQuery("");
    };

    return (
        <div className="flex flex-col gap-4 p-4 w-full h-full">
            <NavigationBar
                searchQuery={searchQuery}
                handleSearch={handleSearch}
                handleAddCredential={handleAddCredential}
            />
            <CredentialsPanel
                ref={credentialsPanelRef}
                searchQuery={searchQuery}
                onClearSearch={handleClearSearch}
            />
        </div>
    );
}
