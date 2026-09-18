import { Card, CardBody, CardHeader, Divider, Input } from "@nextui-org/react";
import { IPasswordDTO } from "../types/passwordDTO";

interface PasswordOverviewProps {
    password?: IPasswordDTO | null;
}

export function PasswordOverview({ password = null }: PasswordOverviewProps) {
    const isEmpty = password === null;

    const displayPassword: IPasswordDTO = isEmpty
        ? {
              title: "",
              username: "",
              password: "",
              url: "",
              note: "",
          }
        : password;

    return (
        <Card
            className="w-full h-full"
            shadow="sm"
            radius="sm"
            isDisabled={isEmpty}
        >
            <CardHeader className="flex gap-2">
                <div className="flex flex-col w-full">
                    <p className="text-md font-semibold">Password Details</p>
                    <p className="text-sm text-default-500">
                        {isEmpty ? "No password selected" : "Edit password fields"}
                    </p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className="flex flex-col gap-4">
                <Input
                    label="Title"
                    value={displayPassword.title}
                    isDisabled={isEmpty}
                    className="w-full"
                    variant="bordered"
                />
                <Input
                    label="Username"
                    value={displayPassword.username}
                    isDisabled={isEmpty}
                    className="w-full"
                    variant="bordered"
                />
                <Input
                    label="Password"
                    value={displayPassword.password}
                    isDisabled={isEmpty}
                    className="w-full"
                    variant="bordered"
                    type="password"
                />
                <Input
                    label="URL"
                    value={displayPassword.url}
                    isDisabled={isEmpty}
                    className="w-full"
                    variant="bordered"
                />
                <Input
                    label="Note"
                    value={displayPassword.note}
                    isDisabled={isEmpty}
                    className="w-full"
                    variant="bordered"
                />
            </CardBody>
        </Card>
    );
}
