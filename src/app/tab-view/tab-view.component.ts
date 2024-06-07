import { AfterContentChecked, AfterContentInit, ChangeDetectorRef, Component, ContentChildren, EventEmitter, OnChanges, OnDestroy, Output, QueryList, SimpleChanges } from '@angular/core';
import { TabPageComponent } from 'app/tab-page/tab-page.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab-view',
  templateUrl: './tab-view.component.html',
  styleUrls: ['./tab-view.component.css']
})
export class TabViewComponent implements AfterContentInit, OnDestroy  {
  @Output() pageRemoved: EventEmitter<number> = new EventEmitter();
  @ContentChildren(TabPageComponent) pages: QueryList<TabPageComponent>;


  protected visible:boolean=false
  private sub:Subscription;
  removePage(index:number):void
  {
    console.log('emiting remove page even', index);
    this.pageRemoved.emit(index);
  }
  protected selectPage(index:number): void {
    const snapshoot:TabPageComponent[] = this.pages.toArray();
    console.log('selecting page:', index);
    snapshoot.forEach((t,i) => (t.active = i===index));
  }

  ngAfterContentInit(): void {
    this.sub = this.pages?.changes.subscribe(()=>{
      this.visible = this.pages.length > 0;
      console.log('pages visible', this.visible);
      if (this.visible)
        {
          let last = this.pages.length -1;
          setTimeout(() => {
            this.selectPage(last);
          },100);       
        }
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
