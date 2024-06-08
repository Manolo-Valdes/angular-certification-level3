import { createAction, createFeatureSelector, createSelector } from "@ngrx/store";
import { ZipCodeStoreData } from "./zipcode.reducer";


export const selectZipCodeState = createFeatureSelector<ZipCodeStoreData>('zipCode');

export const selectConditionsAndZips = createSelector(
    selectZipCodeState,
    (state) =>{
        console.log('selectConditionsAndZips state',state);
        if (state !== undefined)
            return state.conditionsAndZips;
        return [];
    } 
);

export const selectZipCodes = createSelector(selectZipCodeState, 
    state =>{
        console.log('selectZipCodes state',state);
    if (state !== undefined &&
        state.conditionsAndZips.length > 0)
        return state.conditionsAndZips.map((x) => x.zip);
    return [];
} );

export const selectForeCastRecord = (zipcode: string) =>
    createSelector(
    selectZipCodeState,
    state =>{
        if (state !== undefined && state.foreCastRecords.length > 0)
            return state.foreCastRecords.find((x) => x.zip === zipcode);
        return undefined;
    });
