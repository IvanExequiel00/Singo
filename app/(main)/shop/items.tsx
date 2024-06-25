"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTransition } from "react";

type Props ={
    hearts: number;
    points: number;
    hasActiveSubscription: boolean;
}


const POINTS_TO_REFILL = 10;


export const Items = ({
    hearts,
    points,
    hasActiveSubscription
}:Props) =>{
    const [pending, startTransition] = useTransition();


    return(
        <ul className="w-full">
            <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
                <Image 
                src="/heart.svg"
                alt="heart"
                height={60}
                width={60}
                />
                <div className="flex-1">
                    <p className="text-neutral-700 text-base lg:text-xl font-bold"          >
                        Refill hearts
                    </p>

                </div>
                <Button 
                disabled={hearts === 5 || points  < POINTS_TO_REFILL}
                >
                    {hearts === 5 ? "full" : (
                        <div className="flex items-center">
                            <Image 
                            src="/points.svg"
                            alt="Points"
                            width={20}
                            height={20}
                            />
                            <p>
                                {POINTS_TO_REFILL}
                            </p>

                        </div>
                    )}
                </Button>
            </div>

        </ul>
    )
}