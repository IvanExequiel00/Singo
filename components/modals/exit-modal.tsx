"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

import {Button} from "@/components/ui/button";

import { useExitModal } from "@/store/use-exit-modal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export  const ExitModal = () =>{

    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const {isOpen, close} = useExitModal();

    useEffect(() => setIsClient(true),[]);
    if(!isClient){
        return null;
    }
return(
    <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent className="max-w-md">
            <DialogHeader>
                 <div className="flex items-center w-full justify-center mb-5">
                    <Image src="mascot_sad.svg" alt="mascot" height={80} width={80}/>
                 </div>
                 <DialogTitle className="text-center font-bold text-2xl">
                    Wait, don&apos;t go!
                 </DialogTitle>
                 <DialogDescription>
                    You&apos;re about to leave the lesson. Are you Sure?
                 </DialogDescription>
            </DialogHeader>


        </DialogContent>
    </Dialog>
)
}