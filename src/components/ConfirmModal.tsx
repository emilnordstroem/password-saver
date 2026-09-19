import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@nextui-org/react";

export interface IConfirmModalProps {
    isModalOpen: boolean;
    handleConfirm: any;
    handleCancel: any;
}

export function ConfirmModal({
    isModalOpen,
    handleConfirm,
    handleCancel,
}: IConfirmModalProps) {
    return (
        <Modal
            isOpen={isModalOpen}
            onClose={handleCancel}
            size="sm"
            backdrop="blur"
        >
            <ModalContent>
                <ModalHeader>Delete Password</ModalHeader>
                <ModalBody>
                    Are you sure you want to delete this password? This action
                    cannot be undone.
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button color="danger" onClick={handleConfirm}>
                        Delete
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
