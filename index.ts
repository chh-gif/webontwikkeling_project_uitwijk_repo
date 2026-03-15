import { Waterfall } from "./interface";
import * as readline from "readline-sync";

let waterfallObject: Waterfall[] = [];
async function data() {
  try {
    const resp1 = await fetch(
      "https://raw.githubusercontent.com/chh-gif/Webontwikkeling-Assets_JSON_Rep/main/json/waterval.json",
    );

    waterfallObject = (await resp1.json()) as Waterfall[];
  } catch (error: any) {
    console.log(error);
  }
}


let choice = "";
let IDExist = false;

async function main() {
  await data();
  do {
    console.log("Welcome to the JSON data viewer");
    console.log("1. View all data");
    console.log("2. Filter by ID");
    console.log("3. Exit");
    choice = readline.question("Please enter your choice:");

    switch (choice) {
      case "1":
        ViewAllData();
        break;
      case "2":
        let IDchoice = readline.question(
          "Please enter the ID you want to filter by:",
        );
        FilterById(IDchoice);
        break;
      case "3":
        break;
    }
  } while (choice != "3");
}

function ViewAllData() {
  waterfallObject.forEach((element) => {
    console.log(`- ${element.name} (${element.waterfallId})`);
  });
}

function FilterById(id: string) {
  waterfallObject.forEach((element) => {
    if (element.waterfallId === id) {
      console.log(` Name (ID): ${element.name} (${element.waterfallId})`);
      console.log(` Country: ${element.country}`);
      console.log(` Description:  ${element.description}`);
      console.log(` Height (in m): ${element.heightInM}`);
      console.log(` Year-round waterflow: ${element.yearRoundWaterFlow}`);
      console.log(
        ` Date of first documentary: ${element.dateOfFirstDocumentary}`,
      );
      console.log(` Image-URL: ${element.imageURL}`);
      console.log(` Image-source: ${element.imageSource}`);
      console.log(` Type of waterfall: ${element.type}`);
      console.log(` Climate-ID: ${element.climate.climateId}`);
      console.log(` Name: ${element.climate.name}`);
      console.log(
        ` Annual average temperature (in °C): ${element.climate.annualAvgTemperatureCelsius}`,
      );
      console.log(` Environment ${element.climate.environment}`);
      console.log(
        ` Is freeze possible?:  ${element.climate.freezePossible ? "yes" : "no"}`,
      );

      IDExist = true;
    }
  });

  if (IDExist == false) {
    console.log("De ID bestaat niet.");
  }
  IDExist = false;
}

main();
