import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Checkbox,
} from "@nextui-org/react";
import { RotateCw } from "lucide-react";
import { useState, useEffect } from "react";
import { CopyToClipboardButton } from "./CopyToClipboardButton";
import { getPasswordStrength } from "@src/services/passwordStrength";
import {
    PasswordOptions,
    generatePassword,
} from "@src/services/passwordGenerator";
import { ConfirmModal } from "./ConfirmModal";

export interface IGeneratePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (password: string) => void;
    hasExistingPassword?: boolean;
}

const MIN_LENGTH = 8;
const MAX_LENGTH = 64;

export function GeneratePasswordModal({
    isOpen,
    onClose,
    onGenerate,
    hasExistingPassword = false,
}: IGeneratePasswordModalProps) {
    const [password, setPassword] = useState("");
    const [options, setOptions] = useState<PasswordOptions>({
        length: 16,
        useUppercase: true,
        useLowercase: true,
        useNumbers: true,
        useSpecialChars: false,
    });
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setPassword(generatePassword(options));
        }
    }, [isOpen, options, generatePassword]);

    const handleConfirm = () => {
        if (hasExistingPassword) {
            setIsConfirmModalOpen(true);
        } else {
            onGenerate(password);
            onClose();
        }
    };

    const handleConfirmOverride = () => {
        onGenerate(password);
        onClose();
        setIsConfirmModalOpen(false);
    };

    const handleCancelOverride = () => {
        setIsConfirmModalOpen(false);
    };

    const handleLengthAfterChange = (value: number) => {
        setOptions((prev) => ({ ...prev, length: value }));
    };

    const handleOptionAfterChange = (key: keyof PasswordOptions) => {
        setOptions((prev) => {
            const newOptions = {
                ...prev,
                [key]: !prev[key],
            };
            setPassword(generatePassword(newOptions));
            return newOptions;
        });
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="lg"
                backdrop="blur"
                className="max-w-2xl"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        Generate Password
                    </ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-row gap-2">
                                    <Input
                                        type="text"
                                        value={password}
                                        readOnly
                                        radius="sm"
                                        className="flex-1"
                                    />
                                    <CopyToClipboardButton text={password} />
                                    <Button
                                        radius="sm"
                                        isIconOnly={true}
                                        onPress={() =>
                                            setPassword(generatePassword(options))
                                        }
                                        color="default"
                                        variant="solid"
                                    >
                                        <RotateCw size={16} />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex justify-start">
                                <span
                                    className={`text-sm font-medium ${getPasswordStrength(password)}`}
                                >
                                    Strength: {getPasswordStrength(password)}
                                </span>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Input
                                    type="range"
                                    size="md"
                                    min={MIN_LENGTH.toString()}
                                    max={MAX_LENGTH.toString()}
                                    step="1"
                                    value={options.length.toString()}
                                    onChange={(e) =>
                                        handleLengthAfterChange(
                                            Number(e.target.value),
                                        )
                                    }
                                    className="mt-4"
                                />
                                <div className="flex justify-between text-sm text-default-500">
                                    <span>{MIN_LENGTH}</span>
                                    <span>{options.length}</span>
                                    <span>{MAX_LENGTH}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 mt-2">
                                <div className="text-sm font-medium text-default-600">
                                    Character Options
                                </div>
                                <div className="flex flex-row flex-wrap gap-4">
                                    <Checkbox
                                        radius="sm"
                                        isSelected={options.useUppercase}
                                        onValueChange={() =>
                                            handleOptionAfterChange("useUppercase")
                                        }
                                    >
                                        Uppercase (A-Z)
                                    </Checkbox>
                                    <Checkbox
                                        radius="sm"
                                        isSelected={options.useLowercase}
                                        onValueChange={() =>
                                            handleOptionAfterChange("useLowercase")
                                        }
                                    >
                                        Lowercase (a-z)
                                    </Checkbox>
                                    <Checkbox
                                        radius="sm"
                                        isSelected={options.useNumbers}
                                        onValueChange={() =>
                                            handleOptionAfterChange("useNumbers")
                                        }
                                    >
                                        Numbers (0-9)
                                    </Checkbox>
                                    <Checkbox
                                        radius="sm"
                                        isSelected={options.useSpecialChars}
                                        onValueChange={() =>
                                            handleOptionAfterChange(
                                                "useSpecialChars",
                                            )
                                        }
                                    >
                                        Special Characters
                                    </Checkbox>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="default"
                            variant="light"
                            onPress={onClose}
                            radius="sm"
                        >
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            onPress={handleConfirm}
                            radius="sm"
                            isDisabled={password.length === 0}
                        >
                            Confirm
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <ConfirmModal
                isModalOpen={isConfirmModalOpen}
                handleConfirm={handleConfirmOverride}
                handleCancel={handleCancelOverride}
                title="Override Password"
                message="This will override the existing password. Are you sure?"
                confirmText="Override"
                cancelText="Cancel"
                color="warning"
            />
        </>
    );
}
