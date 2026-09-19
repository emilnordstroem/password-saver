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
        <Tooltip
            content={isCopied ? tooltipContent.copied : tooltipContent.default}
        >
            <Button
                isIconOnly={true}
                size="sm"
                variant="solid"
                onClick={handleCopy}
                isDisabled={isDisabled || !text}
                radius="sm"
                className={className}
            >
                {isCopied ? <Check size={16} /> : <Copy size={16} />}
            </Button>
        </Tooltip>
    );
}
