import { Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { Lock, LockOpen, Save, SaveCheck, Trash } from "lucide-react";
import { ICredentialsEntry } from "@src/types/credentials";

interface CredentialsMenuItemProps {
    credential: ICredentialsEntry;
    index: number;
    selectedCredential: ICredentialsEntry | null;
    handleSelect: (credential: ICredentialsEntry) => void;
    handleSave: (
        event: React.MouseEvent,
        credential: ICredentialsEntry,
    ) => void;
    handleDelete: (
        event: React.MouseEvent,
        credential: ICredentialsEntry,
    ) => void;
    isSaved: boolean;
}

export function CredentialsMenuItem({
    credential,
    index,
    selectedCredential,
    handleSelect,
    handleSave,
    handleDelete,
    isSaved,
}: CredentialsMenuItemProps) {
    return (
        <Card
            key={index}
            className={`w-full ${selectedCredential === credential ? "border-2 border-primary" : ""}`}
            shadow="sm"
            radius="sm"
            isHoverable
            isPressable
            onClick={() => handleSelect(credential)}
        >
            <CardHeader className="flex gap-2 justify-between">
                <div className="flex flex-row gap-2 items-center">
                    {selectedCredential === credential ? (
                        <LockOpen size={16} className="text-default-400" />
                    ) : (
                        <Lock size={16} className="text-default-400" />
                    )}
                    <div className="flex flex-col text-left">
                        <p className="text-md font-semibold">
                            {credential.title || (
                                <span className="text-default-400">Empty</span>
                            )}
                        </p>
                        <p className="text-sm text-default-500">
                            {credential.username || (
                                <span className="text-default-400">
                                    No username
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                <div>
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color={isSaved ? "success" : "default"}
                        onClick={(event) => handleSave(event, credential)}
                        aria-label="Save password"
                    >
                        {isSaved ? (
                            <SaveCheck size={16} />
                        ) : (
                            <Save size={16} />
                        )}
                    </Button>
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onClick={(event) => handleDelete(event, credential)}
                        aria-label="Delete password"
                    >
                        <Trash size={16} />
                    </Button>
                </div>
            </CardHeader>
            <Divider />
            <CardBody></CardBody>
        </Card>
    );
}
