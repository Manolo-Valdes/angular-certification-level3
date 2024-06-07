import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { ConditionsAndZip } from "app/conditions-and-zip.type";


export const ZipCodeActions = createActionGroup(
    {
        source:'zipCode',
        events:{
            'InitialLoad':emptyProps(),
            'AddConditionsAndZip':props<ConditionsAndZip>(),
            'RemoveLocationByIndex':props<{index:number}>(),
            'RemoveConditionsAndZip':props<ConditionsAndZip>(),
            'Add':props<{code:string}>(),
            'AddedSuccess':props<{code:string}>(),
            'Remove':props<{code:string}>(),
            'RemovedSuccess':props<{code:string}>(),
        }
    });