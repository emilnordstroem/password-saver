import { useState } from "react";
import { Button, Tooltip } from "@nextui-org/react";
import { Copy, Check } from "lucide-react";

export interface ICopyToClipboardButtonProps {
    text: string;
    isDisabled?: boolean;
    tooltipContent?: {
        default: string;
        copied: string;
    };
    onCopy?: () => void;
    className?: string;
}

export function CopyToClipboardButton({
    text,
    isDisabled = false,
    tooltipContent = { default: "Copy to clipboard", copied: "Copied!" },
    onCopy,
    className,
}: ICopyToClipboardButtonProps) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            onCopy?.();
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    return (
        <Button
            isIconOnly={true}
            size="sm"
            variant="solid"
            onClick={handleCopy}
            isDisabled={isDisabled || !text}
            radius="sm"
            className={`min-w-0 h-8 w-8 ${className || ""}`}
        >
            {isCopied ? <Check size={14} /> : <Copy size={14} />}
        </Button>
    );
}
