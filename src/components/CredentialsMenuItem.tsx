import { Button, Card, CardHeader } from "@nextui-org/react";
import { Lock, LockOpen, Save, SaveCheck, Trash } from "lucide-react";
import { ICredentialsEntry } from "@src/types/credentials";
import { getFaviconUrlWithFallback } from "@src/utils/favicon";
import { useState, useEffect } from "react";

interface CredentialsMenuItemProps {
    credential: ICredentialsEntry;
    index: number;
    selectedCredential: ICredentialsEntry | null;
    handleSelect: (credential: ICredentialsEntry) => Promise<void> | void;
    handleSave: (
        event: React.MouseEvent | React.KeyboardEvent,
        credential: ICredentialsEntry,
    ) => void;
    handleDelete: (
        event: React.MouseEvent | React.KeyboardEvent,
        credential: ICredentialsEntry,
    ) => void;
    isSaved: boolean;
}

export function CredentialsMenuItem({
    credential,
    index,
    selectedCredential,
    handleSelect,
    handleSave,
    handleDelete,
    isSaved,
}: CredentialsMenuItemProps) {
    const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
    const [faviconError, setFaviconError] = useState<boolean>(false);

    // Get favicon URL when credential URL changes
    useEffect(() => {
        if (credential.url) {
            const url = getFaviconUrlWithFallback(credential.url);
            setFaviconUrl(url);
            setFaviconError(false);
        } else {
            setFaviconUrl(null);
            setFaviconError(false);
        }
    }, [credential.url]);

    const handleFaviconError = () => {
        setFaviconError(true);
    };

    // Show lock icon if no URL, favicon if URL present
    const renderIcon = () => {
        if (!credential.url) {
            return selectedCredential === credential ? (
                <LockOpen size={14} className="text-default-400" />
            ) : (
                <Lock size={14} className="text-default-400" />
            );
        }

        // If we have a favicon URL and no error, show the image
        if (faviconUrl && !faviconError) {
            return (
                <img
                    src={faviconUrl}
                    alt=""
                    className="w-3.5 h-3.5 object-contain"
                    onError={handleFaviconError}
                />
            );
        }

        // Fallback to lock icon if favicon fails
        return selectedCredential === credential ? (
            <LockOpen size={14} className="text-default-400" />
        ) : (
            <Lock size={14} className="text-default-400" />
        );
    };

    return (
        <Card
            key={index}
            className={`w-full ${selectedCredential === credential ? "border-2 border-primary" : ""}`}
            shadow="sm"
            radius="sm"
            isHoverable
            tabIndex={0}
            classNames={{ base: "py-1" }}
            onKeyUp={(event) => {
                if (event.key === 'Enter') {
                    event.stopPropagation();
                    handleSave(event, credential);
                } else if (event.key === 'Backspace') {
                    event.stopPropagation();
                    handleDelete(event, credential);
                }
            }}
        >
            <CardHeader className="flex gap-1 justify-between px-2 py-1">
                <div 
                    className="flex flex-row gap-1.5 items-center flex-1 cursor-pointer min-w-0"
                    onClick={async () => await handleSelect(credential)}
                >
                    {renderIcon()}
                    <div className="flex flex-col text-left min-w-0">
                        <p className="text-sm font-semibold truncate">
                            {credential.title || (
                                <span className="text-default-400">Empty</span>
                            )}
                        </p>
                        <p className="text-xs text-default-500 truncate">
                            {credential.username || (
                                <span className="text-default-400">
                                    No username
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex gap-0.5 shrink-0">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color={isSaved ? "success" : "default"}
                        className="h-6 w-6 min-w-0"
                        onClick={(event) => {
                            event.stopPropagation();
                            handleSave(event, credential);
                        }}
                        aria-label="Save password"
                    >
                        {isSaved ? (
                            <SaveCheck size={14} />
                        ) : (
                            <Save size={14} />
                        )}
                    </Button>
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        className="h-6 w-6 min-w-0"
                        onClick={(event) => {
                            event.stopPropagation();
                            handleDelete(event, credential);
                        }}
                        aria-label="Delete password"
                    >
                        <Trash size={14} />
                    </Button>
                </div>
            </CardHeader>
        </Card>
    );
}
