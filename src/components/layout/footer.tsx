'use client'

import { Cloud } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className=" w-full border-t border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between sm:gap-4">
          <p className="text-center text-sm text-muted-foreground sm:text-left">
            Showing the weather wether you want it or not.
          </p>

          <Link href="/" className="flex items-center font-semibold shrink-0">
            <Cloud className="h-4 w-4" />
            <span className="text-sm tracking-tighter">Weatherly.</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
