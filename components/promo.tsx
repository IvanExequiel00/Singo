"use client"

import Image from "next/image"
import { Button } from "./ui/button"
import Link from "next/link"

export const  Promo = () =>{
    return (
      <div className="border-2  rounded-xl p-4  space-y-4">
        <div className="space-y-2">
          <div className="flex  items-center gap-x-2">
            <Image
              src="/unlimited.svg"
              alt="unlimited"
              width={25}
              height={25}
            />
            <h3>Upgrade to Pro</h3>
          </div>
          <p>Get unlimited hearts and more!</p>
        </div>

        <Button asChild variant="super" className="w-full" size="lg">
          <Link href="/shop">Upgrate today</Link>
        </Button>
      </div>
    );
}