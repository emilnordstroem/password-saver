import { useState } from "react";
import { ScrollShadow } from "@nextui-org/react";
import { ICredentialsEntry } from "@src/types/credentials";
import { ConfirmModal } from "./ConfirmModal";
import { CredentialsList } from "./CredentialsList";

interface ScrollableMenuProps {
    credentials?: ICredentialsEntry[];
    selectedCredential?: ICredentialsEntry | null;
    onSelectCredential?: (credential: ICredentialsEntry | null) => void;
    onAddCredentials?: () => void;
    onDeleteCredentials?: (credential: ICredentialsEntry) => Promise<void>;
    onSaveCredentials?: (credential: ICredentialsEntry) => Promise<boolean>;
    hasCredentials?: boolean;
    onClearSearch?: () => void;
    savedCredentials?: Set<number>;
}

export function ScrollableMenu({
    credentials: credentialsList = [],
    selectedCredential: selectedCredential = null,
    onSelectCredential: onSelectCredential = () => {},
    onAddCredentials: onAddCredential = () => {},
    onDeleteCredentials: onDeleteCredential = async () => {},
    onSaveCredentials: onSaveCredentials = async () => true,
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

    const handleSave = async (
        e: React.MouseEvent | React.KeyboardEvent,
        credential: ICredentialsEntry,
    ) => {
        console.log(
            "ScrollableMenu handleSave called for credential:",
            credential.id,
            credential.title,
        );
        e.stopPropagation();
        if (onSaveCredentials) {
            const result = await onSaveCredentials(credential);
            console.log("Save result:", result);
        }
    };

    const handleDelete = (
        e: React.MouseEvent | React.KeyboardEvent,
        credential: ICredentialsEntry,
    ) => {
        e.stopPropagation();
        setCredentialToDelete(credential);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (credentialToDelete) {
            await onDeleteCredential(credentialToDelete);
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
                <CredentialsList
                    credentialsList={credentialsList}
                    hasCredentials={hasCredentialsFlag}
                    selectedCredential={selectedCredential}
                    onAddCredential={onAddCredential}
                    onClearSearch={onClearSearch}
                    savedCredentials={savedCredentials}
                    handleSelect={handleSelect}
                    handleSave={handleSave}
                    handleDelete={handleDelete}
                />
            </ScrollShadow>
            <ConfirmModal
                isModalOpen={isDeleteModalOpen}
                handleConfirm={handleConfirmDelete}
                handleCancel={handleCancelDelete}
                credential={credentialToDelete}
            />
        </>
    );
}
