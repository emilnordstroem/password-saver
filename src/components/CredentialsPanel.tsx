import {
    useState,
    useRef,
    useImperativeHandle,
    forwardRef,
    MouseEvent,
    useMemo,
    useEffect,
} from "react";

import { CredentialsOverview } from "./CredentialsOverview";
import { ScrollableMenu } from "./ScrollableMenu";
import { ICredentialsEntry } from "@src/types/credentials";
import { GripVertical } from "lucide-react";
import { addPassword, updatePassword, listPasswords, deletePassword } from "@src/utils/api";

interface CredentialPanelProps {
    onAddCredentials?: () => void;
    searchQuery?: string;
    onClearSearch?: () => void;
}

export interface CredentialPanelHandle {
    handleAddCredentials: () => void;
}

const RESIZER_WIDTH = 8;

export const CredentialsPanel = forwardRef<
    CredentialPanelHandle,
    CredentialPanelProps
>(
    (
        {
            onAddCredentials: onAddCredentials,
            searchQuery = "",
            onClearSearch = () => {},
        },
        ref,
    ) => {
        const [credentials, setCredentials] = useState<ICredentialsEntry[]>([]);
        const [selectedCredential, setSelectedCredential] =
            useState<ICredentialsEntry | null>(null);
        const [leftWidth, setLeftWidth] = useState(50);
        const [isResizing, setIsResizing] = useState(false);
        const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
        const [dirtyCredentials, setDirtyCredentials] = useState<Set<number | null>>(new Set());
        const containerRef = useRef<HTMLDivElement>(null);

        // Load credentials from database on mount
        useEffect(() => {
            const loadCredentials = async () => {
                try {
                    const savedCredentials = await listPasswords();
                    setCredentials(savedCredentials);
                } catch (error) {
                    console.error("Failed to load credentials:", error);
                }
            };
            loadCredentials();
        }, []);

        // Track which credentials have been saved (have an id) and are not dirty
        const savedCredentials = useMemo(() => {
            return new Set(
                credentials
                    .filter((c) => c.id !== null && !dirtyCredentials.has(c.id))
                    .map((c) => c.id as number)
            );
        }, [credentials, dirtyCredentials]);

        const filteredCredentials = useMemo(() => {
            const query = searchQuery.toLowerCase().trim();
            let result = [...credentials];

            if (query) {
                result = result.filter((credentials) => {
                    const titleMatch = credentials.title
                        ?.toLowerCase()
                        .includes(query);
                    const usernameMatch = credentials.username
                        ?.toLowerCase()
                        .includes(query);
                    return titleMatch || usernameMatch;
                });
            }

            return result.sort((a, b) => {
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();
                return dateB - dateA;
            });
        }, [credentials, searchQuery]);

        useEffect(() => {
            if (filteredCredentials.length === 0 && credentials.length > 0) {
                setSelectedCredential(null);
            }
        }, [filteredCredentials.length, credentials.length]);

        const handleAddCredentials = () => {
            // Check if there's already an unsaved credential (id: null)
            const hasUnsavedCredential = credentials.some(c => c.id === null);
            if (hasUnsavedCredential) {
                // Focus on the existing unsaved credential instead of adding a new one
                const existingUnsaved = credentials.find(c => c.id === null);
                if (existingUnsaved) {
                    setSelectedCredential(existingUnsaved);
                }
                return;
            }
            
            const newCredentials: ICredentialsEntry = {
                id: null,
                title: "",
                username: "",
                password: "",
                url: "",
                note: "",
                created_at: "",
                updated_at: "",
            };
            setCredentials([...credentials, newCredentials]);
            setSelectedCredential(newCredentials);
            // Mark new credential as dirty (null id represents new, unsaved)
            setDirtyCredentials(prev => {
                const newSet = new Set(prev);
                newSet.add(null);
                return newSet;
            });
            onAddCredentials?.();
        };

        const handleDeleteCredentials = async (
            credentialsToDelete: ICredentialsEntry,
        ) => {
            // If the credential has an id, delete from database
            if (credentialsToDelete.id !== null) {
                try {
                    await deletePassword(credentialsToDelete.id);
                } catch (error) {
                    console.error("Failed to delete credential:", error);
                    return;
                }
            }
            
            // Remove from local state
            const updatedCredentials = credentials.filter(
                (p) => p !== credentialsToDelete,
            );
            setCredentials(updatedCredentials);
            if (selectedCredential === credentialsToDelete) {
                setSelectedCredential(null);
            }
            // Remove from dirty set
            setDirtyCredentials(prev => {
                const newSet = new Set(prev);
                newSet.delete(credentialsToDelete.id);
                return newSet;
            });
        };

        const handleUpdateCredentials = (
            updatedCredentials: ICredentialsEntry,
        ) => {
            if (updatedCredentials.id === null) {
                const existingIndex = credentials.findIndex(
                    (p) => p.id === null,
                );
                if (existingIndex >= 0) {
                    const updated = [...credentials];
                    updated[existingIndex] = updatedCredentials;
                    setCredentials(updated);
                }
            } else {
                const updated = credentials.map((p) =>
                    p === selectedCredential ? updatedCredentials : p,
                );
                setCredentials(updated);
            }
            setSelectedCredential(updatedCredentials);
            // Mark the credential as dirty (has unsaved changes)
            setDirtyCredentials(prev => {
                const newSet = new Set(prev);
                newSet.add(updatedCredentials.id);
                return newSet;
            });
        };

        // Validate the credential (title is required)
        const validateCredential = (cred: ICredentialsEntry): boolean => {
            const errors: Record<string, string> = {};
            if (!cred.title || cred.title.trim() === "") {
                errors.title = "Title is required";
            }
            setValidationErrors(errors);
            return Object.keys(errors).length === 0;
        };

        // Save credential to database
        const handleSaveCredentials = async (cred: ICredentialsEntry): Promise<boolean> => {
            console.log("Saving credential:", cred);
            // Validate first
            if (!validateCredential(cred)) {
                console.log("Validation failed");
                return false;
            }

            try {
                let savedCred: ICredentialsEntry;
                if (cred.id === null) {
                    // Create new entry with timestamps
                    const credWithTimestamps = {
                        ...cred,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    };
                    savedCred = await addPassword(credWithTimestamps);
                } else {
                    // Update existing entry
                    const credWithTimestamp = {
                        ...cred,
                        updated_at: new Date().toISOString(),
                    };
                    savedCred = await updatePassword(cred.id, credWithTimestamp);
                }

                // Update local state
                if (cred.id === null) {
                    // New credential - replace the temporary one with the saved one
                    const updated = credentials.map((p) =>
                        p.id === null ? savedCred : p,
                    );
                    setCredentials(updated);
                    setSelectedCredential(savedCred);
                } else {
                    // Updated credential
                    const updated = credentials.map((p) =>
                        p.id === savedCred.id ? savedCred : p,
                    );
                    setCredentials(updated);
                    setSelectedCredential(savedCred);
                }

                // Mark the credential as clean (no longer dirty)
                setDirtyCredentials(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(savedCred.id);
                    // If this was a new credential (was null, now has id), also remove null
                    if (cred.id === null) {
                        newSet.delete(null);
                    }
                    return newSet;
                });

                // Clear validation errors
                setValidationErrors({});
                return true;
            } catch (error) {
                console.error("Failed to save credential:", error);
                return false;
            }
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
            handleAddCredentials: handleAddCredentials,
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
                        credentials={filteredCredentials}
                        onSelectCredential={setSelectedCredential}
                        selectedCredential={selectedCredential}
                        onAddCredentials={handleAddCredentials}
                        onDeleteCredentials={handleDeleteCredentials}
                        onSaveCredentials={handleSaveCredentials}
                        hasCredentials={credentials.length > 0}
                        onClearSearch={onClearSearch}
                        savedCredentials={savedCredentials}
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
                    <CredentialsOverview
                        credentials={selectedCredential}
                        isEditing={selectedCredential !== null}
                        onUpdate={handleUpdateCredentials}
                        validationErrors={validationErrors}
                    />
                </div>
            </div>
        );
    },
);

CredentialsPanel.displayName = "CredentialsPanel";
