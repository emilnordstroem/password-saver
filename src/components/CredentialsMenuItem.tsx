import { Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { Lock, LockOpen, Save, SaveCheck, Trash } from "lucide-react";
import { ICredentialsEntry } from "@src/types/credentials";
import { getFaviconUrlWithFallback } from "@src/utils/favicon";
import { useState, useEffect } from "react";

interface CredentialsMenuItemProps {
    credential: ICredentialsEntry;
    index: number;
    selectedCredential: ICredentialsEntry | null;
    handleSelect: (credential: ICredentialsEntry) => void;
    handleSave: (
        event: React.MouseEvent,
        credential: ICredentialsEntry,
    ) => void;
    handleDelete: (
        event: React.MouseEvent,
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
                <LockOpen size={16} className="text-default-400" />
            ) : (
                <Lock size={16} className="text-default-400" />
            );
        }

        // If we have a favicon URL and no error, show the image
        if (faviconUrl && !faviconError) {
            return (
                <img
                    src={faviconUrl}
                    alt=""
                    className="w-4 h-4 object-contain"
                    onError={handleFaviconError}
                />
            );
        }

        // Fallback to lock icon if favicon fails
        return selectedCredential === credential ? (
            <LockOpen size={16} className="text-default-400" />
        ) : (
            <Lock size={16} className="text-default-400" />
        );
    };

    return (
        <Card
            key={index}
            className={`w-full ${selectedCredential === credential ? "border-2 border-primary" : ""}`}
            shadow="sm"
            radius="sm"
            isHoverable
        >
            <CardHeader className="flex gap-2 justify-between">
                <div 
                    className="flex flex-row gap-2 items-center flex-1 cursor-pointer"
                    onClick={() => handleSelect(credential)}
                >
                    {renderIcon()}
                    <div className="flex flex-col text-left">
                        <p className="text-md font-semibold">
                            {credential.title || (
                                <span className="text-default-400">Empty</span>
                            )}
                        </p>
                        <p className="text-sm text-default-500">
                            {credential.username || (
                                <span className="text-default-400">
                                    No username
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex gap-1">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color={isSaved ? "success" : "default"}
                        onClick={(event) => {
                            event.stopPropagation();
                            handleSave(event, credential);
                        }}
                        aria-label="Save password"
                    >
                        {isSaved ? (
                            <SaveCheck size={16} />
                        ) : (
                            <Save size={16} />
                        )}
                    </Button>
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onClick={(event) => {
                            event.stopPropagation();
                            handleDelete(event, credential);
                        }}
                        aria-label="Delete password"
                    >
                        <Trash size={16} />
                    </Button>
                </div>
            </CardHeader>
            <Divider />
            <CardBody></CardBody>
        </Card>
    );
}
