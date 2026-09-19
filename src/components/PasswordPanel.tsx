import { useState, useRef, useImperativeHandle, forwardRef, MouseEvent } from "react";

import { PasswordOverview } from "../components/PasswordOverview";
import { ScrollableMenu } from "../components/ScrollableMenu";
import { PasswordEntry } from "@src/types/password";
import { GripVertical } from "lucide-react";

interface PasswordPanelProps {
    onAddPassword?: () => void;
    searchQuery?: string;
}

export interface PasswordPanelHandle {
    handleAddPassword: () => void;
}

const RESIZER_WIDTH = 8;

export const PasswordPanel = forwardRef<PasswordPanelHandle, PasswordPanelProps>(
    ({ onAddPassword, searchQuery = "" }, ref) => {
        const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
        const [selectedPassword, setSelectedPassword] =
            useState<PasswordEntry | null>(null);
        const [leftWidth, setLeftWidth] = useState(50);
        const [isResizing, setIsResizing] = useState(false);
        const containerRef = useRef<HTMLDivElement>(null);

        const handleAddPassword = () => {
            const newPassword: PasswordEntry = {
                id: null,
                title: "",
                username: "",
                password: "",
                url: "",
                note: "",
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

        const startResizing = (e: MouseEvent) => {
            setIsResizing(true);
            e.preventDefault();
        };

        const stopResizing = () => {
            setIsResizing(false);
        };

        const handleResize = (e: MouseEvent) => {
            if (!isResizing || !containerRef.current) return;
            const container = containerRef.current;
            const containerRect = container.getBoundingClientRect();
            const x = e.clientX - containerRect.left;
            const newLeftWidth = (x / containerRect.width) * 100;
            setLeftWidth(Math.max(10, Math.min(90, newLeftWidth)));
        };

        useImperativeHandle(ref, () => ({
            handleAddPassword,
        }));

        return (
            <div
                ref={containerRef}
                className="flex flex-row w-full h-full relative"
                onMouseMove={handleResize}
                onMouseUp={stopResizing}
                onMouseLeave={stopResizing}
            >
                <div
                    className="min-w-0 overflow-hidden"
                    style={{ width: `${leftWidth}%` }}
                >
                    <ScrollableMenu
                        passwords={passwords}
                        onSelectPassword={setSelectedPassword}
                        selectedPassword={selectedPassword}
                        onAddPassword={handleAddPassword}
                        onDeletePassword={handleDeletePassword}
                        searchQuery={searchQuery}
                    />
                </div>
                <div
                    className={`cursor-col-resize z-10 flex items-center justify-center bg-default-200 hover:bg-default-300 active:bg-default-400 transition-colors shrink-0`}
                    style={{ width: RESIZER_WIDTH }}
                    onMouseDown={startResizing}
                >
                    <GripVertical size={16} className="text-default-500" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                    <PasswordOverview password={selectedPassword} isEditing={selectedPassword !== null} onUpdate={handleUpdatePassword} />
                </div>
            </div>
        );
    }
);

PasswordPanel.displayName = "PasswordPanel";
