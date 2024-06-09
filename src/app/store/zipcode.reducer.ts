import { createReducer, on } from "@ngrx/store";
import { ZipCodeActions } from "./zipcode.actions";
import { initialData } from "./zipcode.models";
import { Record} from "./zipcode.models"


export const zipCodeReducer = createReducer(
    initialData,
    on(ZipCodeActions.addConditionsAndZip,
    (store, payload)=>{
        console.log('addConditionsAndZip',payload);
        const item:Record = {
            conditionsAndZip:payload,
            foreCast:null,
            timeOut: Date.now(),
        }
        const records = [...store.records.filter(
            (r)=> r.conditionsAndZip.zip !== payload.zip
        ), item];
        return {...store, records} 
    }
    ),on(ZipCodeActions.removeLocationByIndex,
    (store, payload)=>{
        console.log('removing location',payload);
        const records = [...store.records.filter(
            (r,i)=> i !== payload.index
        )];
        return {...store, records} 
     }
    ),on(ZipCodeActions.addForeCastRecord,
    (store, payload)=>{
        console.log('adding ForeCast',payload);
        let item = store.records.find(
            (r)=> r.conditionsAndZip.zip === payload.code
        );
        if (item)
            {
                item = {...item,foreCast:payload.foreCast,timeOut: Date.now()}
            }
        const records = [...store.records.filter(
            (r)=> r.conditionsAndZip.zip !== payload.code
        ), item];
        return {...store, records} 
    }
    ),on(ZipCodeActions.updateRecord,
        (store, payload)=>{
            console.log('updating record',payload);
            const records = [...store.records.filter(
                (r)=> r.conditionsAndZip.zip !== payload.conditionsAndZip.zip
            ), payload];
            return {...store, records} 
                }
        )
    ,on(ZipCodeActions.updateTimeOut,
    (store, payload)=>{
        return {...store,timeOut:payload.timeOut}
    }
    )
);