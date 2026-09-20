import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { ICredentialsEntry } from "@src/types/credentials";
import { CredentialsMenuItem } from "./CredentialsMenuItem";
import { Lock } from "lucide-react";

export interface ICredentialsListProps {
    credentialsList: ICredentialsEntry[];
    hasCredentials: boolean;
    selectedCredential: ICredentialsEntry | null;
    onAddCredential: () => void;
    onClearSearch: () => void;
    savedCredentials: Set<number>;
    handleSelect: (credential: ICredentialsEntry) => Promise<void> | void;
    handleSave: (e: React.MouseEvent | React.KeyboardEvent, credential: ICredentialsEntry) => Promise<void>;
    handleDelete: (e: React.MouseEvent | React.KeyboardEvent, credential: ICredentialsEntry) => void;
}

export function CredentialsList({
    credentialsList,
    hasCredentials,
    selectedCredential,
    onAddCredential,
    onClearSearch,
    savedCredentials,
    handleSelect,
    handleSave,
    handleDelete,
}: ICredentialsListProps) {
    return (
        <div className="gap-2 flex flex-col">
            {credentialsList.length === 0 ? (
                <Card
                    className="w-full"
                    shadow="sm"
                    radius="sm"
                    isHoverable={onAddCredential !== undefined}
                    isPressable={onAddCredential !== undefined}
                    onClick={() => {
                        onAddCredential();
                        onClearSearch();
                    }}
                >
                    <CardHeader className="flex gap-2">
                        <div className="flex flex-row gap-2 items-center">
                            <Lock size={16} className="text-default-400" />
                            <div className="flex flex-col text-left">
                                <p className="text-md font-semibold text-default-400">
                                    {hasCredentials
                                        ? "No results found"
                                        : "No passwords yet"}
                                </p>
                                <p className="text-sm text-default-500">
                                    <span className="text-default-400">
                                        Click to add a password
                                    </span>
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody></CardBody>
                </Card>
            ) : (
                credentialsList.map((credential, index) => (
                    <CredentialsMenuItem
                        key={credential.id || `new-${index}`}
                        credential={credential}
                        index={index}
                        selectedCredential={selectedCredential}
                        handleSelect={handleSelect}
                        handleSave={handleSave}
                        handleDelete={handleDelete}
                        isSaved={savedCredentials.has(credential.id || 0)}
                    />
                ))
            )}
        </div>
    );
}
