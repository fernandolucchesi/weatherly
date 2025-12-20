'use client'

import * as React from 'react'
import { Command, CommandInput } from '@/components/ui/command'

interface CitySearchInputProps {
  query: string
  onValueChange: (value: string) => void
  onFocus: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
  placeholder: string
  open: boolean
  listId: string
  statusId: string
  instructionsId: string
  inputRef: React.RefObject<HTMLInputElement>
}

export function CitySearchInput({
  query,
  onValueChange,
  onFocus,
  onKeyDown,
  placeholder,
  open,
  listId,
  statusId,
  instructionsId,
  inputRef,
}: CitySearchInputProps) {
  return (
    <Command shouldFilter={false} className="rounded-lg border shadow-none">
      <CommandInput
        ref={inputRef}
        value={query}
        onValueChange={onValueChange}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label="Search for a city"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-autocomplete="list"
        aria-describedby={open ? statusId : instructionsId}
        className="w-full"
      />
    </Command>
  )
}
