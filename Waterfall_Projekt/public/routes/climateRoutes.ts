
import { Router } from "express";
import { getAllClimates, getClimatebyId, getAllWaterfalls } from "../../database";

const router = Router();

   router.get("/climate", async (req, res) => {
      const climateArray = await getAllClimates();
      res.render("climate", { climateObject: climateArray });
    });

      router.get("/climatepage/:id", async (req, res) => {
      const id = req.params.id;
      const waterfall = await getAllWaterfalls();
      const element = await getClimatebyId(id);
      res.render("climatepage", { element, waterfallObject: waterfall });
    });

    export default router;