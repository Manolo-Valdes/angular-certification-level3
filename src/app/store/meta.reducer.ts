import {ActionReducer, INIT, MetaReducer, UPDATE } from "@ngrx/store"
import { ZipCodeStoreData } from "./zipcode.reducer";
import { ZipCodeActions } from "./zipcode.actions";

export const STAGE_KEY = "ngrxState";
  export const PersistStateMetaReducer = (
    reducer: ActionReducer<ZipCodeStoreData>
  ): ActionReducer<ZipCodeStoreData> => {
    return (state, action) => {
      console.log(action.type)
   /*   if (action.type === INIT || action.type === UPDATE) {
        const json = localStorage.getItem(STAGE_KEY);
        if (json) {
          try {
            console.log(state);
            const value:ZipCodeStoreData =JSON.parse(json);
            console.log(value);
            return value;
          } catch {
            localStorage.removeItem(STAGE_KEY);
          }
        }
      }*/
      const nextState = reducer(state, action);
      switch (action.type)
      {
            case ZipCodeActions.addConditionsAndZip.type:
            case ZipCodeActions.removeConditionsAndZip.type:
            case ZipCodeActions.removeLocationByIndex.type:
              case ZipCodeActions.addForeCastRecord.type:
                localStorage.setItem(STAGE_KEY, JSON.stringify(nextState));
                break;
      }
      console.log(nextState);
      return nextState;
    };
  };
  

  export const metaReducers: MetaReducer[] = [
    PersistStateMetaReducer
  ]