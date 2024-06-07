import { createReducer, on } from "@ngrx/store";
import { ZipCodeActions } from "./zipcode.actions";
import { ConditionsAndZip } from '../conditions-and-zip.type';

export interface ZipCodeStoreData{
    conditionsAndZips: ConditionsAndZip[],
}
 const initialData:ZipCodeStoreData=
 {
    conditionsAndZips:[],
 };
 
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
)
);