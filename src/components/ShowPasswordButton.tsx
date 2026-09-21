import { Button } from "@nextui-org/react";
import { Eye, EyeOff } from "lucide-react";

export interface IShowPasswordButton {
    showPassword: boolean;
    onToggle: () => void;
    isDisabled: boolean;
}

export function ShowPasswordButton({ 
    showPassword, 
    onToggle, 
    isDisabled 
}: IShowPasswordButton) {
    return (
        <Button
            isIconOnly
            size="sm"
            variant="light"
            radius="sm"
            isDisabled={isDisabled}
            onPress={onToggle}
            className="min-w-0 h-8"
            aria-label={showPassword ? "Hide password" : "Show password"}
        >
            {showPassword ? (
                <EyeOff className="text-default-400" size={16} />
            ) : (
                <Eye className="text-default-400" size={16} />
            )}
        </Button>
    );
}
