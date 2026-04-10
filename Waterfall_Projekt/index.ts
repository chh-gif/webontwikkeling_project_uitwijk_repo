import express, { Express } from "express";
import path from "path";
import { Waterfall } from "./interface";
import * as readline from "readline-sync";
import {data} from "./functions";
import {ViewAllData} from "./functions";
import {FilterById} from "./functions";
  
const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, "views"));
app.set("port", process.env.PORT || 3000);

let waterfallObject: Waterfall[] = [];


let choice = "";


export async function main() {
  await data(waterfallObject);
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

app.get("/", (req, res) =>{
res.render("index", {waterfallObject})
});

app.get("/overview", (req, res) => {
  
    res.render("overview", {waterfallObject})
});
app.get("/detailpage/:id", (req, res) => {
  const id = req.params.id;
  const element = waterfallObject.find(value => value.waterfallId === id);
    res.render("detailpage", {element})
});

app.post("/overview", (req, res)=>{
const search = typeof req.body.search == "string"? req.body.search: "";
const result = waterfallObject.filter(value=> 
  value.waterfallId.toLowerCase().includes(search.toLowerCase()) ||
value.country.toLowerCase().includes(search.toLowerCase()) ||
value.name.toLowerCase().includes(search.toLowerCase()) ||
value.type.toLowerCase().includes(search.toLowerCase())
);

const sort = req.body.sort;
const direction = req.body.direction;


switch(sort){
  case "name":
     result.sort((a,b)=> direction == "asc"? a.name.localeCompare(b.name):b.name.localeCompare(a.name));
  break;
     case "country":
    result.sort((a,b)=> direction =="asc"? a.country.localeCompare(b.country):b.country.localeCompare(a.country));
    break;
  case "height": 
  result.sort((a,b)=>direction == "asc"? a.heightInM-b.heightInM:b.heightInM-a.heightInM);
  break;
  case "date": 
  result.sort((a,b)=> direction == "asc"? new Date(a.dateOfFirstDocumentary).getTime()- new Date(b.dateOfFirstDocumentary).getTime(): new Date (b.dateOfFirstDocumentary).getTime()- new Date (a.dateOfFirstDocumentary).getTime());
    break;
  case "flow":
    result.sort((a,b)=>direction == "asc"? Number(a.yearRoundWaterFlow)-Number(b.yearRoundWaterFlow):Number(b.yearRoundWaterFlow)-Number(a.yearRoundWaterFlow));
   break;
    case "type":
result.sort((a,b)=> direction == "asc"? a.type.localeCompare(b.type):b.type.localeCompare(a.type));
break;
}
res.render("overview", {waterfallObject: result})

});


(async () => {
  await data(waterfallObject);

  app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get("port"));
  });
})();


