import { createReducer, on } from "@ngrx/store";
import { ZipCodeActions } from "./zipcode.actions";
import { initialData } from "./zipcode.models";
import { Record} from "./zipcode.models"


export const zipCodeReducer = createReducer(
    initialData,
    on(ZipCodeActions.addConditionsAndZip,
    (store, payload)=>{
        console.log('addConditionsAndZip',payload);
        const item:Record = {
            conditionsAndZip:payload,
            foreCast:null,
            timeOut: Date.now()
        }
        const record = store.records.find(r=> r.conditionsAndZip.zip ===payload.zip);
        if (record)
            {
                console.log('record found', payload.zip);
                const index = store.records.indexOf(record);

                const records = [...store.records]
                records[index]=item;
                return {...store, records}
            }
        const records = [...store.records.filter(
            (r)=> r.conditionsAndZip.zip !== payload.zip
        ), item];
        return {...store, records} 
    }
    ),on(ZipCodeActions.removeLocationByIndex,
    (store, payload)=>{
        console.log('removing location',payload);
        if (payload.index>=0 && payload.index < store.records.length)
            {
          //      const record = store.records.find((x,i) => i === payload.index);
            //    const pool = [...store.pool.filter(code=> code !== record.conditionsAndZip.zip
              //  )];
                const records = [...store.records.filter(
                    (r,i)=> i !== payload.index
                )];
                     //   return {...store, records,pool}
                        return {...store, records}
            }
        return store
    }
    ),on(ZipCodeActions.addForeCastRecord,
    (store, payload)=>{
        console.log('adding ForeCast',payload);
        let item = store.records.find(
            (r)=> r.conditionsAndZip.zip === payload.code
        );
        if (item)
            {
                item = {...item,foreCast:payload.foreCast,timeOut: Date.now()}
            }
        const records = [...store.records.filter(
            (r)=> r.conditionsAndZip.zip !== payload.code
        ), item];
        return {...store, records} 
    }
    ),on(ZipCodeActions.updateRecord,
        (store, payload)=>{
            console.log('updating record',payload);
            const record = store.records.find(r=> r.conditionsAndZip.zip ===payload.conditionsAndZip.zip);
            if (record)
                {
                    console.log('record found', payload.conditionsAndZip.zip);
                    const index = store.records.indexOf(record);
    
                    const records = [...store.records]
                    records[index]=payload;
                    return {...store, records}
                }
                const records = [...store.records.filter(
                (r)=> r.conditionsAndZip.zip !== payload.conditionsAndZip.zip
            ), payload];
            return {...store, records} 
                }
        )
    ,on(ZipCodeActions.updateTimeOut,
    (store, payload)=>{
        return {...store,timeOut:payload.timeOut}
    }
    )
/*    ,on(ZipCodeActions.stopPoolingByIndex,
        (store, payload)=>{
            console.log('stopPoolingByIndex',payload.index);
            if (payload.index>=0 && payload.index < store.records.length)
                {
                    const record = store.records.find((x,i) => i === payload.index);
                    const pool = [...store.pool.filter(code=> code !== record.conditionsAndZip.zip
                    )];
                    console.log('stopPoolingByIndex',pool);
                    return {...store,pool}
                }
            return store
        }
        )
        ,on(ZipCodeActions.startPoolling,
            (store, payload)=>{
                console.log(`Adding ${payload.code} to pool`);
                const pool = [...store.pool.filter(code=> code !== payload.code
                ), payload.code];
                return {...store,pool}
            }
            )
   */ 
    );