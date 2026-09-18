import { Card, CardBody, CardHeader, Divider, ScrollShadow } from "@nextui-org/react";
import { IPasswordDTO } from "../types/passwordDTO";

interface ScrollableMenuProps {
    passwords?: IPasswordDTO[];
}

export function ScrollableMenu({ passwords = [] }: ScrollableMenuProps) {
    const isEmpty = passwords.length === 0;
    
    const displayPasswords = isEmpty
        ? Array(3).fill(null).map((_, i) => ({
              title: "",
              username: "",
          } as IPasswordDTO))
        : passwords;

    return (
        <ScrollShadow
            className="w-full max-h-[400px]"
            hideScrollBar
        >
            <div className="gap-2 flex flex-col">
                {displayPasswords.map((password, index) => (
                    <Card
                        key={index}
                        className="w-full"
                        shadow="sm"
                        isDisabled={isEmpty}
                        isHoverable={!isEmpty}
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
