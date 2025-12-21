'use client'

import type { KeyboardEvent, RefObject } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface CitySearchInputProps {
  query: string
  onValueChange: (value: string) => void
  onFocus: () => void
  onKeyDown: (e: KeyboardEvent) => void
  placeholder: string
  open: boolean
  listId: string
  statusId: string
  instructionsId: string
  inputRef: RefObject<HTMLInputElement>
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
    <div className="relative w-full">
      <Search
        aria-hidden="true"
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        ref={inputRef}
        value={query}
        onChange={(e) => onValueChange(e.target.value)}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label="Search for a city"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-autocomplete="list"
        aria-describedby={open ? statusId : instructionsId}
        role="combobox"
        className="w-full pl-9"
      />
    </div>
  )
}
