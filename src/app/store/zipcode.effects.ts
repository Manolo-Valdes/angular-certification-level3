import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, filter, mergeMap, tap,withLatestFrom, takeUntil, flatMap} from 'rxjs/operators';

import { WeatherService } from "app/weather.service";
import { ZipCodeActions } from "./zipcode.actions";
import { Record } from "./zipcode.models";
import {selectRecord, selectRecordByIndex, selectTimeOut, selectZipCodes} from "./zipcode.selectors"
import { Store } from "@ngrx/store";
import { ConditionsAndZip } from "app/conditions-and-zip.type";
import {interval} from "rxjs";

@Injectable()
export class ZipCodeEffects{
constructor(private actions$:Actions,private store:Store , private weatherService: WeatherService){}

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

/*triggerPooling$ = createEffect(
    ()=> this.actions$.pipe(
        ofType(ZipCodeActions.addConditionsAndZip, ZipCodeActions.removeLocationByIndex),
            mergeMap(() => this.store.select(selectTimeOut)
            .pipe(
                tap((time)=> console.log('start pooling every',time)),
                map(time=> ZipCodeActions.startPoolling({time}))
            )),
    )
);

triggerPoolingByTimeChanged$ = createEffect(
    ()=> this.actions$.pipe(
        ofType(ZipCodeActions.updateTimeOut),
        map(payload=> payload.timeOut),
        tap(time=> {
            console.log('Reset pooling interval to:',time)
        }),
        map(time=> ZipCodeActions.startPoolling({time}))
    )
);*/

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
        mergeMap((code)=> this.store.select(selectTimeOut).pipe(
            tap((time)=>console.log(`performing pool on:${code} every ${time}`)),
            mergeMap((time)=>
            interval(time).pipe(
                    takeUntil(this.actions$.pipe(
                        ofType(ZipCodeActions.stopPooling),
                        filter(payload => code === payload.code),
                        tap(payload => console.log(`Stop polling ${payload.code} `))
                    )),
                    tap(()=> this.store.dispatch(ZipCodeActions.refreshRecord({code})) )
                )
                )
        ))
    ),
    { dispatch: false }
);

startPoolByIndex$=createEffect(
    ()=>this.actions$.pipe(
        ofType(ZipCodeActions.startPoolingByIndex),
        map(payload=> payload.index),
        mergeMap((index)=> this.store.select(selectRecordByIndex(index)).pipe(
            filter(record=> {
               if(record && record.conditionsAndZip)
                return true;
               return false;
            }),
            tap(record=>console.log('start pooling of record with code:',record.conditionsAndZip.zip)),
            map (record=> ZipCodeActions.startPoolling({code: record.conditionsAndZip.zip}))
        ))
    )
);

stopPoolByIndex$=createEffect(
    ()=>this.actions$.pipe(
        ofType(ZipCodeActions.stopPoolingByIndex),
        map(payload=> payload.index),
        mergeMap((index)=> this.store.select(selectRecordByIndex(index)).pipe(
            filter(record=> {
                if(record && record.conditionsAndZip)
                 return true;
                return false;
             }),
             tap(record=>console.log('stoping pooling of record with code:',record.conditionsAndZip.zip)),
             map (record=> ZipCodeActions.stopPooling({code: record.conditionsAndZip.zip}))
        ))
    )
);
}
