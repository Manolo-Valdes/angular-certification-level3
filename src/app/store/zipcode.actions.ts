import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { ConditionsAndZip } from "app/conditions-and-zip.type";
import { ForecastRecord } from "./zipcode.reducer";


export const ZipCodeActions = createActionGroup(
    {
        source:'zipCode',
        events:{
            'AddConditionsAndZip':props<ConditionsAndZip>(),
            'RemoveLocationByIndex':props<{index:number}>(),
            'RemoveConditionsAndZip':props<ConditionsAndZip>(),
            'Add':props<{code:string}>(),
            'AddedSuccess':props<{code:string}>(),
            'Remove':props<{code:string}>(),
            'RemovedSuccess':props<{code:string}>(),
            'GetForeCast':props<{code:string}>(),
            'AddForeCastRecord':props<ForecastRecord>(),
            'RemoveForeCastRecord':props<{index:number}>(),
            'UpdateTimeOut':props<{timeOut:number}>(),
        }
    });