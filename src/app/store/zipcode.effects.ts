import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, filter, mergeMap, tap,withLatestFrom, takeUntil, switchMap} from 'rxjs/operators';

import { WeatherService } from "app/weather.service";
import { ZipCodeActions } from "./zipcode.actions";
import { Record } from "./zipcode.models";
import {selectRecord, selectCodeByIndex, selectTimeOut, selectZipCodes} from "./zipcode.selectors"
import { Store } from "@ngrx/store";
import { ConditionsAndZip } from "app/conditions-and-zip.type";
import {interval} from "rxjs";

@Injectable()
export class ZipCodeEffects{
constructor(private actions$:Actions,private store:Store , private weatherService: WeatherService){}

private ON_POOL_KEY:string='OnPoolingCode';

addzipCodeLocation$ = createEffect(
    ()=>this.actions$.pipe(
        ofType(ZipCodeActions.add),
        tap((value)=> console.log('Adding', value.code)),
        withLatestFrom(this.store.select(selectZipCodes)),        
        tap(([value, codes]) => console.log('Adding', value.code , codes)),
        filter(([value, codes]) => codes.indexOf(value.code)===-1),
        tap(([value, codes]) => console.log('Adding', value.code , codes)),
        mergeMap(([value, codes]) =>
            this.weatherService.currentConditions$(value.code).pipe(
                tap(data => console.log('Adding', data)),
                map(data =>{
                    const conditionsAndZip:ConditionsAndZip = { zip: value.code, data:data };
                    console.log(conditionsAndZip);
                   return ZipCodeActions.addConditionsAndZip(conditionsAndZip) ;
                }
                )
            )
        )  
    )
);


getForecast$ = createEffect(
    ()=> this.actions$.pipe(
        ofType(ZipCodeActions.getForeCast),
        tap(value=> console.log('getting forecast from:', value)),
        mergeMap(value => this.store.select(selectRecord(value.code))
        .pipe(
            mergeMap(record => this.store.select(selectTimeOut)
            .pipe(
                map(timeOut=> ({record , timeOut}))
            )),
            filter(({record , timeOut})=>{
                if (!record)
                    return false;
                if (record.foreCast)
                    {
                        return (Date.now() - record.timeOut) > timeOut;
                    }
                return true;
            }),
            map(item => value.code),
        )
        ),
        tap(()=> console.log('retriving from backend server..')),
        map(zip=> ZipCodeActions.refreshRecord({code:zip}))

    )
);

refreshRecord$ = createEffect(
    ()=>this.actions$.pipe(
        ofType(ZipCodeActions.refreshRecord),
        map(item => item.code),
        mergeMap(zip=> 
            this.weatherService.currentConditions$(zip).pipe(
                tap(data => console.log('got responce from backend', data)),
                mergeMap(data =>
                    this.weatherService.getForecast(zip).pipe(
                        tap((foreCast)=> console.log("got responce from backend",foreCast)),
                      map((foreCast) =>{
                        const r: Record ={
                            conditionsAndZip:{data, zip},
                            foreCast,
                            timeOut: Date.now()                            
                        }
                        return r;
                      }))
                  ),
                  map((recor) => ZipCodeActions.updateRecord(recor))))
));

pooling$=createEffect(
    ()=>this.actions$.pipe(
        ofType(ZipCodeActions.startPoolling),
        map(payload=> payload.code),
        switchMap((code)=> this.store.select(selectTimeOut).pipe(
            tap((time)=>console.log(`performing pool on:${code} every ${time}`)),
            switchMap((time)=>
            interval(time).pipe(
                tap((t)=>console.log(`pool ${t} on:${code}`)),
                takeUntil(
                    this.actions$.pipe(
                    ofType(ZipCodeActions.stopPooling),
                    tap((payload)=> console.log(`takeUntil ${payload.code} `)),
                    filter((payload) => code === payload.code),
                    tap((()=> localStorage.setItem(this.ON_POOL_KEY,''))),
                    tap((payload) => console.log(`Stop polling ${payload.code} `))
                    )
                ),
                map(()=> ZipCodeActions.refreshRecord({code}) )  
                )
            )    
    ))
)
);



startPoolByIndex$=createEffect(
    ()=>this.actions$.pipe(
        ofType(ZipCodeActions.startPoolingByIndex),
        map(payload=> payload.index),
        switchMap((index)=> this.store.select(selectCodeByIndex(index)).pipe(
            filter(code=> code!=null),
            tap(code=>console.log('start pooling of record with code:',code)),
            tap((code=> localStorage.setItem(this.ON_POOL_KEY,code))),
            map (code=> ZipCodeActions.startPoolling({code}))
        ))
    )
);

stopPoolByIndex$=createEffect(
    ()=>this.actions$.pipe(
        ofType(ZipCodeActions.stopPoolingByIndex),
        map(payload=> payload.index),
        tap(index=>console.log('stop pooling of record with index:',index)),
        switchMap((index)=> this.store.select(selectCodeByIndex(index)).pipe(
            filter(code=> code!=null),
            tap(code=>console.log('stop pooling of record with code:',code)),
            map (code=> ZipCodeActions.stopPooling({code}))
        ))
    )
);

stopAllPoolByIndex$=createEffect(
    ()=>this.actions$.pipe(
        ofType(ZipCodeActions.stopAllPooling),
        tap(()=>console.log('stop All pooling..')),
        tap(()=>{
            const code = localStorage.getItem(this.ON_POOL_KEY);
            if (code!=="")
                {
                    this.store.dispatch( ZipCodeActions.stopPooling({code}));
                }
        }),
        map(()=>{
            const code = localStorage.getItem(this.ON_POOL_KEY);
            return ZipCodeActions.startPoolling({code});
        })
    )
);
}
