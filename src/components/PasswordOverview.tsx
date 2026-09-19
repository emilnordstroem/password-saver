import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Divider, Input } from "@nextui-org/react";
import { PasswordEntry } from "@src/types/password";

interface PasswordOverviewProps {
    password?: PasswordEntry | null;
    isEditing?: boolean;
    onUpdate?: (password: PasswordEntry) => void;
}

export function PasswordOverview({ password = null, isEditing = false, onUpdate = () => {} }: PasswordOverviewProps) {
    const isEmpty = password === null;

    const [editablePassword, setEditablePassword] = useState<PasswordEntry>({
        id: null,
        title: "",
        username: "",
        password: "",
        url: "",
        notes: "",
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
                notes: "",
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
                <div className="flex flex-col w-full">
                    <p className="text-md font-semibold">Password Details</p>
                    <p className="text-sm text-default-500">
                        {isEmpty && !isEditing ? "No password selected" : isEditing ? "Add new password" : "Edit password fields"}
                    </p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className="flex flex-col gap-4">
                <Input
                    label="Title"
                    value={editablePassword.title}
                    isDisabled={isInputDisabled}
                    className="w-full"
                    variant="bordered"
                    onValueChange={(value) => handleChange("title", value)}
                />
                <Input
                    label="Username"
                    value={editablePassword.username || ""}
                    isDisabled={isInputDisabled}
                    className="w-full"
                    variant="bordered"
                    onValueChange={(value) => handleChange("username", value)}
                />
                <Input
                    label="Password"
                    value={editablePassword.password || ""}
                    isDisabled={isInputDisabled}
                    className="w-full"
                    variant="bordered"
                    type="password"
                    onValueChange={(value) => handleChange("password", value)}
                />
                <Input
                    label="URL"
                    value={editablePassword.url || ""}
                    isDisabled={isInputDisabled}
                    className="w-full"
                    variant="bordered"
                    onValueChange={(value) => handleChange("url", value)}
                />
                <Input
                    label="Notes"
                    value={editablePassword.notes || ""}
                    isDisabled={isInputDisabled}
                    className="w-full"
                    variant="bordered"
                    onValueChange={(value) => handleChange("notes", value)}
                />
            </CardBody>
        </Card>
    );
}
