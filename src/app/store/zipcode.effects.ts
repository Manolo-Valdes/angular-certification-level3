import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, filter, mergeMap, tap,withLatestFrom, delay, timeout} from 'rxjs/operators';

import { WeatherService } from "app/weather.service";
import { ZipCodeActions } from "./zipcode.actions";
import {selectForeCastRecord, selectTimeOut, selectZipCodes} from "./zipcode.selectors"
import { Store } from "@ngrx/store";
import { ConditionsAndZip } from "app/conditions-and-zip.type";

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


getForecast$ = createEffect(
    ()=> this.actions$.pipe(
        ofType(ZipCodeActions.getForeCast),
        tap(value=> console.log('getting forecast from:', value)),
        mergeMap(value => this.store.select(selectForeCastRecord(value.code))
        .pipe(
            mergeMap(record => this.store.select(selectTimeOut)
            .pipe(
                map(timeOut=> ({record , timeOut}))
            )),
            filter(({record , timeOut})=>{
                if (record)
                    {
                        return (Date.now() - record.timeOut) > timeOut;
                    }
                return true;
            }),
            map(record => value),
        )
        ),
        tap(()=> console.log('retriving from backend server..')),
        mergeMap(value =>
            this.weatherService.getForecast(value.code).pipe(
                tap(()=> console.log("got responce from backend")),
              map((data) => 
                ({ 
                    foreCast: data,
                    timeOut: Date.now(),
                    zip: value.code                
                })))
          ),
          map((forecast) => ZipCodeActions.addForeCastRecord(forecast))                    
    )
);


}
