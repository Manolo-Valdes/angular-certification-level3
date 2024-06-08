import { createReducer, on } from "@ngrx/store";
import { ZipCodeActions } from "./zipcode.actions";
import { ConditionsAndZip } from '../conditions-and-zip.type';
import { Forecast } from "app/forecasts-list/forecast.type";

export interface ForecastRecord {
    foreCast: Forecast;
    date: Date;
    zip: string;
  }
export interface ZipCodeStoreData{
    conditionsAndZips: ConditionsAndZip[],
    foreCastRecords: ForecastRecord[],
    timeOut:number
}
 const initialData:ZipCodeStoreData=
 {
    conditionsAndZips:[],
    foreCastRecords:[],
    timeOut:(2*3600*1000) //default value 2 hours  
 };

 const KEY="ngrxStore";

export const zipCodeReducer = createReducer(
    initialData,
    on(ZipCodeActions.addConditionsAndZip,
    (store, payload)=>{
        const value = [...store.conditionsAndZips, payload];
        return {...store, conditionsAndZips:value} 
    }
    ),on(ZipCodeActions.removeConditionsAndZip,
    (store, payload)=>{
        console.log('removing',payload);
        const value = [...store.conditionsAndZips.filter(v=>
            v.zip !==payload.zip
        )];
        return {...store, conditionsAndZips:value} 
    }
    ),on(ZipCodeActions.removeLocationByIndex,
    (store, payload)=>{
        console.log('removing',payload);
        const value = [...store.conditionsAndZips.filter((v, i) =>
            i !== payload.index
        )];
        return {...store, conditionsAndZips:value} 
    }
    ),on(ZipCodeActions.addForeCastRecord,
    (store, payload)=>{
        console.log('adding',payload);
        const foreCastRecords=[...store.foreCastRecords.filter(v=>
            v.zip !==payload.zip
        ), payload]
        return {...store,foreCastRecords}
    }
    ),on(ZipCodeActions.updateTimeOut,
    (store, payload)=>{
        return {...store,timeOut:payload.timeOut}
    }
    )
);