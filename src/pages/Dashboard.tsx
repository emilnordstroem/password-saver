import { useState } from "react";
import { PasswordOverview } from "../components/PasswordOverview";
import { ScrollableMenu } from "../components/ScrollableMenu";
import { IPasswordDTO } from "../types/passwordDTO";

export function Dashboard() {
    const [selectedPassword, setSelectedPassword] = useState<IPasswordDTO | null>(null);

    return (
        <div className="flex flex-row gap-4 p-4 w-full h-full">
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
