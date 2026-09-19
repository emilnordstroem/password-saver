import { Input } from "@nextui-org/react";

export interface IPasswordInputProps {
    label: string;
    title: string;
    isDisabled: boolean;
    handleChange: any;
}

export function PasswordInput({
    label,
    title,
    isDisabled,
    handleChange,
}: IPasswordInputProps) {
    return (
        <div>
            <Input
                label={label}
                value={title}
                isDisabled={isDisabled}
                className="w-full"
                variant="bordered"
                onValueChange={(value) => handleChange(label, value)}
            />
        </div>
    );
}
