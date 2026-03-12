
import { Waterfall } from "./interface";
import * as readline from 'readline-sync';

let waterfallObject: Waterfall[]= [];
async function Data() {
    try {
        const resp1 = await fetch('https://raw.githubusercontent.com/chh-gif/Webontwikkeling-Assets_JSON_Rep/main/json/waterval.json');
        //const resp2 = await fetch('git@github.com:AP-G-1PRO-Webontwikkeling/project-webontwikkeling-2025-chh-gif.git/waterfall_object.json');
       // return await resp1.json();
         waterfallObject = await resp1.json() as Waterfall[];
    } catch (error: any) {
        console.log(error);
    }
};
//const data: Waterfall = Data();
//console.log(data.climate);


let choice = "";
let IDExist = false;


async function main(){
await Data();
do{
console.log("Welcome to the JSON data viewer");
console.log("1. View all data");
console.log("2. Filter by ID");
console.log("3. Exit");
choice = readline.question("Please enter your choice:");





switch(choice){
    case "1": ViewAllData();
    break;
    case "2": 
    let IDchoice = readline.question("Please enter the ID you want to filter by:");
     FilterById(IDchoice);
    break;
    case "3": break;
}
} while(choice != "3")

}

function ViewAllData(){
    waterfallObject.forEach(element => {
        console.log(`- ${element.name} (${element.waterfallId})`);
    });
}

function FilterById(id: string){
        waterfallObject.forEach(element => {
            if(element.waterfallId == id){
        console.log(`- ${element.name} (${element.waterfallId})`);
console.log(`  -${element.country}`);
console.log(`  -${element.description}`);
console.log(`  -${element.heightInM}`);
console.log(`  -${element.yearRoundWaterFlow}`);
console.log(`  -${element.dateOfFirstDocumentary}`);
console.log(`  -${element.imageURL}`);
console.log(`  -${element.imageSource}`);
console.log(`  -${element.type}`);
console.log(`  -${element.climate.climateId}`);
console.log(`  -${element.climate.name}`);
console.log(`  -${element.climate.annualAvgTemperatureCelsius}`);
console.log(`  -${element.climate.environment}`);
console.log(`  -${element.climate.freezePossible}`);

IDExist = true;
       }})

       if (IDExist == false){
        console.log("De ID bestaat niet.");
       }
   IDExist = false;
    }

    main();