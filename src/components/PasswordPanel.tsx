import { useState } from "react";

import { PasswordOverview } from "../components/PasswordOverview";
import { ScrollableMenu } from "../components/ScrollableMenu";
import { PasswordEntry } from "@src/types/password";

export function PasswordPanel() {
    const [selectedPassword, setSelectedPassword] =
        useState<PasswordEntry | null>(null);

    return (
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
    );
}
