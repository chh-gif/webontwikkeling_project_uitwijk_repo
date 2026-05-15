import { Collection, MongoClient } from "mongodb";
import dotenv from "dotenv";
import {User} from "./types";
import { IntClimate, Waterfall } from "./interface";
import bcrypt from "bcrypt";
dotenv.config();

export const client = new MongoClient(
  process.env.MONGODB_URI || "mongodb://localhost:27017",
);

export const waterfalls: Collection<Waterfall> = client
  .db("waterfallDB")
  .collection<Waterfall>("waterfalls");
export const climate: Collection<IntClimate> = client
  .db("waterfallDB")
  .collection<IntClimate>("climate");

export const userCollection = client.db("waterfallDB").collection<User>("users");

const saltRounds : number = 10;

export async function connect() {
  try {
    await client.connect();
    await getAllWaterfalls();
    await createInitialUser();
    process.on("SIGINT", exit);
  } catch (error) {
    console.error(error);
  }
} // DB verbinden
export async function fetchfunction() {
  //nur fetchen wenn
  const waterfallsArray: Waterfall[] = await getAllWaterfalls();
  const climateArray: IntClimate[] = await getAllClimates();
  if (waterfallsArray.length == 0) {
    const resp1 = await fetch(
      "https://raw.githubusercontent.com/chh-gif/Webontwikkeling-Assets_JSON_Rep/main/json/waterval.json",
    );
    const data = (await resp1.json()) as Waterfall[];

    await waterfalls.insertMany(data); //geen dubbel data
  }

  if (climateArray.length == 0) {
    const resp1 = await fetch(
      "https://raw.githubusercontent.com/chh-gif/Webontwikkeling-Assets_JSON_Rep/main/json/waterval_object.json",
    );
    const data = (await resp1.json()) as IntClimate[];
   
    await climate.insertMany(data);
  }
}
export async function editingOneWaterfalls(id: string, data: Waterfall){
  await waterfalls.updateOne(
        { waterfallId: id },
        {
          $set: {
            description: data.description,
            yearRoundWaterFlow:
              data.yearRoundWaterFlow === true,
            imageURL: data.imageURL,
            imageSource: data.imageSource,
          },
        },
      );
}

export async function exit() {
  try {
    await client.close();
  } catch (error) {
    console.error(error);
  }
  process.exit(0);
}

export async function getAllWaterfalls() {
  return await waterfalls.find({}).toArray();
}
export async function getWaterfallById(id: string) {
  return await waterfalls.findOne({ waterfallId: id});
}

export async function getAllClimates() {
  return await climate.find({}).toArray();
}
export async function getClimatebyId(id: string) {
  return await waterfalls.findOne({"climate.climateId": id});
}

async function createInitialUser() {
    if (await userCollection.countDocuments() > 0) {
        return;
    }
    let email : string | undefined = process.env.ADMIN_EMAIL;
    let password : string | undefined = process.env.ADMIN_PASSWORD;
    if (email === undefined || password === undefined) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
    }
    await userCollection.insertOne({
        email: email,
        password: await bcrypt.hash(password, saltRounds),
        role: "ADMIN"
    });
}

export async function login(email: string, password: string) {
    if (email === "" || password === "") {
        throw new Error("Email and password required");
    }
    let user : User | null = await userCollection.findOne<User>({email: email});
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
            return user;
        } else {
            throw new Error("Password incorrect");
        }
    } else {
        throw new Error("User not found");
    }
}
