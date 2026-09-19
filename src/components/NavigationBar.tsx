import {
    Input,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Button,
} from "@nextui-org/react";
import { Plus } from "lucide-react";

export interface INavigationBarProps {
    searchQuery: string;
    handleSearch: (value: string) => void;
    handleAddCredential: () => void;
}

export function NavigationBar({
    searchQuery,
    handleSearch,
    handleAddCredential,
}: INavigationBarProps) {
    return (
        <Navbar
            className="w-full"
            isBordered
            classNames={{ wrapper: "px-2 py-0.5", base: "min-h-0" }}
        >
            <NavbarBrand className="min-w-0">
                <p className="font-bold text-inherit text-sm">Password Saver</p>
            </NavbarBrand>
            <NavbarContent className="flex-grow">
                <NavbarItem className="w-full">
                    <Input
                        className="w-full"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        variant="bordered"
                        size="sm"
                        classNames={{ input: "text-sm" }}
                    />
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end" className="min-w-0">
                <NavbarItem className="min-w-0">
                    <Button
                        onClick={handleAddCredential}
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="min-w-0 h-8 w-8"
                    >
                        <Plus className="text-default-400" size={16} />
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
