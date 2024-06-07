import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {catchError, map, filter,concatMap, mergeMap, tap,withLatestFrom, concatMapTo, flatMap} from 'rxjs/operators';

import { WeatherService } from "app/weather.service";
import { ZipCodeActions } from "./zipcode.actions";
import { LocationService } from "app/location.service";
import {selectZipCodes} from "./zipcode.selectors"
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
        tap(code => console.log('loadoing', code)),
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
        tap(({ code })=> console.log('Adding', code)),
        withLatestFrom(this.store.select(selectZipCodes)),        
        tap(([{ code }, codes]) => console.log('Adding', code , codes)),
        filter(([{ code }, codes]) => codes.indexOf(code)===-1),
        tap(([{ code }, codes]) => console.log('Adding', code , codes)),
        mergeMap(([{ code }, codes]) =>
            this.weatherService.currentConditions$(code).pipe(
                tap(value => console.log('Adding', value)),
                map(value =>{
                    const conditionsAndZip:ConditionsAndZip = { zip: code, data:value };
                    console.log(conditionsAndZip);
                    this.store.dispatch(ZipCodeActions.addConditionsAndZip(conditionsAndZip)) ;
                    this.locationService.addLocation(code);
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
}