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
import {
    addPassword,
    updatePassword,
    listPasswords,
    deletePassword,
} from "@src/utils/api";

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
        const [validationErrors, setValidationErrors] = useState<
            Record<string, string>
        >({});
        const [dirtyCredentials, setDirtyCredentials] = useState<
            Set<number | null>
        >(new Set());
        const containerRef = useRef<HTMLDivElement>(null);

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

        const savedCredentials = useMemo(() => {
            return new Set(
                credentials
                    .filter((c) => c.id !== null && !dirtyCredentials.has(c.id))
                    .map((c) => c.id as number),
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
            const hasUnsavedCredential = credentials.some((c) => c.id === null);
            if (hasUnsavedCredential) {
                const existingUnsaved = credentials.find((c) => c.id === null);
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
            setCredentials([newCredentials, ...credentials]);
            setSelectedCredential(newCredentials);
            setDirtyCredentials((prev) => {
                const newSet = new Set(prev);
                newSet.add(null);
                return newSet;
            });
            onAddCredentials?.();
        };

        const handleDeleteCredentials = async (
            credentialsToDelete: ICredentialsEntry,
        ) => {
            if (credentialsToDelete.id !== null) {
                try {
                    await deletePassword(credentialsToDelete.id);
                } catch (error) {
                    console.error("Failed to delete credential:", error);
                    return;
                }
            }
            const updatedCredentials = credentials.filter(
                (p) => p !== credentialsToDelete,
            );
            setCredentials(updatedCredentials);
            if (selectedCredential === credentialsToDelete) {
                setSelectedCredential(null);
            }
            setDirtyCredentials((prev) => {
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
            setDirtyCredentials((prev) => {
                const newSet = new Set(prev);
                newSet.add(updatedCredentials.id);
                return newSet;
            });
        };

        const validateCredential = (cred: ICredentialsEntry): boolean => {
            const errors: Record<string, string> = {};
            if (!cred.title || cred.title.trim() === "") {
                errors.title = "(required)";
            }
            if (!cred.username || cred.username.trim() === "") {
                errors.username = "(required)";
            }
            if (!cred.password || cred.password.trim() === "") {
                errors.password = "(required)";
            }
            setValidationErrors(errors);
            return Object.keys(errors).length === 0;
        };

        const handleSaveCredentials = async (
            cred: ICredentialsEntry,
        ): Promise<boolean> => {
            if (!validateCredential(cred)) {
                return false;
            }

            try {
                let savedCred: ICredentialsEntry;
                if (cred.id === null) {
                    const credWithTimestamps = {
                        ...cred,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    };
                    savedCred = await addPassword(credWithTimestamps);
                } else {
                    const credWithTimestamp = {
                        ...cred,
                        updated_at: new Date().toISOString(),
                    };
                    savedCred = await updatePassword(
                        cred.id,
                        credWithTimestamp,
                    );
                }

                if (cred.id === null) {
                    const updated = credentials.map((p) =>
                        p.id === null ? savedCred : p,
                    );
                    setCredentials(updated);
                    setSelectedCredential(savedCred);
                } else {
                    const updated = credentials.map((p) =>
                        p.id === savedCred.id ? savedCred : p,
                    );
                    setCredentials(updated);
                    setSelectedCredential(savedCred);
                }

                setDirtyCredentials((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(savedCred.id);
                    if (cred.id === null) {
                        newSet.delete(null);
                    }
                    return newSet;
                });

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
            <div className="flex-1 min-h-0 overflow-hidden">
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
            </div>
        );
    },
);

CredentialsPanel.displayName = "CredentialsPanel";
