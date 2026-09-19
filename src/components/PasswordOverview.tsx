import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { PasswordEntry } from "@src/types/password";
import { PasswordInput } from "./PasswordInput";

interface PasswordOverviewProps {
    password?: PasswordEntry | null;
    isEditing?: boolean;
    onUpdate?: (password: PasswordEntry) => void;
}

export function PasswordOverview({
    password = null,
    isEditing = false,
    onUpdate = () => {},
}: PasswordOverviewProps) {
    const isEmpty = password === null;

    const [editablePassword, setEditablePassword] = useState<PasswordEntry>({
        id: null,
        title: "",
        username: "",
        password: "",
        url: "",
        note: "",
        created_at: "",
        updated_at: "",
    });

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

    const handleChange = (field: keyof PasswordEntry, value: string) => {
        const updated = { ...editablePassword, [field]: value };
        setEditablePassword(updated);
        onUpdate(updated);
    };

    const isInputDisabled = isEmpty && !isEditing;

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
        </Card>
    );
}
