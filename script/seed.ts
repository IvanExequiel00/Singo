import { neon } from "@neondatabase/serverless"
import "dotenv/config"
import { drizzle } from "drizzle-orm/neon-http"


import * as schema from "../db/schema"


const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql, {schema});

const main = async () =>{
    try {
        console.log("sendiing database")
        await db.delete(schema.courses);
        await db.delete(schema.userProgress);

        console.log("seeding finish")
        
    } catch (error) {
        console.error(error);
        throw new Error("failed to seed db")
    }
}

main()