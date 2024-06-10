import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { ConditionsAndZip } from "app/conditions-and-zip.type";
import { Forecast } from "app/forecasts-list/forecast.type";
import { Record } from "./zipcode.models";

export const ZipCodeActions = createActionGroup(
    {
        source:'zipCode',
        events:{
            'AddConditionsAndZip':props<ConditionsAndZip>(),
            'RemoveLocationByIndex':props<{index:number}>(),
            'Add':props<{code:string}>(),
            'GetForeCast':props<{code:string}>(),
            'AddForeCastRecord':props<{code:string,foreCast:Forecast}>(),
            'RefreshRecord':props<{code:string}>(),
            'UpdateRecord':props<Record>(),
            'UpdateTimeOut':props<{timeOut:number}>(),
            'StartPoolling':props<{code:string}>(),
            'StartPoolingByIndex':props<{index:number}>(),
            'StopPooling':props<{code:string}>(),
            'StopAllPooling':emptyProps(),
            'StopPoolingByIndex':props<{index:number}>(),
        }
    });