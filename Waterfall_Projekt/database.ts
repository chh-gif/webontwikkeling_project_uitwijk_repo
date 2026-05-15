import { Collection, MongoClient } from "mongodb";
import dotenv from "dotenv";
import { IntClimate, Waterfall } from "./interface";

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

export async function connect() {
  try {
    await client.connect();
    await getAllWaterfalls();
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
    await waterfalls.deleteMany({});
    await waterfalls.insertMany(data); //geen dubbel data
  }

  if (climateArray.length == 0) {
    const resp1 = await fetch(
      "https://raw.githubusercontent.com/chh-gif/Webontwikkeling-Assets_JSON_Rep/main/json/waterval_object.json",
    );
    const data = (await resp1.json()) as IntClimate[];
    await climate.deleteMany({}); //geen dubbel data
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
  return await waterfalls.findOne({ climateId: id});
}
