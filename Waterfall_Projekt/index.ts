import express, { Express } from "express";
import path from "path";
import { connect, fetchfunction } from "./database";
import waterfallRoutes from "./public/routes/waterfallRoutes";
import climateRoutes from "./public/routes/climateRoutes";

const app: Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("port", process.env.PORT || 3000);

 // Router einbinden
    app.use("/", waterfallRoutes);
    app.use("/", climateRoutes);



  
   app.listen(app.get("port"), async () => {

try {
    //MongoDB verbinden
    await connect();
    // Daten aus Funktionen holen

    await fetchfunction();

    
    
   } catch (err) {
    console.error(err);
  }

    console.log("Server started on http://localhost:" + app.get("port"));
  });

