import { ConditionsAndZip } from "app/conditions-and-zip.type";
import { Forecast } from "app/forecasts-list/forecast.type";

export interface Record {
    conditionsAndZip:ConditionsAndZip,
    foreCast: Forecast,
    timeOut: number
}
export interface ZipCodeStoreData{
    records: Record[],
    timeOut:number
    pool:string[]
}
export const initialData:ZipCodeStoreData=
 {
    records:[],
    timeOut:(2*3600*1000), //default value 2 hours 
    pool:[] 
 };

