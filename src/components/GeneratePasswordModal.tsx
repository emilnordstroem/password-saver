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
                size="md"
                backdrop="blur"
                scrollBehavior="outside"
            >
                <ModalContent
                    onKeyUp={(event) => {
                        if (event.key === 'Enter') {
                            handleConfirm();
                        } else if (event.key === 'Escape') {
                            onClose();
                        }
                    }}
                    className="max-h-[85vh] overflow-hidden"
                >
                    <ModalHeader className="flex flex-col gap-1 pb-2">
                        <span className="text-lg font-semibold">Generate Password</span>
                    </ModalHeader>
                    <ModalBody className="overflow-y-auto px-4 pb-2">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-row gap-2">
                                <Input
                                    type="text"
                                    value={password}
                                    readOnly
                                    radius="sm"
                                    className="flex-1 text-sm"
                                    size="sm"
                                />
                                <CopyToClipboardButton text={password} />
                                <Button
                                    radius="sm"
                                    isIconOnly={true}
                                    onPress={() =>
                                        setPassword(generatePassword(options))
                                    }
                                    color="default"
                                    variant="light"
                                    size="sm"
                                    className="min-w-0 w-8"
                                >
                                    <RotateCw size={14} />
                                </Button>
                            </div>
                            <div className="flex justify-start">
                                <span
                                    className={`text-xs font-medium ${getPasswordStrength(password)}`}
                                >
                                    Strength: {getPasswordStrength(password)}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <Input
                                    type="range"
                                    size="sm"
                                    min={MIN_LENGTH.toString()}
                                    max={MAX_LENGTH.toString()}
                                    step="1"
                                    value={options.length.toString()}
                                    onChange={(e) =>
                                        handleLengthAfterChange(
                                            Number(e.target.value),
                                        )
                                    }
                                />
                                <div className="flex justify-between text-xs text-default-500">
                                    <span>{MIN_LENGTH}</span>
                                    <span>{options.length}</span>
                                    <span>{MAX_LENGTH}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="text-xs font-medium text-default-600">
                                    Character Options
                                </div>
                                <div className="flex flex-row flex-wrap gap-3">
                                    <Checkbox
                                        radius="sm"
                                        isSelected={options.useUppercase}
                                        onValueChange={() =>
                                            handleOptionAfterChange("useUppercase")
                                        }
                                        size="sm"
                                        classNames={{ label: "text-xs" }}
                                    >
                                        Uppercase (A-Z)
                                    </Checkbox>
                                    <Checkbox
                                        radius="sm"
                                        isSelected={options.useLowercase}
                                        onValueChange={() =>
                                            handleOptionAfterChange("useLowercase")
                                        }
                                        size="sm"
                                        classNames={{ label: "text-xs" }}
                                    >
                                        Lowercase (a-z)
                                    </Checkbox>
                                    <Checkbox
                                        radius="sm"
                                        isSelected={options.useNumbers}
                                        onValueChange={() =>
                                            handleOptionAfterChange("useNumbers")
                                        }
                                        size="sm"
                                        classNames={{ label: "text-xs" }}
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
                                        size="sm"
                                        classNames={{ label: "text-xs" }}
                                    >
                                        Special Characters
                                    </Checkbox>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter className="pt-2">
                        <Button
                            color="default"
                            variant="light"
                            onPress={onClose}
                            radius="sm"
                            size="sm"
                        >
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            onPress={handleConfirm}
                            radius="sm"
                            size="sm"
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
