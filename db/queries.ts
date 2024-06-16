import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { challengeProgress, courses, lessons, units, userProgress } from "./schema";

export const getUserProgress =cache(async() =>{
    const {userId} = await auth();
    if(!userId) {
        return null;
    }
    const data = await db.query.userProgress.findFirst({
        where: eq(userProgress.userId, userId),
        with:{
            activeCourse:true
        }
    });
    return data;
})

export const getUnits  = cache(async () =>{
    const {userId} = await auth();
    const userProgress = await getUserProgress();
    if (!userId || !userProgress?.activeCourseId){
        return [];
    }

    const data = await db.query.units.findMany({
        where: eq(units.courseId, userProgress.activeCourseId),
        with:{
            lessons: {
                
                with:{
                    challenges:{
                        with:{
                            challengeProgress: {
                                where: eq(challengeProgress.userId, userId)
                            },
                        }
                    }
                }
            }
        }
    })

    const normailizedData = data.map((unit) =>{
        const lessonWithCompletedStatus =  unit.lessons.map((lesson) =>{
            const allCompletedChallenges = lesson.challenges.every((challenge) =>{
                return challenge.challengeProgress
                && challenge.challengeProgress.length > 0
                && challenge.challengeProgress.every((progress) => progress.completed)

            })
            return {...lesson, completed: allCompletedChallenges}
        })
         return {...unit, lessons: lessonWithCompletedStatus}
    });
    return normailizedData;
   
})


export const getCourses = cache(async () =>{
    const data = await db.query.courses.findMany();
    return data;
})

export const getCoursesById = cache(async(courseId: number) =>{
    const data = await db.query.courses.findFirst({
        where: eq(courses.id, courseId),
        // TODO : Populate units and lessons
    });
    return data
})
 



export const getCourseProgress = cache(async () =>{

    const {userId} = await auth()

   
    
    
    const userProgress  = await getUserProgress();

 if(!userProgress?.activeCourseId){
        return null
    }
    if (!userId || !userProgress?.activeCourse){
        return null;
    }


    const unitInActiveCourse = await db.query.units.findMany({
        orderBy: (units, { asc }) => [asc(units.order)],
        where: eq(units.courseId, userProgress.activeCourseId), 
        with: {
            lessons:{
                orderBy: (lessons, {asc}) => [asc(lessons.order)],
                with:{
                    unit: true,
                    challenges:{
                        with:{
                            challengeProgress:{
                                where: eq(challengeProgress.userId, userId),
                            }
                        }
                    }
                }
            }
        }
    })

 const firstUncompletedLesson = unitInActiveCourse
.flatMap((unit) => unit.lessons)
.find((lesson) =>{
    return lesson.challenges.some((challenge) =>{
        return !challenge.challengeProgress || challenge.challengeProgress.length === 0;
    })
})

return{
    activeLesson: firstUncompletedLesson,
    activeLessonId: firstUncompletedLesson?.id
}

});

export const getLesson = cache(async(id?:number) =>{
    const {userId} = await auth();

if(!userId){
    return null
}


    const courseProgress = await getCourseProgress();

    const lessonId = id || courseProgress?.activeLessonId;
    if(!lessonId){
        return null
    }

    const data =  await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
        with:{
            challenges:{
                orderBy: (challenges, {asc}) =>[asc(challenges.order)],
                with:{
                    challengeOptions:true,
                    challengeProgress:{
                        where: eq(challengeProgress.userId, userId),
                    }
                }
            }
        }
    })

    if(!data || !data.challenges){
        return null;
    }
})


