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
    
        export const selectCodeByIndex= (index: number) =>
            createSelector(
                selectZipCodeState,
                state =>{
                    if (state !== undefined && index >= 0 && index < state.records.length)
                        {
                            return state.records.find((x,i) => i === index).conditionsAndZip.zip;
                        }
                    return null;
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

export const selectPool =
    createSelector(
    selectZipCodeState,
    state =>{
        if (state !== undefined)
            {
                return state.pool;
            }
        return [];
    });

export const selectIsOnPool = (zipcode: string) =>
    createSelector(
    selectZipCodeState,
    state =>{
        if (state !== undefined && state.pool.length > 0)
            {
                const item = state.pool.find((x) => x === zipcode);
                if (item)
                    return true;
            }
        return false;
    });
