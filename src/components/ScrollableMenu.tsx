import { useState } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Divider,
    ScrollShadow,
    Button,
} from "@nextui-org/react";
import { PasswordEntry } from "@src/types/password";
import { MdDelete } from "react-icons/md";
import { Lock } from "lucide-react";
import { ConfirmModal } from "./ConfirmModal";

interface ScrollableMenuProps {
    passwords?: PasswordEntry[];
    selectedPassword?: PasswordEntry | null;
    onSelectPassword?: (password: PasswordEntry | null) => void;
    onAddPassword?: () => void;
    onDeletePassword?: (password: PasswordEntry) => void;
}

export function ScrollableMenu({
    passwords = [],
    selectedPassword = null,
    onSelectPassword = () => {},
    onAddPassword = () => {},
    onDeletePassword = () => {},
}: ScrollableMenuProps) {
    const [passwordToDelete, setPasswordToDelete] =
        useState<PasswordEntry | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleSelect = (password: PasswordEntry) => {
        onSelectPassword(password);
    };

    const handleDelete = (e: React.MouseEvent, password: PasswordEntry) => {
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
                            onClick={() => onAddPassword()}
                        >
                            <CardHeader className="flex gap-2">
                                <div className="flex flex-row gap-2 items-center">
                                    <Lock
                                        size={16}
                                        className="text-default-400"
                                    />
                                    <div className="flex flex-col text-left">
                                        <p className="text-md font-semibold text-default-400">
                                            Click to add password
                                        </p>
                                        <p className="text-sm text-default-500">
                                            <span className="text-default-400">
                                                No passwords yet
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
                                        <Lock
                                            size={16}
                                            className="text-default-400"
                                        />
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
