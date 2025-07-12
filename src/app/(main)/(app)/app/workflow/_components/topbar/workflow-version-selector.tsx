// File: src/components/WorkflowVersionSelector.tsx
"use client";

import React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { Button } from "shared/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "shared/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "shared/ui/popover";
import { WorkflowVersionSelectorProps } from "src/lib/workflow-version-types";

/**
 * Selector component for choosing a workflow version from a list.
 * @param selectedVersion - The currently selected version number
 * @param onSelect - Callback when a version is selected
 * @param versions - List of available workflow versions
 */
export function WorkflowVersionSelector({
  selectedVersion,
  onSelect,
  versions,
}: WorkflowVersionSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const selected = versions.find((v) => v.version === selectedVersion);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {selected
            ? `Version ${selected.version} (${new Date(selected.createdAt).toLocaleString()})`
            : "Select version..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search version..." />
          <CommandList>
            <CommandEmpty>No version found.</CommandEmpty>
            <CommandGroup>
              {versions.map((v) => (
                <CommandItem
                  key={v.version}
                  value={v.version.toString()}
                  onSelect={() => {
                    onSelect(v.version);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={
                      selectedVersion === v.version
                        ? "mr-2 h-4 w-4 opacity-100"
                        : "mr-2 h-4 w-4 opacity-0"
                    }
                  />
                  Version {v.version} ({new Date(v.createdAt).toLocaleString()})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
