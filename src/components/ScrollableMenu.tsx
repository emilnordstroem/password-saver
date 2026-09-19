import { useState } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Divider,
    ScrollShadow,
    Button,
} from "@nextui-org/react";
import { ICredentialsEntry } from "@src/types/credentials";
import { MdDelete } from "react-icons/md";
import { Lock, LockOpen } from "lucide-react";
import { ConfirmModal } from "./ConfirmModal";

interface ScrollableMenuProps {
    credentials?: ICredentialsEntry[];
    selectedCredentials?: ICredentialsEntry | null;
    onSelectCredentials?: (credential: ICredentialsEntry | null) => void;
    onAddCredentials?: () => void;
    onDeleteCredentials?: (credential: ICredentialsEntry) => void;
    hasCredentials?: boolean;
    onClearSearch?: () => void;
}

export function ScrollableMenu({
    credentials: credentialsList = [],
    selectedCredentials: selectedCredential = null,
    onSelectCredentials: onSelectCredential = () => {},
    onAddCredentials: onAddCredential = () => {},
    onDeleteCredentials: onDeleteCredential = () => {},
    hasCredentials: hasCredentialsFlag = false,
    onClearSearch = () => {},
}: ScrollableMenuProps) {
    const [credentialToDelete, setCredentialToDelete] =
        useState<ICredentialsEntry | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleSelect = (credential: ICredentialsEntry) => {
        onSelectCredential(credential);
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
                            <Card
                                key={index}
                                className={`w-full ${selectedCredential === credential ? "border-2 border-primary" : ""}`}
                                shadow="sm"
                                radius="sm"
                                isHoverable
                                isPressable
                                onClick={() => handleSelect(credential)}
                            >
                                <CardHeader className="flex gap-2 justify-between">
                                    <div className="flex flex-row gap-2 items-center">
                                        {selectedCredential === credential ? (
                                            <LockOpen
                                                size={16}
                                                className="text-default-400"
                                            />
                                        ) : (
                                            <Lock
                                                size={16}
                                                className="text-default-400"
                                            />
                                        )}
                                        <div className="flex flex-col text-left">
                                            <p className="text-md font-semibold">
                                                {credential.title || (
                                                    <span className="text-default-400">
                                                        Empty
                                                    </span>
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
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        color="danger"
                                        onClick={(e) =>
                                            handleDelete(e, credential)
                                        }
                                        aria-label="Delete password"
                                    >
                                        <MdDelete size={16} />
                                    </Button>
                                </CardHeader>
                                <Divider />
                                <CardBody></CardBody>
                            </Card>
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
