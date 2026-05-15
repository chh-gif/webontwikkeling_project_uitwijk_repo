import { Router } from "express";
import { IntClimate, Waterfall } from "../../interface";
const router = Router();

let waterfallObject: Waterfall[] = [];
let climateObject: IntClimate[] = [];
let db: any;



 router.get("/", async (req, res) => {
      res.render("index");
    });

export default router;