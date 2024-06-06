import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ZipCodeStoreData } from "./zipcode.reducer";


export const selectZipCodeState = createFeatureSelector<ZipCodeStoreData>('zipCode');

export const selectConditionsAndZips = createSelector(
    selectZipCodeState,
    (state) =>{
        if (state !== undefined)
            return state.conditionsAndZips;
        return [];
    } 
);

export const selectZipCodes = createSelector(selectZipCodeState, (state) =>{
    if (state !== undefined && state.conditionsAndZips.length > 0)
        return state.conditionsAndZips.map((x) => x.zip);
    return [];
} );
