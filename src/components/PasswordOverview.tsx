import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Divider, Button } from "@nextui-org/react";
import { ILoginEntry } from "@src/types/login";
import { PasswordInput } from "./PasswordInput";
import { GeneratePasswordModal } from "./GeneratePasswordModal";
import { Shield } from "lucide-react";

interface PasswordOverviewProps {
    password?: ILoginEntry | null;
    isEditing?: boolean;
    onUpdate?: (password: ILoginEntry) => void;
}

export function PasswordOverview({
    password = null,
    isEditing = false,
    onUpdate = () => {},
}: PasswordOverviewProps) {
    const isEmpty = password === null;

    const [editablePassword, setEditablePassword] = useState<ILoginEntry>({
        id: null,
        title: "",
        username: "",
        password: "",
        url: "",
        note: "",
        created_at: "",
        updated_at: "",
    });

    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

    useEffect(() => {
        if (password) {
            setEditablePassword(password);
        } else {
            setEditablePassword({
                id: null,
                title: "",
                username: "",
                password: "",
                url: "",
                note: "",
                created_at: "",
                updated_at: "",
            });
        }
    }, [password]);

    const handleChange = (field: keyof ILoginEntry, value: string) => {
        const updated = { ...editablePassword, [field]: value };
        setEditablePassword(updated);
        onUpdate(updated);
    };

    const isInputDisabled = isEmpty && !isEditing;

    const handleGeneratePassword = (generatedPassword: string) => {
        handleChange("password", generatedPassword);
    };

    return (
        <Card
            className="w-full h-full"
            shadow="sm"
            radius="sm"
            isDisabled={isEmpty && !isEditing}
        >
            <CardHeader className="flex gap-2">
                <PasswordInput
                    label="Title"
                    title={editablePassword.title || ""}
                    isDisabled={isInputDisabled}
                    handleChange={handleChange}
                />
            </CardHeader>
            <Divider />
            <CardBody className="flex flex-col gap-4">
                <PasswordInput
                    label="Username"
                    title={editablePassword.username || ""}
                    isDisabled={isInputDisabled}
                    handleChange={handleChange}
                />
                <PasswordInput
                    label="Password"
                    title={editablePassword.password || ""}
                    isDisabled={isInputDisabled}
                    handleChange={handleChange}
                />
                <Button
                    variant="light"
                    color="primary"
                    onClick={() => setIsGenerateModalOpen(true)}
                    isDisabled={isInputDisabled}
                    startContent={<Shield size={16} />}
                    className="w-fit"
                >
                    Generate Password
                </Button>
                <Divider />
                <PasswordInput
                    label="URL"
                    title={editablePassword.url || ""}
                    isDisabled={isInputDisabled}
                    handleChange={handleChange}
                />
                <PasswordInput
                    label="Note"
                    title={editablePassword.note || ""}
                    isDisabled={isInputDisabled}
                    handleChange={handleChange}
                />
            </CardBody>
            <GeneratePasswordModal
                isOpen={isGenerateModalOpen}
                onClose={() => setIsGenerateModalOpen(false)}
                onGenerate={handleGeneratePassword}
            />
        </Card>
    );
}
