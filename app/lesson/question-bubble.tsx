import Image from "next/image";

type Props ={
    question: string;
}

export const QuestionBubble = ({
    question
}:Props) =>{
    return(
        <div className="flex items-center gap-x-4 mb-6">
            <Image 
            src="mascot.svg"
            alt="Mascot"
            width={60}
            height={60}
            className="hidden"
            />
        </div>
    )
}