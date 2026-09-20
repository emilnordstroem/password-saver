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
    };

    const handleAddCredential = () => {
        credentialsPanelRef.current?.handleAddCredentials();
    };

    const handleClearSearch = () => {
        setSearchQuery("");
    };

    return (
        <div className="flex flex-col gap-2 pt-1 pb-4 px-4 w-full h-full overflow-hidden">
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
