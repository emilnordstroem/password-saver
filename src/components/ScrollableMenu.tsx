import { Card, CardBody, CardHeader, Divider, ScrollShadow } from "@nextui-org/react";
import { PasswordEntry } from "@src/types/password";

interface ScrollableMenuProps {
    passwords?: PasswordEntry[];
    selectedPassword?: PasswordEntry | null;
    onSelectPassword?: (password: PasswordEntry | null) => void;
}

export function ScrollableMenu({ 
    passwords = [], 
    selectedPassword = null,
    onSelectPassword = () => {} 
}: ScrollableMenuProps) {
    const isEmpty = passwords.length === 0;
    
    const displayPasswords = isEmpty
        ? Array(3).fill(null).map(() => ({
              id: null,
              title: "",
              username: "",
              password: "",
              url: "",
              notes: "",
              created_at: "",
              updated_at: "",
          } as PasswordEntry))
        : passwords;

    const handleSelect = (password: PasswordEntry | null) => {
        if (!isEmpty) {
            onSelectPassword(password);
        }
    };

    return (
        <ScrollShadow
            className="w-full max-h-[400px]"
            hideScrollBar
        >
            <div className="gap-2 flex flex-col">
                {displayPasswords.map((password, index) => (
                    <Card
                        key={index}
                        className={`w-full ${selectedPassword === password ? "border-2 border-primary" : ""}`}
                        shadow="sm"
                        radius="sm"
                        isDisabled={isEmpty}
                        isHoverable={!isEmpty}
                        isPressable={!isEmpty}
                        onClick={() => handleSelect(isEmpty ? null : password)}
                    >
                        <CardHeader className="flex gap-2">
                            <div className="flex flex-col">
                                <p className="text-md font-semibold">{password.title || <span className="text-default-400">Empty</span>}</p>
                                <p className="text-sm text-default-500">{password.username || <span className="text-default-400">No username</span>}</p>
                            </div>
                        </CardHeader>
                        <Divider />
                        <CardBody></CardBody>
                    </Card>
                ))}
            </div>
        </ScrollShadow>
    );
}
