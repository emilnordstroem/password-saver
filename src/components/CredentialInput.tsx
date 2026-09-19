import { Input } from "@nextui-org/react";
import { User, Lock, Globe, FileText, Key, Tag } from "lucide-react";
import { CopyToClipboardButton } from "./CopyToClipboardButton";

export interface ICredentialInputProps {
    label: string;
    title: string;
    isDisabled: boolean;
    handleChange: any;
    placeholder?: string;
    isInvalid?: boolean;
    errorMessage?: string;
}

export function CredentialInput({
    label,
    title,
    isDisabled,
    handleChange,
    placeholder,
    isInvalid = false,
    errorMessage,
}: ICredentialInputProps) {
    const getIcon = () => {
        const lowerLabel = label.toLowerCase();
        if (lowerLabel.includes("username"))
            return <User className="text-default-400" size={16} />;
        if (lowerLabel.includes("password"))
            return <Lock className="text-default-400" size={16} />;
        if (lowerLabel.includes("url"))
            return <Globe className="text-default-400" size={16} />;
        if (lowerLabel.includes("note"))
            return <FileText className="text-default-400" size={16} />;
        if (lowerLabel.includes("title"))
            return <Tag className="text-default-400" size={16} />;
        return <Key className="text-default-400" size={16} />;
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
        <div className="flex items-start gap-1.5 w-full">
            <div className="pt-1.5">{getIcon()}</div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-0.5">
                    <label className="text-xs font-medium">
                        {label}
                    </label>
                    {errorMessage && (
                        <span className="text-xs text-danger-500 font-medium">
                            {errorMessage}
                        </span>
                    )}
                </div>
                <div className="flex gap-1">
                    <Input
                        value={title}
                        isDisabled={isDisabled}
                        className="flex-1"
                        variant="bordered"
                        type={isPasswordField ? "password" : "text"}
                        placeholder={getPlaceholder()}
                        onValueChange={(value) =>
                            handleChange(getFieldName(), value)
                        }
                        isInvalid={isInvalid}
                        size="sm"
                    />
                    {isPasswordField && (
                        <CopyToClipboardButton
                            text={title}
                            isDisabled={isDisabled}
                            className="min-w-0 h-8"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
