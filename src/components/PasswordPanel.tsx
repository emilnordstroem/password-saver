import { useState, useImperativeHandle, forwardRef } from "react";

import { PasswordOverview } from "../components/PasswordOverview";
import { ScrollableMenu } from "../components/ScrollableMenu";
import { PasswordEntry } from "@src/types/password";

interface PasswordPanelProps {
    onAddPassword?: () => void;
}

export interface PasswordPanelHandle {
    handleAddPassword: () => void;
}

export const PasswordPanel = forwardRef<PasswordPanelHandle, PasswordPanelProps>(
    ({ onAddPassword }, ref) => {
        const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
        const [selectedPassword, setSelectedPassword] =
            useState<PasswordEntry | null>(null);

        const handleAddPassword = () => {
            const newPassword: PasswordEntry = {
                id: null,
                title: "",
                username: "",
                password: "",
                url: "",
                notes: "",
                created_at: "",
                updated_at: "",
            };
            setPasswords([...passwords, newPassword]);
            setSelectedPassword(newPassword);
            onAddPassword?.();
        };

        const handleDeletePassword = (passwordToDelete: PasswordEntry) => {
            const updatedPasswords = passwords.filter(p => p !== passwordToDelete);
            setPasswords(updatedPasswords);
            if (selectedPassword === passwordToDelete) {
                setSelectedPassword(null);
            }
        };

        const handleUpdatePassword = (updatedPassword: PasswordEntry) => {
            if (updatedPassword.id === null) {
                // This is a new password being added
                const existingIndex = passwords.findIndex(p => p.id === null);
                if (existingIndex >= 0) {
                    const updated = [...passwords];
                    updated[existingIndex] = updatedPassword;
                    setPasswords(updated);
                }
            } else {
                // Update existing password
                const updated = passwords.map(p =>
                    p === selectedPassword ? updatedPassword : p
                );
                setPasswords(updated);
            }
            setSelectedPassword(updatedPassword);
        };

        useImperativeHandle(ref, () => ({
            handleAddPassword,
        }));

        return (
            <div className="flex flex-row gap-4 w-full h-full">
                <div className="flex-1 min-w-0">
                    <ScrollableMenu
                        passwords={passwords}
                        onSelectPassword={setSelectedPassword}
                        selectedPassword={selectedPassword}
                        onAddPassword={handleAddPassword}
                        onDeletePassword={handleDeletePassword}
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <PasswordOverview password={selectedPassword} isEditing={selectedPassword !== null} onUpdate={handleUpdatePassword} />
                </div>
            </div>
        );
    }
);

PasswordPanel.displayName = "PasswordPanel";
