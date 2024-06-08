import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {catchError, map, filter,concatMap, mergeMap, tap,withLatestFrom, concatMapTo, flatMap, mapTo} from 'rxjs/operators';

import { WeatherService } from "app/weather.service";
import { ZipCodeActions } from "./zipcode.actions";
import { LocationService } from "app/location.service";
import {selectForeCastRecord, selectZipCodes} from "./zipcode.selectors"
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { ConditionsAndZip } from "app/conditions-and-zip.type";

@Injectable()
export class ZipCodeEffects{
constructor(private actions$:Actions,private store:Store, private locationService:LocationService , private weatherService: WeatherService){}

initialLoad$ = createEffect(
    ()=>this.actions$.pipe(
        ofType(ZipCodeActions.initialLoad),
        tap(()=> console.log('initial load from local storage.;')),
        flatMap(()=> this.locationService.getLocations()),
        filter(code=> code!==null),
        tap(code => console.log('loading', code)),
        mergeMap(code =>
            this.weatherService.currentConditions$(code).pipe(
                map(value =>{
                    const conditionsAndZip:ConditionsAndZip = { zip: code, data:value };
                    this.store.dispatch(ZipCodeActions.addConditionsAndZip(conditionsAndZip));
                }
                )
            )
        )  
    ),{ dispatch: false }
);

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
                    this.store.dispatch(ZipCodeActions.addConditionsAndZip(conditionsAndZip)) ;
                    this.locationService.addLocation(value.code);
                }
                )
            )
        )  
    ),{ dispatch: false }
);

removeLocationByzipCode$ = createEffect(
    ()=> this.actions$.pipe(
        ofType(ZipCodeActions.removeConditionsAndZip),
        map(value => this.locationService.removeLocation(value.zip))
    ),{ dispatch: false }
);
removeLocationByIndex$ = createEffect(
    ()=> this.actions$.pipe(
        ofType(ZipCodeActions.removeLocationByIndex),
        map(value => this.locationService.removeLocationByIndex(value.index))
    ),{ dispatch: false }
);

addedZipsuccess$ = createEffect(
    ()=>this.actions$.pipe(
        ofType(ZipCodeActions.addedSuccess),
        tap(({ code }) => this.locationService.addLocation(code))
    )
);

getForecast$ = createEffect(
    ()=> this.actions$.pipe(
        ofType(ZipCodeActions.getForeCast),
        tap(value=> console.log('getting forecast from:', value.code)),
        mergeMap(value => this.store.select(selectForeCastRecord(value.code))
        .pipe(
            filter(record=>{
                if (record)
                    return (Date.now() - record.date.getMilliseconds()) > value.timeOut;
                return true;
            }),
            map(record => value),
        )
        ),
        mergeMap(value =>
            this.weatherService.getForecast(value.code).pipe(
              map((data) => 
                ZipCodeActions.addForeCastRecord({ 
                    foreCast: data,
                    date: new Date(),
                    zip: value.code                
                })),
            )
          )        
    ) 
);
}
