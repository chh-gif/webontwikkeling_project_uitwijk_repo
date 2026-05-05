export interface Waterfall {

    waterfallId: string;
    name: string;
    country: string;
    description: string;
    heightInM: number;
    yearRoundWaterFlow: boolean;
    dateOfFirstDocumentary: string;
    imageURL: string;
    imageSource: string;
    type: string;
    climate: IntClimate
    }

    export interface IntClimate{
    climateId: string;
      name: string;
      annualAvgTemperatureCelsius: number;
      environment: string;
      freezePossible: boolean
    }