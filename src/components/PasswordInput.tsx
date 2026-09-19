import { Input } from "@nextui-org/react";
import { User, Lock, Globe, FileText, Key, Tag } from "lucide-react";

export interface IPasswordInputProps {
    label: string;
    title: string;
    isDisabled: boolean;
    handleChange: any;
    type?: string;
}

export function PasswordInput({
    label,
    title,
    isDisabled,
    handleChange,
    type = "text",
}: IPasswordInputProps) {
    const getIcon = () => {
        const lowerLabel = label.toLowerCase();
        switch (true) {
            case lowerLabel.includes("username"):
                return <User className="text-default-400" size={20} />;
            case lowerLabel.includes("password"):
                return <Lock className="text-default-400" size={20} />;
            case lowerLabel.includes("url"):
                return <Globe className="text-default-400" size={20} />;
            case lowerLabel.includes("notes"):
                return <FileText className="text-default-400" size={20} />;
            case lowerLabel.includes("title"):
                return <Tag className="text-default-400" size={20} />;
            default:
                return <Key className="text-default-400" size={20} />;
        }
    };

    return (
        <div>
            <Input
                label={label}
                value={title}
                isDisabled={isDisabled}
                className="w-full"
                variant="bordered"
                type={type}
                startContent={getIcon()}
                onValueChange={(value) => handleChange(label, value)}
            />
        </div>
    );
}
