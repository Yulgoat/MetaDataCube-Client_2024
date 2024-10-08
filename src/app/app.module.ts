import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { GetTagsetListService } from './services/get-tagset-list.service';
import { SelectionComponent } from './components/browsing-state/selection/selection.component';
import { SelectionNodeComponent } from './components/browsing-state/selection/selection-node/selection-node.component';
import { CellsDisplayComponent } from './components/browsing-state/cells-display/cells-display.component';
import { BrowsingStateComponent } from './components/browsing-state/browsing-state.component';
import { CellStateComponent } from './components/cell-state/cell-state.component';
import { AppRoutingModule } from './app-routing.module';
import { CellStateGridComponent } from './components/cell-state/cell-state-grid/cell-state-grid.component';
import { CellStateSingleComponent } from './components/cell-state/cell-state-single/cell-state-single.component';
import { SelectionTagComponent } from './components/browsing-state/selection/selection-tag/selection-tag.component';
import { CheckedElementsComponent } from './components/browsing-state/checked-elements/checked-elements.component';
import { SelectionTagByRangeComponent } from './components/browsing-state/selection/selection-tag-by-range/selection-tag-by-range.component';
import { ConfigurationPopupComponent } from './components/browsing-state/configuration-popup/configuration-popup.component';


@NgModule({
  declarations: [
    AppComponent,
    SelectionComponent,
    SelectionNodeComponent,
    CellStateComponent,
    CellsDisplayComponent,
    BrowsingStateComponent,
    CellStateGridComponent,
    CellStateSingleComponent,
    SelectionTagComponent,
    CheckedElementsComponent,
    SelectionTagByRangeComponent,  
    ConfigurationPopupComponent,  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxSliderModule,
  ],
  providers: [
    GetTagsetListService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
