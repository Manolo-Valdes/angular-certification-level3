import {Component, inject, OnInit, Signal} from '@angular/core';
import {WeatherService} from "../weather.service";
import {LocationService} from "../location.service";
import {Router} from "@angular/router";
import {ConditionsAndZip} from '../conditions-and-zip.type';
import { Store } from '@ngrx/store';
import { ZipCodeActions } from 'app/store/zipcode.actions';
import { selectConditionsAndZips } from 'app/store/zipcode.selectors';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent implements OnInit {
  constructor(private store:Store){}
  ngOnInit(): void {
    this.currentConditionsByZip$ = this.store.select(selectConditionsAndZips);
}

  protected weatherService = inject(WeatherService);
  private router = inject(Router);
  protected currentConditionsByZip$: Observable<ConditionsAndZip[]>;


  showForecast(zipcode : string){
    this.router.navigate(['/forecast', zipcode])
  }

  removeLocation(index:number)
  {
    console.log('removing page', index);
   this.store.dispatch(ZipCodeActions.removeLocationByIndex({index})) ;
  }
  removeConditionsAndZip(value:ConditionsAndZip)
  {
    this.store.dispatch(ZipCodeActions.removeConditionsAndZip(value));
  }
}
