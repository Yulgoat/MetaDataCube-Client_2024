import { Component, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GetTagsetListService } from '../../services/get-tagset-list.service';
import { Router } from '@angular/router';
import { UndoRedoService } from '../../services/undo-redo.service';
import { SelectedDimensions } from '../../models/selected-dimensions';
import { SelectedDimensionsService } from '../../services/selected-dimensions.service';
import { GetUrlToSelectedDimensionsOrCellStateService } from '../../services/get-url-to-selected-dimensions-or-cell-state.service';
import { Filter } from '../../models/filter';
import { SelectedFiltersService } from '../../services/selected-filters.service';
import { ActualSearchFile } from '../../models/actual-search-file';
import { FindElement } from '../../services/find-element.service';
import { Tagset } from '../../models/tagset';
import { Node } from '../../models/node';
import { Hierarchy } from '../../models/hierarchy';
import { Tag } from '../../models/tag';
import { TagList } from '../../models/tag-list';

@Component({
  selector: 'app-browsing-state',
  templateUrl: './browsing-state.component.html',
  styleUrl: './browsing-state.component.css'
})
export class BrowsingStateComponent {
  
  /** If true, we show the dimensions pannel, otherwise no */
  display_dimensions: boolean = true;

  /** If true, we show the filters pannel, otherwise no */
  display_filters: boolean = true;     

  /** If true, we show the pop-up for the dimension pre-selection, otherwise no */
  display_popup_preselection: boolean = false;    

  /** If true, we use the small screen version of the article tag. Otherwise we use the first version, which is the large screen version */
  smallscreen: boolean = false;      
  
  selectedDimensions: SelectedDimensions = new SelectedDimensions();
  selectedFilters : Filter[] = [];

  tagsetList : Tagset[] = [];


  constructor(
      private router: Router,
      @Inject(PLATFORM_ID) private platformId: Object,
      private getTagsetListService: GetTagsetListService,
      private undoredoService : UndoRedoService,
      private getUrlToSelectedDimensionsOrCellStateService : GetUrlToSelectedDimensionsOrCellStateService,
      private selectedDimensionsService : SelectedDimensionsService,
      private selectedFiltersService : SelectedFiltersService,
      private findElementService : FindElement,
    ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.smallscreen = window.innerWidth < 1101;
    }
    
    this.getUrlToSelectedDimensionsOrCellStateService.selectedDimensionsWithUrl$.subscribe(data => {
      this.selectedDimensions = data;
    });
    
    this.selectedFiltersService.filters$.subscribe(data => {
      this.selectedFilters = data;
    });
    
    this.getTagsetListService.tagsetList$.subscribe(data => {
      this.tagsetList = data;
    });
    
  }

  /**
   * Used to invert the value of display_dimensions, in order to display the dimensions pannel or not.
   */
  display_dimensions_change(): void {
    this.display_dimensions = !this.display_dimensions;
  }

  /**
   * Used to invert the value of display_filters, in order to display the filters pannel or not.
   */
  display_filters_change(): void {
    this.display_filters = !this.display_filters;
  }
  
  /**
   * Used to invert the value of display_filters, in order to display the filters pannel or not.
   */
  display_dimensions_preselection(): void {
    this.display_popup_preselection = !this.display_popup_preselection;
  }

  /**
   * Used to invert the value of display_filters, in order to display the filters pannel or not. 
   */ 
  async reload_tagset_list(): Promise<void> {
    await this.getTagsetListService.getTagsetList();
    console.log("End of refresh");
  }

  undo(){
    this.undoredoService.undo();
  }

  redo(){
    this.undoredoService.redo();
  }

  /** 
   * Each time the size of the browser window changes, it updates the smallscreen variable 
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (isPlatformBrowser(this.platformId)) {
      this.smallscreen = window.innerWidth < 1101;
    }
  }

  /**
   * Change variables to display the grid component instead of the graph component.
   */
  go_to_cellState_Page():void{
    this.router.navigate(['/cell-state']);
  }

  /**
   * Function for loading a configuration file to obtain a precise search in one go.
   * 
   * From this file, we'll retrieve the selected dimensions, the selected filters and the Pre-Selection on dimensions.
   */
  loadSearch() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
  
    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target && target.files && target.files.length > 0) {
        const file = target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result === 'string') {
            try {
              const json = JSON.parse(result);
              console.log('Import successful:', json);

              // We reduce and uncheck the elements previously selected.
              if(this.selectedDimensions.elementX && !(this.selectedDimensions.elementX?.type==="tag")){
                this.selectedDimensions.elementX.isCheckedX=false;
                this.selectedDimensions.elementX.isExpanded=false;
              }
              if(this.selectedDimensions.elementY && !(this.selectedDimensions.elementY?.type==="tag")){
                this.selectedDimensions.elementY.isCheckedY=false;
                this.selectedDimensions.elementY.isExpanded=false;
              }
              this.selectedFilters.forEach(filter=>{
                if(filter.element.type==='tag'){
                  filter.element.ischecked = false;
                }
                else{
                  filter.element.isCheckedFilters = false;
                }
              })

              // Dim X - We retrieve the element corresponding to the one selected in the file.
              let actualX : Tagset | Node | Tag | Hierarchy| TagList | null = this.findElementService.findElementinTagsetList(json.selectedDimensions.xid, json.selectedDimensions.xtype);
              if(actualX && !(actualX.type==='tag' || actualX.type==='hierarchy' || actualX.type==='tagList')){
                actualX.isCheckedX = json.selectedDimensions.elementX.isCheckedX; 
                if(actualX.type==="node"){
                  this.findElementService.expandNodeParents(actualX.parentID);
                }
              }
              json.selectedDimensions.elementX = actualX;

              // Dim Y - We retrieve the element corresponding to the one selected in the file.
              let actualY : Tagset | Node | Tag | Hierarchy| TagList | TagList | null = this.findElementService.findElementinTagsetList(json.selectedDimensions.yid, json.selectedDimensions.ytype);
              if(actualY && !(actualY.type==='tag' || actualY.type==='hierarchy' || actualY.type==='tagList')){
                actualY.isCheckedY = json.selectedDimensions.elementY.isCheckedY; 
                if(actualY.type==="node"){
                  this.findElementService.expandNodeParents(actualY.parentID);
                }
              }
              json.selectedDimensions.elementY = actualY;

              // Filters
              const newFiltersList : Filter[] = [];
              json.selectedFilters.forEach((filter:Filter) => {
                let actualFilter = this.findElementService.findElementinTagsetList(filter.id, filter.type);
                if(actualFilter && !(actualFilter.type==='hierarchy') && !(actualFilter.type==='tagList')){
                  if(actualFilter.type==="tag"&&filter.element.type==="tag"){
                    actualFilter.ischecked=filter.element.ischecked;
                    this.findElementService.expandParentTagset(actualFilter);
                  }
                  else if (actualFilter.type==="tagset"&&filter.element.type==="tagset"){
                    actualFilter.isCheckedFilters=filter.element.isCheckedFilters;
                    actualFilter.isExpanded=filter.element.isExpanded;
                  }
                  else if (actualFilter.type==="node"&&filter.element.type==="node"){
                    actualFilter.isCheckedFilters=filter.element.isCheckedFilters;
                    actualFilter.isExpanded=filter.element.isExpanded;
                    this.findElementService.expandParentTagset(actualFilter);
                    this.findElementService.expandNodeParents(actualFilter.parentID);
                  }
                  newFiltersList.push(new Filter(actualFilter.id,actualFilter.type,actualFilter))
                }
              });

              // PreSelection - Everything is visible
              let modified_elements : (Hierarchy|Tagset|TagList)[] = [];
              this.tagsetList.forEach(tagset=>{
                tagset.hierarchies.forEach(hierarchy =>{
                  if(hierarchy.isVisible===false){
                    hierarchy.isVisible = true;
                    modified_elements.push(hierarchy);
                  }
                })
                if(tagset.tagList.isVisible===false){
                  tagset.tagList.isVisible = true;
                  modified_elements.push(tagset.tagList);
                }
                if(tagset.isVisible===false){
                  tagset.isVisible = true;
                  modified_elements.push(tagset);
                }
              });
              
              // PreSelection - We change the elements in the same way as they have been changed in the conf file
              json.preSelection.forEach((list:(Hierarchy|Tagset|TagList)[]) =>{
                list.forEach(elt =>{
                  let element;
                  if(elt.type==='tagList'){
                    element = this.findElementService.findElementinTagsetList(elt.tagsetID, elt.type);
                  }
                  else{
                    element = this.findElementService.findElementinTagsetList(elt.id, elt.type);
                  }
                  if(element && ((element.type==='hierarchy') || (element.type === 'tagList') || (element.type === 'tagset'))){
                    element.isVisible = elt.isVisible;
                    modified_elements.push(element);
                  }
                })
              })

              // We update the values of the various services
              this.selectedDimensionsService.selectedDimensions.next(json.selectedDimensions);
              this.selectedFiltersService.filtersSubject.next(json.selectedFilters);
              this.undoredoService.addFileAction(json,modified_elements,newFiltersList);      //Add the Action to the UndoRedoService
            } 
            catch (error) {
              console.error('Error parsing JSON:', error);
            }
          }
        };
        reader.readAsText(file);
      }
    };
  
    input.click();
  }  

  saveSearch(){
    let actualDimensions : SelectedDimensions = this.selectedDimensions;
    let actualFilters : Filter[] = this.selectedFilters;
    let actualPreSelection : ((Hierarchy|Tagset|TagList)[])[] = this.undoredoService.AllPreSelectionDo;
    let actualSearch : ActualSearchFile = new ActualSearchFile(actualDimensions,actualFilters,actualPreSelection);

    if (actualSearch) {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(actualSearch));
      const a = document.createElement('a');
      a.href = dataStr;
      a.download = 'actualSearch.json';
      a.click();
    }
  }


  
}
