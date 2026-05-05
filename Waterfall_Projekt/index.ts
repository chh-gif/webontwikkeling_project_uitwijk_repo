import express, { Express } from "express";
import path from "path";
import { IntClimate, Waterfall } from "./interface";
import * as readline from "readline-sync";
import { ViewAllData } from "./functions";
import { FilterById } from "./functions";
import {
  connect,
  openDB,
  fetchfunction,
  getAllWaterfalls,
  getWaterfallById,
  getAllClimates,
  getClimatebyId
} from "./database";
import { waterfalls, climate } from "./database";
import waterfallRoutes from "./routes/waterfallRoutes";
import climateRoutes from "./routes/climateRoutes";

const app: Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("port", process.env.PORT || 3000);

let waterfallObject: Waterfall[] = [];
let climateObject: IntClimate[] = [];
let db: any;




(async () => {
  try {
    //MongoDB verbinden
    connect();
    // Daten aus Funktionen holen

    await fetchfunction();

     // Router einbinden
    app.use("/", waterfallRoutes);
    app.use("/", climateRoutes);
    
   } catch (err) {
    console.error(err);
  }

   app.listen(app.get("port"), async () => {
    console.log("Server started on http://localhost:" + app.get("port"));
  });
})();
