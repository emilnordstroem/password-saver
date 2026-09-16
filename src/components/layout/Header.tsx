import { useState } from 'react';
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { SearchBar } from '../common/SearchBar';

interface HeaderProps {
  onAddNew: () => void;
  onSearch: (query: string) => void;
  searchQuery?: string;
}

/**
 * Header - Top navigation bar component
 * Displays app title, search bar, and add button
 */
export function Header({ onAddNew, onSearch, searchQuery = '' }: HeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <Navbar
      isBordered
      classNames={{
        base: 'header-navbar',
        wrapper: 'max-w-full',
      }}
    >
      <NavbarBrand>
        <span className="header-title">Password Saver</span>
      </NavbarBrand>

      <NavbarContent className="flex-1" justify="center">
        {isSearchExpanded ? (
          <NavbarItem className="w-full max-w-md">
            <SearchBar
              value={searchQuery}
              onChange={onSearch}
              placeholder="Search passwords..."
              autoFocus
            />
          </NavbarItem>
        ) : null}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            isIconOnly
            aria-label="Search"
            variant="light"
            onPress={() => setIsSearchExpanded(!isSearchExpanded)}
            className="header-search-toggle"
          >
            <FiSearch size={20} />
          </Button>
        </NavbarItem>
        
        <NavbarItem>
          <Button
            startContent={<FiPlus size={18} />}
            onPress={onAddNew}
            color="primary"
            aria-label="Add new password"
          >
            Add Password
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

export default Header;
