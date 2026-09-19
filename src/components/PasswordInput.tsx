import { Input } from "@nextui-org/react";
import {
    User,
    Lock,
    Globe,
    FileText,
    Key,
    Tag,
} from "lucide-react";
import { CopyToClipboardButton } from "./CopyToClipboardButton";

export interface IPasswordInputProps {
    label: string;
    title: string;
    isDisabled: boolean;
    handleChange: any;
    placeholder?: string;
}

export function PasswordInput({
    label,
    title,
    isDisabled,
    handleChange,
    placeholder,
}: IPasswordInputProps) {
    const getIcon = () => {
        const lowerLabel = label.toLowerCase();
        if (lowerLabel.includes("username"))
            return <User className="text-default-400" size={20} />;
        if (lowerLabel.includes("password"))
            return <Lock className="text-default-400" size={20} />;
        if (lowerLabel.includes("url"))
            return <Globe className="text-default-400" size={20} />;
        if (lowerLabel.includes("note"))
            return <FileText className="text-default-400" size={20} />;
        if (lowerLabel.includes("title"))
            return <Tag className="text-default-400" size={20} />;
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

    const isPasswordField = label.toLowerCase().includes("password");

    const getPlaceholder = () => {
        const lowerLabel = label.toLowerCase();
        if (lowerLabel.includes("username")) return "Enter username or email";
        if (lowerLabel.includes("password")) return "Enter password";
        if (lowerLabel.includes("url")) return "https://example.com";
        if (lowerLabel.includes("note")) return "Additional notes";
        if (lowerLabel.includes("title")) return "Service or account name";
        return placeholder || label;
    };

    return (
        <div className="flex items-start gap-2 w-full">
            <div className="pt-2">{getIcon()}</div>
            <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                    {label}
                </label>
                <div className="relative">
                    <Input
                        value={title}
                        isDisabled={isDisabled}
                        className="w-full"
                        variant="bordered"
                        type={isPasswordField ? "password" : "text"}
                        placeholder={getPlaceholder()}
                        onValueChange={(value) =>
                            handleChange(getFieldName(), value)
                        }
                    />
                    {isPasswordField && (
                        <div className="absolute right-0 top-0 h-full flex items-center pr-2 gap-1">
                            <CopyToClipboardButton
                                text={title}
                                isDisabled={isDisabled}
                                className="min-w-unit-6 h-unit-6"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
