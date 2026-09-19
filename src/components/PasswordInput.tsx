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
        if (lowerLabel.includes("username")) return <User className="text-default-400" size={20} />;
        if (lowerLabel.includes("password")) return <Lock className="text-default-400" size={20} />;
        if (lowerLabel.includes("url")) return <Globe className="text-default-400" size={20} />;
        if (lowerLabel.includes("note")) return <FileText className="text-default-400" size={20} />;
        if (lowerLabel.includes("title")) return <Tag className="text-default-400" size={20} />;
        return <Key className="text-default-400" size={20} />;
    };

    const getFieldName = () => {
        const lowerLabel = label.toLowerCase();
        if (lowerLabel.includes("username")) return "username";
        if (lowerLabel.includes("password")) return "password";
        if (lowerLabel.includes("url")) return "url";
        if (lowerLabel.includes("note")) return "note";
        if (lowerLabel.includes("title")) return "title";
        return label.toLowerCase();
    };

    return (
        <div className="flex items-start gap-2 w-full">
            <div className="pt-2">
                {getIcon()}
            </div>
            <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                    {label}
                </label>
                <Input
                    value={title}
                    isDisabled={isDisabled}
                    className="w-full"
                    variant="bordered"
                    type={type}
                    onValueChange={(value) => handleChange(getFieldName(), value)}
                />
            </div>
        </div>
    );
}
