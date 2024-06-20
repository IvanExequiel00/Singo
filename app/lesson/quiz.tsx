"use client"

import { challengeOptions, challenges } from "@/db/schema";
import {  useState, useTransition } from "react";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { Challenges } from "./challenge";
import { Footer } from "./footer";
import { uperstChallengeProgress } from "@/actions/challenge-progress";
import { toast } from "sonner";
import { reduceHearts } from "@/actions/user-progress";
import { useAudio } from "react-use";
import Image from "next/image";

type Props = {
    initialPercentage: number;
    initialHearts: number;
    initialLessonId: number;

    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeOptions: typeof challengeOptions.$inferSelect[];
    })[];

    userSubscription: any;
};


export const Quiz = ({
    initialPercentage,
    initialHearts,
    initialLessonId,
    initialLessonChallenges,
    userSubscription
}:Props) =>{
const [
    correctAudio,
    _c,
    correctControls,
] = useAudio({src: "correct.wav"});

const [
    incorrectAudio,
    _i,
    incorrectControls,
] = useAudio({src: "incorrect.wav"});


const [pending, starTransition] = useTransition();


    const [hearts, setHearts] = useState(initialHearts);
    const [percentage, setPercentage] = useState(initialPercentage);
    const [challenges] = useState(initialLessonChallenges);

    const [activeIndex, setActiveIndex] = useState(() =>{
        const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed);
        return uncompletedIndex === -1 ? 0 : uncompletedIndex
    });

    const [selectedOption, setSelectedOption] = useState<number>();
    const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

    const challenge = challenges[activeIndex];
    const options = challenge?.challengeOptions ?? [];

    const onNext = () => {
        setActiveIndex((current) => current + 1);
    }

    const onSelect = (id:number) => {
        if(status !== "none") return;

        setSelectedOption(id);
    }

    const onContinue = () =>{
        if(!selectedOption) return;

        if(status === "wrong" ){
            setStatus("none");
            setSelectedOption(undefined)
            return;
        }
        if(status === "correct" ){
            onNext();
            setStatus("none");
            setSelectedOption(undefined)
            return;
        }

        const correctOptions = options.find((option) => option.correct);

        if(!correctOptions){
            return;
        }

        if(correctOptions.id === selectedOption) {
            starTransition(() =>{
                uperstChallengeProgress(challenge.id)
                .then((response) =>{
                    if(response?.error === "hearts"){
                        console.log("mising hearts")
                        return;
                    }  
                    correctControls.play();
                    setStatus("correct");
                    setPercentage((prev) => prev + 100 / challenges.length);
                    if(initialPercentage === 100){
                        setHearts((prev) => Math.min(prev + 1, 5))
                    }
                })
                .catch(() => toast.error("ssomething went wrong. please try again"))
            })
            
        }else{
        starTransition(() =>{
            reduceHearts(challenge.id)
            .then((responseW) =>{
                if(responseW?.error  === "hearts"){
                    console.error("misiong hearts reduce hearts");
                    return;
                }
                incorrectControls.play();
                setStatus("wrong");
               
                

                if(!responseW?.error){
                    setHearts((prev) => Math.max(prev - 1, 0))
                } 
            })

            .catch(() =>toast.error("somethin went ro"))
        })
        }

    }

    if(!challenge){
        return(
        <>
           <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
            <Image 
            src="finish.svg"
            alt="finish"
            className="hidden lg:block"
            height={100}
            width={100}
            />
            <Image 
            src="finish.svg"
            alt="finish"
            className="block lg:hidden"
            height={50}
            width={50}
            />
            <h1 className="text-lg lg:text-3xl font-bold text-neutral-700"> 
                Great job! <br />  You&apos;ve completed the lesson
            </h1>
            <div className="flex items-center gap-x-4 w-full">
                

            </div>
           </div>
        </>
        )
    }

    const title = challenge.type === "ASSIST" 
    ? "Select the correct meaning" 
    : challenge.question;


    return(
        <>
        {incorrectAudio}
        {correctAudio}
        <Header 
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
        />
        <div className="flex-1">
            <div className="h-full flex items-center justify-center">
                <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
                    <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
                        {title}
                    </h1>
                    <div>
                        {challenge.type === "ASSIST" && (
                            <QuestionBubble  question={challenge.question}/>
                        )}
                        <Challenges 
                        options={options}
                        onSelect={onSelect}
                        status={status}
                        selectOption={selectedOption}
                        disable={pending}
                        type={challenge.type} 
                        />
                    </div>

                </div>

            </div>

        </div>
        {console.log(status)}
        <Footer 
        disabled={pending || !selectedOption}
        status={status}
        onCheck={onContinue}
        />

        </>
    )
}