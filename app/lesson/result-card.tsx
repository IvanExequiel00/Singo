import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
value:number;
variant: "points" | "hearts";
}


export const ResultCard = ({
    value,
    variant
}: Props) =>{
    return(
        <div className={cn(
            "rounded-2xl border-2 w-full",
            variant === "points" && "bg-orange-400 border-orange-400",
            variant === "hearts" && "bg-rose-500 border-rose-500",
        )}>
            <div className={cn(
                "p-1.5 text-white rounded-t-xl font-bold text-center uppercase"
            )}>

            </div>
        </div>
    )

}