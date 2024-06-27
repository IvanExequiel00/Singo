import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";

import { UserProgress } from "@/components/user-progress";
import {  getUserProgress, getUserSubscription } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";

const quests = [
    {
        title: "Earn 20 xp",
        value: 20,
    },
    {
        title: "Earn 50 xp",
        value: 50,
    },
    {
        title: "Earn 100 xp",
        value: 100,
    },
    {
        title: "Earn 500 xp",
        value: 500,
    },
]


const QuestPage = async () =>{

    const userProgressData = getUserProgress();
    const userSubsciptionData = getUserSubscription();
  
    const [
        userProgress,
        userSubscription,
     
    ] = await Promise.all([
        userProgressData,
        userSubsciptionData,
       
    ]);

    if(!userProgress || !userProgress.activeCourse){
        redirect("/courses")
    }

    const isPro = !!userSubscription?.isActive

return(
    <div className="flex flex-row-reverse gap-[48px] px-6">
        <StickyWrapper>
            <UserProgress 
            activeCourse={userProgress.activeCourse}
            hearts={userProgress.hearts}
            points={userProgress.points}
            hasActiveSubscription={isPro}
            />
        </StickyWrapper>

        <FeedWrapper>
            <div className="w-full flex flex-col items-center">
                <Image 
                src="/quests.svg"
                alt="Quests"
                width={90}
                height={90}
                />
                <h1 className="text-center fon-bold text-neutral-800 text-2xl my-6">
                    Quests
                </h1>
                <p className="text-muted-foreground text-center text-lg mb-6">
                   Complete quests by earning points
                </p>
                <ul className="w-full ">
                    {quests.map((quest) =>{
                        const progress = (userProgress.points / quest.value) * 100;
                        return (

                            <div
                            className="flex items-center w-full p-4 gap-x-4 border-t-2"
                            key={quest.title}>
                                <Image 
                                src="/points.svg"
                                alt="points"
                                width={60}
                                height={60}
                                />
                                <div className="flex flex-col gap-y-2 w-full">
                                    <p className="text-neutral-700 text-xl font-bold ">
                                        {quest.title}

                                    </p>

                                </div>

                            </div>
                        )
                    })}

                </ul>
                {/*  */}

            </div>
        </FeedWrapper>

    </div>
)
}

export default QuestPage;