import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ZipCodeActions } from 'app/store/zipcode.actions';
import { selectTimeOut } from 'app/store/zipcode.selectors';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  
})
export class MainPageComponent implements OnDestroy {

  constructor(private store:Store){
    this.sub = this.store.select(selectTimeOut).subscribe(
      value => this.timeOut=value
    );
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private sub:Subscription;
  timeOut:number

  updateTimeOut()
  {
    console.log('Setting new time out:',this.timeOut);
    this.store.dispatch(ZipCodeActions.updateTimeOut({timeOut:this.timeOut}));
    // reset pooling, to use the new time Out value
    this.store.dispatch(ZipCodeActions.stopAllPooling());
  }
}
