import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ZipCodeActions } from 'app/store/zipcode.actions';
import { selectTimeOut } from 'app/store/zipcode.selectors';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html'
})
export class MainPageComponent implements OnDestroy {

  constructor(private store:Store){
    this.sub = this.store.select(selectTimeOut).subscribe(
      value => this._timeOut=value
    );
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private sub:Subscription;
  private _timeOut:number
  get timeOut():number
  {
    return this._timeOut;
  }
  set timeOut(value:number)
  {
    this._timeOut=value;
    this.store.dispatch(ZipCodeActions.updateTimeOut({timeOut:value}));
  }
}
