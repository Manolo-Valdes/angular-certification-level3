import { Component, OnInit } from '@angular/core';
import {SwPush, SwUpdate} from '@angular/service-worker';
import {interval} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { Store } from '@ngrx/store';
import { ZipCodeActions } from './store/zipcode.actions';
import { LocationService } from './location.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(private store:Store) {
    }

    ngOnInit(): void {
   this.store.dispatch(ZipCodeActions.init());
  }
}
