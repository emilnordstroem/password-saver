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
    onSelectCredentials?: (password: ICredentialsEntry | null) => void;
    onAddCredentials?: () => void;
    onDeleteCredentials?: (password: ICredentialsEntry) => void;
    hasCredentials?: boolean;
    onClearSearch?: () => void;
}

export function ScrollableMenu({
    credentials: passwords = [],
    selectedCredentials: selectedPassword = null,
    onSelectCredentials: onSelectPassword = () => {},
    onAddCredentials: onAddPassword = () => {},
    onDeleteCredentials: onDeletePassword = () => {},
    hasCredentials: hasPasswords = false,
    onClearSearch = () => {},
}: ScrollableMenuProps) {
    const [passwordToDelete, setPasswordToDelete] =
        useState<ICredentialsEntry | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleSelect = (password: ICredentialsEntry) => {
        onSelectPassword(password);
    };

    const handleDelete = (e: React.MouseEvent, password: ICredentialsEntry) => {
        e.stopPropagation();
        setPasswordToDelete(password);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (passwordToDelete) {
            onDeletePassword(passwordToDelete);
            setPasswordToDelete(null);
        }
        setIsDeleteModalOpen(false);
    };

    const handleCancelDelete = () => {
        setPasswordToDelete(null);
        setIsDeleteModalOpen(false);
    };

    return (
        <>
            <ScrollShadow className="w-full max-h-[400px]" hideScrollBar>
                <div className="gap-2 flex flex-col">
                    {passwords.length === 0 ? (
                        <Card
                            className="w-full"
                            shadow="sm"
                            radius="sm"
                            isHoverable={onAddPassword !== undefined}
                            isPressable={onAddPassword !== undefined}
                            onClick={() => {
                                onAddPassword();
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
                                            {hasPasswords
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
                        passwords.map((password, index) => (
                            <Card
                                key={index}
                                className={`w-full ${selectedPassword === password ? "border-2 border-primary" : ""}`}
                                shadow="sm"
                                radius="sm"
                                isHoverable
                                isPressable
                                onClick={() => handleSelect(password)}
                            >
                                <CardHeader className="flex gap-2 justify-between">
                                    <div className="flex flex-row gap-2 items-center">
                                        {selectedPassword === password ? (
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
                                                {password.title || (
                                                    <span className="text-default-400">
                                                        Empty
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-sm text-default-500">
                                                {password.username || (
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
                                            handleDelete(e, password)
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
