"use server"

import { auth, currentUser } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";

import { absoluteUrl } from "@/lib/utils";
import { getUserSubscription } from "@/db/queries";

const returnUrl = absoluteUrl("/shop");
export const createStripeUrl = async () =>{
    const {userId} = await auth();
    const user = await currentUser();

    if(!userId || !user)
        throw new Error("unautorized")

    const userSubscription = await getUserSubscription();
    if(userSubscription && userSubscription.stripeCustomerId){
        const stripeSession = await stripe.billingPortal.sessions.create({
            customer: userSubscription.stripeCustomerId,
            return_url: returnUrl
        })
    }
}