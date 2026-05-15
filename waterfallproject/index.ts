
import express, { Express } from "express";
import path from "path";
import { connect, fetchfunction } from "./database";
import waterfallRoutes from "./public/routes/waterfallRoutes";
import climateRoutes from "./public/routes/climateRoutes";
import users from "./public/routes/users";
import landing from "./public/routes/landing";
import session from "./session";

const app: Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("port", process.env.PORT || 3000);

app.use(session);
 // Router einbinden
    app.use("/waterfalls", waterfallRoutes);
    app.use("/climates", climateRoutes);
    app.use("/users", users);
    app.use("/", landing);
    


  
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

