import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";
import { ICredentialsEntry } from "@src/types/credentials";
import { CredentialInput } from "./CredentialInput";
import { GeneratePasswordModal } from "./GeneratePasswordModal";
import { Shield } from "lucide-react";

interface CredentialsOverviewProps {
    credentials?: ICredentialsEntry | null;
    isEditing?: boolean;
    onUpdate?: (credential: ICredentialsEntry) => void;
    validationErrors?: Record<string, string>;
}

export function CredentialsOverview({
    credentials = null,
    isEditing = false,
    onUpdate = () => {},
    validationErrors: externalValidationErrors = {},
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
    const [internalValidationErrors, setInternalValidationErrors] = useState<Record<string, string>>({});
    
    // Combine external and internal validation errors
    const combinedValidationErrors = { ...internalValidationErrors, ...externalValidationErrors };

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
        
        // Clear internal validation error for this field when it changes
        if (internalValidationErrors[field as string]) {
            setInternalValidationErrors({ ...internalValidationErrors, [field]: "" });
        }
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
            classNames={{ base: "p-1" }}
        >
            <CardHeader className="flex gap-1.5 px-2 py-1">
                <CredentialInput
                    label="Title"
                    title={editableCredentials.title || ""}
                    isDisabled={isInputDisabled}
                    handleChange={handleChange}
                    isInvalid={!!combinedValidationErrors.title}
                    errorMessage={combinedValidationErrors.title}
                />
            </CardHeader>
            <CardBody className="flex flex-col gap-2 px-2 py-1">
                <CredentialInput
                    label="Username"
                    title={editableCredentials.username || ""}
                    isDisabled={isInputDisabled}
                    handleChange={handleChange}
                    isInvalid={!!combinedValidationErrors.username}
                    errorMessage={combinedValidationErrors.username}
                />
                <CredentialInput
                    label="Password"
                    title={editableCredentials.password || ""}
                    isDisabled={isInputDisabled}
                    handleChange={handleChange}
                    isInvalid={!!combinedValidationErrors.password}
                    errorMessage={combinedValidationErrors.password}
                />
                <Button
                    variant="light"
                    color="primary"
                    onClick={() => setIsGenerateModalOpen(true)}
                    isDisabled={isInputDisabled}
                    startContent={<Shield size={14} />}
                    className="w-fit h-6 text-sm"
                >
                    Generate password
                </Button>
                <CredentialInput
                    label="URL"
                    title={editableCredentials.url || ""}
                    isDisabled={isInputDisabled}
                    handleChange={handleChange}
                    isInvalid={!!combinedValidationErrors.url}
                    errorMessage={combinedValidationErrors.url}
                />
                <CredentialInput
                    label="Note"
                    title={editableCredentials.note || ""}
                    isDisabled={isInputDisabled}
                    handleChange={handleChange}
                    isInvalid={!!combinedValidationErrors.note}
                    errorMessage={combinedValidationErrors.note}
                />
            </CardBody>
            <GeneratePasswordModal
                isOpen={isGenerateModalOpen}
                onClose={() => setIsGenerateModalOpen(false)}
                onGenerate={handleGeneratePassword}
                hasExistingPassword={!!editableCredentials.password}
            />
        </Card>
    );
}
