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
    handleAddPassword: () => void;
}

export function NavigationBar({
    searchQuery,
    handleSearch,
    handleAddPassword,
}: INavigationBarProps) {
    return (
        <Navbar className="w-full" isBordered>
            <NavbarBrand>
                <p className="font-bold text-inherit">Password Saver</p>
            </NavbarBrand>
            <NavbarContent className="flex-grow">
                <NavbarItem className="w-full">
                    <Input
                        className="w-full"
                        placeholder="Search passwords..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        variant="bordered"
                        size="sm"
                    />
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Button onClick={handleAddPassword}>
                        <Plus className="text-default-400" size={20} />
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
