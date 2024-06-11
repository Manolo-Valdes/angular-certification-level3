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


  protected visible:boolean=false
  private pageCount:number=0;
  private sub:Subscription;
  private _selectedPageIndex:number=-1;
  private INDEX_KEY:string='TabViewSelectedPageIndex';
  removePage(index:number):void
  {
    this.pageRemoved.emit(index);
  }
  protected selectPage(index:number,notify:boolean): void {
    const snapshoot:TabPageComponent[] = this.pages.toArray();
    this._selectedPageIndex=index;
    localStorage.setItem(this.INDEX_KEY,this._selectedPageIndex.toString());
    const lastIndex = snapshoot.findIndex(p=> p.active === true);
    if (lastIndex!==index)
    {
      snapshoot.forEach((t,i) => (t.active = i===index));
      if (notify)
        this.activePageChanged.emit({previus:lastIndex,current:index})    
    }  
  }

  ngAfterContentInit(): void {
    const index:string = localStorage.getItem(this.INDEX_KEY);
    if (index)
      {
        this._selectedPageIndex = Number(index);
      }
        if (this.pages)
      {
        this.setUp(this.pages,true);
        this.sub = this.pages.changes.subscribe((pages)=>{
          this.setUp(pages,false)
          });
  }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private setUp(pages:QueryList<TabPageComponent>,notify:boolean):void
{
  const lastPageCount:number = this.pageCount;
  const wasVisible:boolean= this.visible;
  this.pageCount = pages.length;
  this.visible = pages.length > 0;
  if (this.visible)
    {
      const hasActivePage = pages.find((t) => t.active);
      if (!hasActivePage)
        {
          let doNotify:boolean=notify;
          if (this._selectedPageIndex ===-1 || pages.length === 1)
            {
              this._selectedPageIndex=0;
              doNotify=!wasVisible || lastPageCount > 1;
            }
          setTimeout(() => this.selectPage(this._selectedPageIndex,doNotify));
        }
    }
}
}
