/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "src/components/ui/sidebar";
import {
  IconBrandTabler,
  IconSettings,
  IconBuildingStore,
  IconProgressHelp,
  IconJumpRope,
  IconLogout
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "shared/lib/utils";

/**
 * DashboardAppLayout provides the sidebar navigation and layout for dashboard pages.
 * @param children - The main content to render beside the sidebar
 */
export function DashboardAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const links = [
    {
      label: "Dashboard",
      href: "/app",
      newPage: false,
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Studio",
      href: "/app/studio",
      newPage: false,
      icon: (
        <IconJumpRope className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Process Orchestration",
      href: "/app/workflow",
      newPage: false,
      icon: (
        <IconJumpRope className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Marketplace",
      href: "#",
      newPage: false,
      icon: (
        <IconBuildingStore className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Resources",
      href: "#",
      newPage: false,
      icon: (
        <IconProgressHelp className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      newPage: false,
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "flex w-screen flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} className="px-2" newPage={link.newPage} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink className="px-2 ring-1 ring-neutral-200 dark:ring-neutral-700 rounded-md"
              link={{
                label: "Md Irshad",
                href: "#",
                icon: (
                  <img
                    src="https://avatars.githubusercontent.com/u/191547746?v=4"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
            {/* <IconLogout className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200 mt-2 cursor-pointer" /> */}
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
}

/**
 * Logo component for the dashboard sidebar.
 */
export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Acet Labs
      </motion.span>
    </a>
  );
};

/**
 * LogoIcon component for the dashboard sidebar (icon only).
 */
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};
