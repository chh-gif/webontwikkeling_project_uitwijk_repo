import { IntClimate, Waterfall } from "./interface";


export async function data(waterfallObject: Waterfall[]) {
  try {
    const resp1 = await fetch(
      "https://raw.githubusercontent.com/chh-gif/Webontwikkeling-Assets_JSON_Rep/main/json/waterval.json",
    );

    const data = (await resp1.json()) as Waterfall[];

    waterfallObject.length = 0;
    waterfallObject.push(...data); 
  } catch (error: any) {
    console.log(error);
  }
}



export async function data2(climateObject: IntClimate[]) {
  try {
    const resp1 = await fetch(
      "https://raw.githubusercontent.com/chh-gif/Webontwikkeling-Assets_JSON_Rep/main/json/waterval_object.json",
    );

    const data = (await resp1.json()) as IntClimate[];

    climateObject.length = 0;
    climateObject.push(...data); 
  } catch (error: any) {
    console.log(error);
  }
}

export function ViewAllData(waterfallObject: Waterfall[]) {
  waterfallObject.forEach((element) => {
    console.log(`- ${element.name} (${element.waterfallId})`);
  });
}

export function FilterById(id: string, waterfallObject: Waterfall[]) {
  let IDExist = false;
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
