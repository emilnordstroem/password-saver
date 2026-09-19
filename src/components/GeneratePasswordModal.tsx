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
import { Check, Copy, RotateCw } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

export interface IGeneratePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (password: string) => void;
}

interface PasswordOptions {
    length: number;
    useUppercase: boolean;
    useLowercase: boolean;
    useNumbers: boolean;
    useSpecialChars: boolean;
}

const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const NUMBER_CHARS = "0123456789";
const SPECIAL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

const MIN_LENGTH = 8;
const MAX_LENGTH = 64;

export function GeneratePasswordModal({
    isOpen,
    onClose,
    onGenerate,
}: IGeneratePasswordModalProps) {
    const [password, setPassword] = useState("");
    const [options, setOptions] = useState<PasswordOptions>({
        length: 16,
        useUppercase: true,
        useLowercase: true,
        useNumbers: true,
        useSpecialChars: false,
    });
    const [copied, setCopied] = useState(false);

    const getPasswordStrength = useCallback(() => {
        if (password.length === 0) return "Empty";
        if (password.length < 8) return "Very Weak";

        let score = 0;
        if (password.length >= 12) score++;
        if (password.length >= 16) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        if (score >= 5) return "Strong";
        if (score >= 3) return "Weak";
    }, [password]);

    const getStrengthColor = useCallback(() => {
        const strength = getPasswordStrength();
        switch (strength) {
            case "Strong":
                return "text-success";
            case "Weak":
                return "text-danger";
            default:
                return "text-default-500";
        }
    }, [getPasswordStrength]);

    const generatePassword = useCallback(() => {
        let chars = "";
        if (options.useUppercase) chars += UPPERCASE_CHARS;
        if (options.useLowercase) chars += LOWERCASE_CHARS;
        if (options.useNumbers) chars += NUMBER_CHARS;
        if (options.useSpecialChars) chars += SPECIAL_CHARS;

        if (chars.length === 0) {
            setPassword("");
            return;
        }

        let newPassword = "";
        for (let i = 0; i < options.length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            newPassword += chars[randomIndex];
        }
        setPassword(newPassword);
    }, [options]);

    useEffect(() => {
        if (isOpen) {
            generatePassword();
        }
    }, [isOpen, generatePassword]);

    const handleCopy = async () => {
        if (password) {
            try {
                await navigator.clipboard.writeText(password);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (error) {
                console.error("Failed to copy:", error);
            }
        }
    };

    const handleConfirm = () => {
        onGenerate(password);
        onClose();
    };

    const handleLengthAfterChange = (value: number) => {
        setOptions((prev) => ({ ...prev, length: value }));
        generatePassword();
    };

    const handleOptionAfterChange = (key: keyof PasswordOptions) => {
        setOptions((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
        generatePassword();
    };

    return (
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
                        <div className="flex flex-row gap-2">
                            <Input
                                type="text"
                                value={password}
                                readOnly
                                radius="sm"
                                className="flex-1"
                                label="Generated Password"
                            />
                            <Button
                                radius="sm"
                                size="md"
                                onPress={handleCopy}
                                color={copied ? "success" : "default"}
                                variant={copied ? "flat" : "solid"}
                            >
                                {copied ? <Check /> : <Copy />}
                            </Button>
                            <Button
                                radius="sm"
                                size="md"
                                onPress={generatePassword}
                                color="default"
                                variant="solid"
                            >
                                <RotateCw />
                            </Button>
                        </div>
                        <div className="flex justify-start">
                            <span
                                className={`text-sm font-medium ${getStrengthColor()}`}
                            >
                                Strength: {getPasswordStrength()}
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
    );
}
