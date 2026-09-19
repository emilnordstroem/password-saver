import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Divider, Button } from "@nextui-org/react";
import { ICredentialsEntry } from "@src/types/credentials";
import { CredentialInput } from "./CredentialInput";
import { GeneratePasswordModal } from "./GeneratePasswordModal";
import { Shield } from "lucide-react";

interface CredentialsOverviewProps {
    credentials?: ICredentialsEntry | null;
    isEditing?: boolean;
    onUpdate?: (password: ICredentialsEntry) => void;
}

export function CredentialsOverview({
    credentials = null,
    isEditing = false,
    onUpdate = () => {},
}: CredentialsOverviewProps) {
    const isEmpty = credentials === null;

    const [editableCredentials, setEditableCredential] =
        useState<ICredentialsEntry>({
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
        if (credentials) {
            setEditableCredential(credentials);
        } else {
            setEditableCredential({
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
    }, [credentials]);

    const handleChange = (field: keyof ICredentialsEntry, value: string) => {
        const updated = { ...editableCredentials, [field]: value };
        setEditableCredential(updated);
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
                <CredentialInput
                    label="Title"
                    title={editableCredentials.title || ""}
                    isDisabled={isInputDisabled}
                    handleChange={handleChange}
                />
            </CardHeader>
            <Divider />
            <CardBody className="flex flex-col gap-4">
                <CredentialInput
                    label="Username"
                    title={editableCredentials.username || ""}
                    isDisabled={isInputDisabled}
                    handleChange={handleChange}
                />
                <CredentialInput
                    label="Password"
                    title={editableCredentials.password || ""}
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
                <CredentialInput
                    label="URL"
                    title={editableCredentials.url || ""}
                    isDisabled={isInputDisabled}
                    handleChange={handleChange}
                />
                <CredentialInput
                    label="Note"
                    title={editableCredentials.note || ""}
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
