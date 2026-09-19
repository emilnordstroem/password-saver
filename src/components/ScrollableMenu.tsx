import { useState } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Divider,
    ScrollShadow,
} from "@nextui-org/react";
import { ICredentialsEntry } from "@src/types/credentials";
import { Lock } from "lucide-react";
import { ConfirmModal } from "./ConfirmModal";
import { CredentialsMenuItem } from "./CredentialsMenuItem";

interface ScrollableMenuProps {
    credentials?: ICredentialsEntry[];
    selectedCredential?: ICredentialsEntry | null;
    onSelectCredential?: (credential: ICredentialsEntry | null) => void;
    onAddCredentials?: () => void;
    onDeleteCredentials?: (credential: ICredentialsEntry) => void;
    onSaveCredentials?: (credential: ICredentialsEntry) => void;
    hasCredentials?: boolean;
    onClearSearch?: () => void;
    savedCredentials?: Set<number>;
}

export function ScrollableMenu({
    credentials: credentialsList = [],
    selectedCredential: selectedCredential = null,
    onSelectCredential: onSelectCredential = () => {},
    onAddCredentials: onAddCredential = () => {},
    onDeleteCredentials: onDeleteCredential = () => {},
    onSaveCredentials: onSaveCredential = () => {},
    hasCredentials: hasCredentialsFlag = false,
    onClearSearch = () => {},
    savedCredentials = new Set<number>(),
}: ScrollableMenuProps) {
    const [credentialToDelete, setCredentialToDelete] =
        useState<ICredentialsEntry | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleSelect = (credential: ICredentialsEntry) => {
        onSelectCredential(credential);
    };

    const handleSave = (e: React.MouseEvent, credential: ICredentialsEntry) => {
        e.stopPropagation();
        onSaveCredential(credential);
    };

    const handleDelete = (
        e: React.MouseEvent,
        credential: ICredentialsEntry,
    ) => {
        e.stopPropagation();
        setCredentialToDelete(credential);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (credentialToDelete) {
            onDeleteCredential(credentialToDelete);
            setCredentialToDelete(null);
        }
        setIsDeleteModalOpen(false);
    };

    const handleCancelDelete = () => {
        setCredentialToDelete(null);
        setIsDeleteModalOpen(false);
    };

    return (
        <>
            <ScrollShadow className="w-full max-h-[400px]" hideScrollBar>
                <div className="gap-2 flex flex-col">
                    {credentialsList.length === 0 ? (
                        <Card
                            className="w-full"
                            shadow="sm"
                            radius="sm"
                            isHoverable={onAddCredential !== undefined}
                            isPressable={onAddCredential !== undefined}
                            onClick={() => {
                                onAddCredential();
                                onClearSearch();
                            }}
                        >
                            <CardHeader className="flex gap-2">
                                <div className="flex flex-row gap-2 items-center">
                                    <Lock
                                        size={16}
                                        className="text-default-400"
                                    />
                                    <div className="flex flex-col text-left">
                                        <p className="text-md font-semibold text-default-400">
                                            {hasCredentialsFlag
                                                ? "No results found"
                                                : "No passwords yet"}
                                        </p>
                                        <p className="text-sm text-default-500">
                                            <span className="text-default-400">
                                                Click to add a password
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <Divider />
                            <CardBody></CardBody>
                        </Card>
                    ) : (
                        credentialsList.map((credential, index) => (
                            <CredentialsMenuItem
                                key={index}
                                credential={credential}
                                index={index}
                                selectedCredential={selectedCredential}
                                handleSelect={handleSelect}
                                handleSave={handleSave}
                                handleDelete={handleDelete}
                                isSaved={savedCredentials.has(credential.id || 0)}
                            />
                        ))
                    )}
                </div>
            </ScrollShadow>
            <ConfirmModal
                isModalOpen={isDeleteModalOpen}
                handleConfirm={handleConfirmDelete}
                handleCancel={handleCancelDelete}
            />
        </>
    );
}
