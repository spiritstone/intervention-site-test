// components/Navbar.tsx
"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import Link from "next/link";
export default function AppNavbar() {
  return (
    <Navbar
      position="static"
      isBordered
      className="p-4 bg-white text-black font-bold text-xl"
    >
      <NavbarBrand className="text-black font-medium pr-8">MENU</NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link href="/admin">Admin</Link>
        </NavbarItem>
        <div className="h-6 border-l border-gray-300" />
        <NavbarItem>
          <Link href="/admin/logs">Logs</Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
