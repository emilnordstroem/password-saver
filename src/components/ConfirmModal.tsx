import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@nextui-org/react";
import { ReactNode } from "react";

export interface IConfirmModalProps {
    isModalOpen: boolean;
    handleConfirm: any;
    handleCancel: any;
    title?: string;
    message?: string | ReactNode;
    confirmText?: string;
    cancelText?: string;
    color?: "danger" | "primary" | "warning" | "success" | "default";
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
}: IConfirmModalProps) {
    return (
        <Modal
            isOpen={isModalOpen}
            onClose={handleCancel}
            size="sm"
            backdrop="blur"
        >
            <ModalContent
                onKeyUp={(event) => {
                    if (event.key === 'Enter') {
                        handleConfirm();
                    } else if (event.key === 'Escape') {
                        handleCancel();
                    }
                }}
            >
                <ModalHeader>{title}</ModalHeader>
                <ModalBody>{message}</ModalBody>
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
