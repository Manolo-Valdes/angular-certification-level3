import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { ConditionsAndZip } from "app/conditions-and-zip.type";
import { ForecastRecord } from "./zipcode.reducer";


export const ZipCodeActions = createActionGroup(
    {
        source:'zipCode',
        events:{
            'Init':emptyProps(),
            'InitialLoad':emptyProps(),
            'AddConditionsAndZip':props<ConditionsAndZip>(),
            'RemoveLocationByIndex':props<{index:number}>(),
            'RemoveConditionsAndZip':props<ConditionsAndZip>(),
            'Add':props<{code:string}>(),
            'AddedSuccess':props<{code:string}>(),
            'Remove':props<{code:string}>(),
            'RemovedSuccess':props<{code:string}>(),
            'GetForeCast':props<{code:string, timeOut:number}>(),
            'AddForeCastRecord':props<ForecastRecord>(),
            'UpdateTimeOut':props<{timeOut:number}>(),
        }
    });