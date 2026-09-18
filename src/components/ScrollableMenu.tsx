import { Card, CardBody, CardHeader, Divider, ScrollShadow } from "@nextui-org/react";
import { IPasswordDTO } from "../types/passwordDTO";

interface ScrollableMenuProps {
    passwords?: IPasswordDTO[];
    selectedPassword?: IPasswordDTO | null;
    onSelectPassword?: (password: IPasswordDTO | null) => void;
}

export function ScrollableMenu({ 
    passwords = [], 
    selectedPassword = null,
    onSelectPassword = () => {} 
}: ScrollableMenuProps) {
    const isEmpty = passwords.length === 0;
    
    const displayPasswords = isEmpty
        ? Array(3).fill(null).map(() => ({
              title: "",
              username: "",
              password: "",
              url: "",
              note: "",
          } as IPasswordDTO))
        : passwords;

    const handleSelect = (password: IPasswordDTO | null) => {
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
