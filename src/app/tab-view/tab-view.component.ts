import { AfterContentInit, Component, ContentChildren, EventEmitter, OnDestroy, Output, QueryList, SimpleChanges } from '@angular/core';
import { TabPageComponent } from 'app/tab-page/tab-page.component';
import { Subscription } from 'rxjs';


export interface pageChangeData 
{
  previus:number,
  current:number
}

@Component({
  selector: 'app-tab-view',
  templateUrl: './tab-view.component.html',
  styleUrls: ['./tab-view.component.css']
})
export class TabViewComponent implements AfterContentInit, OnDestroy  {
  @Output() pageRemoved: EventEmitter<number> = new EventEmitter();
  @Output() activePageChanged: EventEmitter<pageChangeData> = new EventEmitter();
  @ContentChildren(TabPageComponent) pages: QueryList<TabPageComponent>;


  protected visible:boolean=true
  private sub:Subscription;
  removePage(index:number):void
  {
    console.log('emiting remove page even', index);
    this.pageRemoved.emit(index);
  }
  protected selectPage(index:number): void {
    const snapshoot:TabPageComponent[] = this.pages.toArray();
    console.log('selecting page:', index);
    const lastIndex = snapshoot.findIndex(p=> p.active === true);
    snapshoot.forEach((t,i) => (t.active = i===index));
    this.activePageChanged.emit({previus:lastIndex,current:index})    
  }

  ngAfterContentInit(): void {
    if (this.pages)
      {
        this.setUp(this.pages);
        this.sub = this.pages.changes.subscribe((pages)=>{
          this.setUp(pages)
          });
          }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private setUp(pages:QueryList<TabPageComponent>):void
{
  this.visible = pages.length > 0;
  console.log('pages visible', this.visible);
  if (this.visible)
    {
      const hasActivePage = pages.find((t) => t.active);
      if (!hasActivePage)
        {
          let last = pages.length -1;
          setTimeout(() => {
            this.selectPage(last);
          });
        }
    }
}
}
