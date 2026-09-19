import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Card,
    CardHeader,
} from "@nextui-org/react";
import { Lock } from "lucide-react";
import { ICredentialsEntry } from "@src/types/credentials";
import { getFaviconUrlWithFallback } from "@src/utils/favicon";
import { useState, useEffect, ReactNode } from "react";

export interface IConfirmModalProps {
    isModalOpen: boolean;
    handleConfirm: any;
    handleCancel: any;
    title?: string;
    message?: string | ReactNode;
    confirmText?: string;
    cancelText?: string;
    color?: "danger" | "primary" | "warning" | "success" | "default";
    credential?: ICredentialsEntry | null;
}

export function ConfirmModal({
    isModalOpen,
    handleConfirm,
    handleCancel,
    title = "Delete",
    message = "Are you sure you want to delete this password? This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    color = "danger",
    credential = null,
}: IConfirmModalProps) {
    const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
    const [faviconError, setFaviconError] = useState<boolean>(false);

    useEffect(() => {
        if (credential?.url) {
            const url = getFaviconUrlWithFallback(credential.url);
            setFaviconUrl(url);
            setFaviconError(false);
        } else {
            setFaviconUrl(null);
            setFaviconError(false);
        }
    }, [credential?.url]);

    const handleFaviconError = () => {
        setFaviconError(true);
    };

    const renderIcon = () => {
        if (!credential?.url) {
            return <Lock size={14} className="text-default-400" />;
        }

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

        return <Lock size={14} className="text-default-400" />;
    };

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={handleCancel}
            size="sm"
            backdrop="blur"
            scrollBehavior="outside"
        >
            <ModalContent
                onKeyUp={(event) => {
                    if (event.key === 'Enter') {
                        handleConfirm();
                    } else if (event.key === 'Escape') {
                        handleCancel();
                    }
                }}
                className="max-h-[80vh] overflow-hidden"
            >
                <ModalHeader>{title}</ModalHeader>
                <ModalBody className="overflow-y-auto">
                    {credential && (
                        <Card
                            className="w-full"
                            shadow="sm"
                            radius="sm"
                            tabIndex={0}
                            classNames={{ base: "py-1" }}
                        >
                            <CardHeader className="flex gap-1 justify-between px-2 py-1">
                                <div className="flex flex-row gap-1.5 items-center flex-1 cursor-pointer min-w-0">
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
                            </CardHeader>
                        </Card>
                    )}
                    <p className="mt-2">{message}</p>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onClick={handleCancel}>
                        {cancelText}
                    </Button>
                    <Button color={color} onClick={handleConfirm}>
                        {confirmText}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
