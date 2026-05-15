import { Router } from "express";
import {
  getAllWaterfalls,
  getWaterfallById,
  waterfalls,
  editingOneWaterfalls
} from "../../database";
import { IntClimate, Waterfall } from "../../interface";

const router = Router();

let waterfallObject: Waterfall[] = [];
let climateObject: IntClimate[] = [];
let db: any;

  router.get("/", async (req, res) => {
      const waterfall = await getAllWaterfalls();
      res.render("index", { waterfallObject: waterfall });
    });

    router.get("/overview", async (req, res) => {
      const waterfall = await getAllWaterfalls();
      res.render("overview", { waterfallObject: waterfall });
    });

     router.get("/detailpage/:id", async (req, res) => {
      const id = req.params.id;
      const allWaterfalls = await getAllWaterfalls();
      const waterfall = await getWaterfallById(id);

      res.render("detailpage", { element: waterfall, waterfallObject: allWaterfalls });
    });

    
    router.post("/overview", async (req, res) => {
      const search = typeof req.body.search == "string" ? req.body.search : "";
      const waterfall = await getAllWaterfalls();
      const result = waterfall.filter(
        (value: Waterfall) =>
          value.waterfallId.toLowerCase().includes(search.toLowerCase()) ||
          value.country.toLowerCase().includes(search.toLowerCase()) ||
          value.name.toLowerCase().includes(search.toLowerCase()) ||
          value.type.toLowerCase().includes(search.toLowerCase()),
      );

      const sort = req.body.sort;
      const direction = req.body.direction;

      switch (sort) {
        case "name":
          result.sort((a: Waterfall, b: Waterfall) =>
            direction == "asc"
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name),
          );
          break;
        case "country":
          result.sort((a: Waterfall, b: Waterfall) =>
            direction == "asc"
              ? a.country.localeCompare(b.country)
              : b.country.localeCompare(a.country),
          );
          break;
        case "height":
          result.sort((a: Waterfall, b: Waterfall) =>
            direction == "asc"
              ? a.heightInM - b.heightInM
              : b.heightInM - a.heightInM,
          );
          break;
        case "date":
          result.sort((a: Waterfall, b: Waterfall) =>
            direction == "asc"
              ? new Date(a.dateOfFirstDocumentary).getTime() -
                new Date(b.dateOfFirstDocumentary).getTime()
              : new Date(b.dateOfFirstDocumentary).getTime() -
                new Date(a.dateOfFirstDocumentary).getTime(),
          );
          break;
        case "flow":
          result.sort((a: Waterfall, b: Waterfall) =>
            direction == "asc"
              ? Number(a.yearRoundWaterFlow) - Number(b.yearRoundWaterFlow)
              : Number(b.yearRoundWaterFlow) - Number(a.yearRoundWaterFlow),
          );
          break;
        case "type":
          result.sort((a: Waterfall, b: Waterfall) =>
            direction == "asc"
              ? a.type.localeCompare(b.type)
              : b.type.localeCompare(a.type),
          );
          break;
      }
      res.render("overview", { waterfallObject: result });
    });


        router.get("/editor/:id", async (req, res) => {
          const id = req.params.id;
          const element = await getWaterfallById(id);
          res.render("editor", { element});
        });
    
    router.post("/editor/:id", async (req, res) => {
      const id = req.params.id;

      await editingOneWaterfalls(id, req.body);

      res.redirect("/detailpage/" + id);
    });

     export default router;


