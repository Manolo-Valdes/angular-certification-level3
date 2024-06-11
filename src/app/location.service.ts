import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ZipCodeActions } from './store/zipcode.actions';
export const LOCATIONS : string = "locations";

@Injectable()
export class LocationService {

  constructor(private store: Store) {
  }


  addLocation(code : string)
  {
    console.log('Adding...',code);
    this.store.dispatch(ZipCodeActions.add({code}))
  }

  removeLocation(index : number) {
    this.store.dispatch(ZipCodeActions.removeLocationByIndex({index}))
  }
}
