import { Card, CardBody, CardHeader, Divider, ScrollShadow } from "@nextui-org/react";
import { IPasswordDTO } from "../types/passwordDTO";

interface ScrollableMenuProps {
    passwords: IPasswordDTO[];
}

export function ScrollableMenu({ passwords }: ScrollableMenuProps) {
    return (
        <ScrollShadow
            className="w-full max-h-[400px]"
            hideScrollBar
        >
            <div className="gap-2 flex flex-col">
                {passwords.map((password, index) => (
                    <Card
                        key={index}
                        className="w-full"
                        shadow="sm"
                    >
                        <CardHeader className="flex gap-2">
                            <div className="flex flex-col">
                                <p className="text-md font-semibold">{password.title}</p>
                                <p className="text-sm text-default-500">{password.username}</p>
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
