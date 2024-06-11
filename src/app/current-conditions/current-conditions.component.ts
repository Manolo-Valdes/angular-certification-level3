import {Component, inject, OnInit} from '@angular/core';
import {WeatherService} from "../weather.service";
import {Router} from "@angular/router";
import {ConditionsAndZip} from '../conditions-and-zip.type';
import { Store } from '@ngrx/store';
import { ZipCodeActions } from 'app/store/zipcode.actions';
import { selectConditionsAndZips } from 'app/store/zipcode.selectors';
import { Observable } from 'rxjs/internal/Observable';
import { pageChangeData } from 'app/tab-view/tab-view.component';
import { LocationService } from 'app/location.service';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent implements OnInit {
  constructor(private store:Store , private locationService:LocationService){}
  ngOnInit(): void {
    this.currentConditionsByZip$ = this.store.select(selectConditionsAndZips);
}

  protected weatherService = inject(WeatherService);
  private router = inject(Router);
  protected currentConditionsByZip$: Observable<ConditionsAndZip[]>;


  showForecast(zipcode : string):void{
    this.router.navigate(['/forecast', zipcode])
  }

  removeLocation(index:number):void
  {
    console.log('removing page', index);
    this.locationService.removeLocation(index);
  }

  locationChanged(value:pageChangeData):void
  {
    console.log(`pooling stop ${value.previus} and start ${value.current}`),
    this.store.dispatch(ZipCodeActions.stopPoolingByIndex({index:value.previus}));
    this.store.dispatch(ZipCodeActions.startPoolingByIndex({index:value.current}));
  }
}
