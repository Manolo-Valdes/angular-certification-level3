import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ZipCodeStoreData } from "./zipcode.models";


export const selectZipCodeState = createFeatureSelector<ZipCodeStoreData>('zipCode');

export const selectConditionsAndZips = createSelector(
    selectZipCodeState,
    (state) =>{
        console.log('selectConditionsAndZips state',state);
        if (state !== undefined && state.records.length > 0)
            return state.records.map(r=> r.conditionsAndZip);
        return [];
    } 
);

export const selectZipCodes = createSelector(selectZipCodeState, 
    state =>{
        console.log('selectZipCodes state',state);
    if (state !== undefined && state.records.length > 0)
        return state.records.map((r) => r.conditionsAndZip.zip);
    return [];
} );

export const selectRecord= (zipcode: string) =>
    createSelector(
        selectZipCodeState,
        state =>{
            if (state !== undefined && state.records.length > 0)
                {
                    return state.records.find((x) => x.conditionsAndZip.zip === zipcode);
                }
            return undefined;
        });
    
        export const selectRecordByIndex= (index: number) =>
            createSelector(
                selectZipCodeState,
                state =>{
                    if (state !== undefined && index < state.records.length)
                        {
                            return state.records.find((x,i) => i === index);
                        }
                    return undefined;
                });
        
                export const selectForeCastRecord = (zipcode: string) =>
    createSelector(
    selectZipCodeState,
    state =>{
        if (state !== undefined && state.records.length > 0)
            {
                const item = state.records.find((x) => x.conditionsAndZip.zip === zipcode);
                if (item)
                    return item.foreCast;
            }
        return undefined;
    });

export const selectTimeOut = createSelector(
    selectZipCodeState,
    state => {
        console.log('selectTimeOut state',state);
        if (state !== undefined)
            return state.timeOut;
        return 0;
});