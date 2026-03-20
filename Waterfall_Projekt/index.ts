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

main();

app.get("/overview", (req, res) => {
    res.render("overview", {waterfallObject})
});

app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get('port'));
});
