import express, { Express } from "express";
import path from "path";
import { IntClimate, Waterfall } from "./interface";
import * as readline from "readline-sync";
import {data, data2} from "./functions";
import {ViewAllData} from "./functions";
import {FilterById} from "./functions";
import {MongoClient} from "mongodb";
  
const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, "views"));
app.set("port", process.env.PORT || 3000);

let waterfallObject: Waterfall[] = [];
let climateObject: IntClimate[] = [];
let db: any;

let choice = "";


export async function main() {
  await data(waterfallObject);
  await data2(climateObject);
  do {
    console.log("Welcome to the JSON data viewer");
    console.log("1. View all data");
    console.log("2. Filter by ID");
    console.log("3. Exit");
    choice = readline.question("Please enter your choice:");

    switch (choice) {
      case "1":
        ViewAllData(waterfallObject);
        break;
      case "2":
        let IDchoice = readline.question(
          "Please enter the ID you want to filter by:",
        );
        FilterById(IDchoice, waterfallObject);
        break;
      case "3":
        break;
    }
  } while (choice != "3");
}

//main();


(async () => {
  try{
        
  // Daten aus Funktionen holen
  await data(waterfallObject);
  await data2(climateObject);

//MongoDB verbinden
const url = "mongodb+srv://CHH:deweUTuxX4t7UngG@2webontwikkeling.cxz0skq.mongodb.net/";
const client = new MongoClient(url);
await client.connect();
db = client.db("waterfallDB");

 const find = await db.collection("waterfalls").findOne({});
        if (find === null){
//DB leeren

await db.collection("waterfalls").deleteMany({});
await db.collection("climate").deleteMany({});

//DB füllen

await db.collection("waterfalls").insertMany(waterfallObject);
await db.collection("climate").insertMany(climateObject);
        }}
        catch (err) {
    console.error(err);
  }

  app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get("port"));
  });
})();



app.get("/", async (req, res) =>{
  const waterfalls = await db.collection("waterfalls").find().toArray();
res.render("index", {waterfallObject: waterfalls})
});

app.get("/overview", async (req, res) => {
  const waterfalls = await db.collection("waterfalls").find().toArray();
    res.render("overview", {waterfallObject: waterfalls})
});
app.get("/detailpage/:id", async (req, res) => {
  const id = req.params.id;
  const waterfalls = await db.collection("waterfalls").find().toArray();
  const element = waterfalls.find((value: Waterfall) => value.waterfallId === id);
    res.render("detailpage", {element, waterfallObject: waterfalls})
});

app.get("/climatepage/:id", async(req, res) => {
  const id = req.params.id;
 const waterfalls = await db.collection("waterfalls").find().toArray();
  const element = waterfalls.find((value: Waterfall) => value.climate.climateId === id);
    res.render("climatepage", {element, waterfallObject: waterfalls})
});

app.get("/climate", async(req, res) => {
  const climate = await db.collection("climate").find().toArray();
    res.render("climate", {climateObject: climate})
});

app.post("/overview", async(req, res)=>{
const search = typeof req.body.search == "string"? req.body.search: "";
const waterfalls = await db.collection("waterfalls").find().toArray();
const result = waterfalls.filter((value: Waterfall)=> 
  value.waterfallId.toLowerCase().includes(search.toLowerCase()) ||
value.country.toLowerCase().includes(search.toLowerCase()) ||
value.name.toLowerCase().includes(search.toLowerCase()) ||
value.type.toLowerCase().includes(search.toLowerCase())
);

const sort = req.body.sort;
const direction = req.body.direction;


switch(sort){
  case "name":
     result.sort((a: Waterfall,b: Waterfall)=> direction == "asc"? a.name.localeCompare(b.name):b.name.localeCompare(a.name));
  break;
     case "country":
    result.sort((a: Waterfall,b: Waterfall)=> direction =="asc"? a.country.localeCompare(b.country):b.country.localeCompare(a.country));
    break;
  case "height": 
  result.sort((a: Waterfall,b: Waterfall)=>direction == "asc"? a.heightInM-b.heightInM:b.heightInM-a.heightInM);
  break;
  case "date": 
  result.sort((a: Waterfall,b: Waterfall)=> direction == "asc"? new Date(a.dateOfFirstDocumentary).getTime()- new Date(b.dateOfFirstDocumentary).getTime(): new Date (b.dateOfFirstDocumentary).getTime()- new Date (a.dateOfFirstDocumentary).getTime());
    break;
  case "flow":
    result.sort((a: Waterfall,b: Waterfall)=>direction == "asc"? Number(a.yearRoundWaterFlow)-Number(b.yearRoundWaterFlow):Number(b.yearRoundWaterFlow)-Number(a.yearRoundWaterFlow));
   break;
    case "type":
result.sort((a: Waterfall,b: Waterfall)=> direction == "asc"? a.type.localeCompare(b.type):b.type.localeCompare(a.type));
break;
}
res.render("overview", {waterfallObject: result})
});

app.get("/editor/:id", async(req,res) => {
const id = req.params.id;
const waterfalls = await db.collection("waterfalls").find().toArray();
const element = waterfalls.find((value: Waterfall) => value.waterfallId === id);
res.render("editor", {element, waterfallObject: waterfalls});
}
);

app.post("/editor/:id", async (req, res) => {
  const id = req.params.id;

  await db.collection("waterfalls").updateOne(
    { waterfallId: id },
    {
      $set: {
        description: req.body.description,
        yearRoundWaterFlow: req.body.yearRoundWaterFlow === "true"? true : false,
        imageURL: req.body.imageURL,
        imageSource: req.body.imageSource
      }
    }
  );

  res.redirect("/detailpage/" + id);
});
