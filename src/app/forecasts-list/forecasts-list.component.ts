import { Component } from '@angular/core';
import {WeatherService} from '../weather.service';
import {ActivatedRoute} from '@angular/router';
import {Forecast} from './forecast.type';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ZipCodeActions } from 'app/store/zipcode.actions';
import { selectForeCastRecord } from 'app/store/zipcode.selectors';
import { ForecastRecord } from 'app/store/zipcode.reducer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css']
})
export class ForecastsListComponent {

  zipcode: string;
  protected forecast$: Observable<Forecast>;

  constructor(
    protected weatherService: WeatherService,
    private store:Store,
     route : ActivatedRoute) {
    
      this.zipcode = route.snapshot.params['zipcode'];
      console.log("zip code from route:", this.zipcode);
      this.forecast$ =this.store.select(selectForeCastRecord(this.zipcode)).pipe(map((x) => x?.foreCast));
      this.store.dispatch(ZipCodeActions.getForeCast({code:this.zipcode, timeOut:(2*3600*1000) }));
  }
}
