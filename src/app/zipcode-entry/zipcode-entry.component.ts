import { Component } from '@angular/core';
import {LocationService} from "../location.service";
import { Store } from '@ngrx/store';
import { ZipCodeActions } from 'app/store/zipcode.actions';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {

  constructor(private store:Store) { }

  addLocation(zipcode : string){
   console.log('Adding...',zipcode);
    this.store.dispatch(ZipCodeActions.add({code:zipcode}));
  }

}
