import { ChangeDetectionStrategy } from '@angular/compiler';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab-page',
  templateUrl: './tab-page.component.html',
  styleUrls: ['./tab-page.component.css'],
 // changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabPageComponent {
  @Input()
  title: string ='';

  private _active: boolean = false;
  get active(): boolean{
    return this._active;
  }
  set active(value:boolean){
    if (this._active!==value)
      this._active = value;
  }

constructor(){
  console.log('tabPage Contructed');
}
}
