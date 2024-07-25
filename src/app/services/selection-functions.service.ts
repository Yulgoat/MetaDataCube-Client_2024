import { Injectable } from '@angular/core';
import { Tagset } from '../models/tagset';
import { Tag } from '../models/tag';
import { Node } from '../models/node';
import { SelectedDimensions } from '../models/selected-dimensions';
import { Filter } from '../models/filter';
import { GetTagsetListService } from './get-tagset-list.service';
import { SelectedDimensionsService } from './selected-dimensions.service';
import { SelectedFiltersService } from './selected-filters.service';
import { UndoRedoService } from './undo-redo.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectionFunctionsService {
  
  /** Set of all selected elements, either as dimensions or filters (subject)*/
  checked_elements: BehaviorSubject<Set<Tagset|Node|Tag> > = new BehaviorSubject<Set<Tagset|Node|Tag> >(new Set<Tagset|Node|Tag> ());
  /** Set of all selected elements, either as dimensions or filters (observable)*/
  checked_elements$: Observable<Set<Tagset|Node|Tag> > = this.checked_elements.asObservable();

  /** String corresponding to what the user enters in the search field (subject). We create a subject/observable to keep the search in mind between two page. */
  elementToSearch: BehaviorSubject<string> = new BehaviorSubject<string>("");
  /** String corresponding to what the user enters in the search field (observable) We create a subject/observable to keep the search in mind between two page. */
  elementToSearch$: Observable<string> = this.elementToSearch.asObservable();
  

  // Initialization of variables which will then be linked to the various desired observables (see constructor).
  tagsetlist: Tagset[] = [];
  filtersList : Filter[]=[];
  selectedDimensions : SelectedDimensions = new SelectedDimensions();   

  constructor(
    private getTagsetListService: GetTagsetListService,                   
    protected selectedDimensionsService:SelectedDimensionsService,  
    private selectedFiltersService:SelectedFiltersService,                 // Service containing information on selected filters      
    private undoredoService : UndoRedoService,
  ) { 
    this.getTagsetListService.tagsetList$.subscribe(data => {
      this.tagsetlist = data;
    });

    this.selectedDimensionsService.selectedDimensions$.subscribe(data => {
      this.selectedDimensions = data;
      let checked_elements_bis = new Set<Tagset|Node|Tag> ();
      if(data.elementX && !(data.elementX.type==='tag')){
        checked_elements_bis.add(data.elementX);
      }
      if(data.elementY && !(data.elementY.type==='tag')){
        checked_elements_bis.add(data.elementY);
      }
      this.filtersList.forEach(filter=>{
        checked_elements_bis.add(filter.element);
      })
      this.checked_elements.next(checked_elements_bis);
    });

    this.selectedFiltersService.filters$.subscribe(data =>{
      this.filtersList = data;
      let checked_elements_bis = new Set<Tagset|Node|Tag> ();
      if(this.selectedDimensions.elementX && !(this.selectedDimensions.elementX.type==='tag')){
        checked_elements_bis.add(this.selectedDimensions.elementX);
      }
      if(this.selectedDimensions.elementY && !(this.selectedDimensions.elementY.type==='tag')){
        checked_elements_bis.add(this.selectedDimensions.elementY);
      }
      data.forEach(filter=>{
        checked_elements_bis.add(filter.element);
      })
      this.checked_elements.next(checked_elements_bis);
    })
  }



  /**
   * Function that will be launched if you click to check or uncheck one of the X boxes. 
   * 
   * If ticked, the variables for X are defined with the data the element that has been ticked. If we uncheck, we set the variables to null.
   * If an element was already checked, we'll uncheck it and then update the values. 
   */
  dimXSelected(elt:Node|Tagset): void {
    let newSelectedDimensions: SelectedDimensions = new SelectedDimensions();

    if(this.selectedDimensionsService.selectedDimensions.value.ischeckedX && !elt.isCheckedX){ 
      if((this.selectedDimensions.xid) && (this.selectedDimensions.xtype)){
        const actualElementX = this.selectedDimensions.elementX;
        if(!(actualElementX===null) && (actualElementX?.type==="node"||actualElementX?.type==="tagset")){
          actualElementX.isCheckedX = false;
        }
      }
      elt.isCheckedX = !elt.isCheckedX ;
      newSelectedDimensions = new SelectedDimensions(elt.name,elt.id,elt.type,elt,this.selectedDimensions.yname, this.selectedDimensions.yid,this.selectedDimensions.ytype,this.selectedDimensions.elementY);
      newSelectedDimensions.ischeckedX = this.selectedDimensionsService.selectedDimensions.value.ischeckedX;
      newSelectedDimensions.ischeckedY = this.selectedDimensions.ischeckedY;
    }
    else{
      elt.isCheckedX = !elt.isCheckedX ;
      this.selectedDimensionsService.selectedDimensions.value.ischeckedX = !this.selectedDimensionsService.selectedDimensions.value.ischeckedX;

      if((!elt.isCheckedX)&&(!this.selectedDimensionsService.selectedDimensions.value.ischeckedX)){
        newSelectedDimensions = new SelectedDimensions(undefined,undefined,undefined,undefined, this.selectedDimensions.yname,this.selectedDimensions.yid,this.selectedDimensions.ytype,this.selectedDimensions.elementY);
        newSelectedDimensions.ischeckedX = this.selectedDimensionsService.selectedDimensions.value.ischeckedX;
        newSelectedDimensions.ischeckedY = this.selectedDimensions.ischeckedY;
      }

      if((elt.isCheckedX)&&(this.selectedDimensionsService.selectedDimensions.value.ischeckedX)){
        newSelectedDimensions = new SelectedDimensions(elt.name,elt.id,elt.type,elt,this.selectedDimensions.yname, this.selectedDimensions.yid,this.selectedDimensions.ytype,this.selectedDimensions.elementY);
        newSelectedDimensions.ischeckedX = this.selectedDimensionsService.selectedDimensions.value.ischeckedX;
        newSelectedDimensions.ischeckedY = this.selectedDimensions.ischeckedY;
      }
    }

    this.selectedDimensionsService.selectedDimensions.next(newSelectedDimensions);
    this.undoredoService.addDimensionsAction(newSelectedDimensions);    //Add the Action to the UndoRedoService
  }

  /**
   * Function that will be launched if you click to check or uncheck one of the Y boxes. 
   * 
   * If ticked, the variables for Y are defined with the data of the element that has been ticked. If we uncheck, we set the variables to null.
   * If an element was already checked, we'll uncheck it and then update the values.
   */
  dimYSelected(elt:Node|Tagset): void {
    let newSelectedDimensions:SelectedDimensions = new SelectedDimensions();

    if(this.selectedDimensionsService.selectedDimensions.value.ischeckedY && !elt.isCheckedY){ 
      if(this.selectedDimensions.yid && this.selectedDimensions.ytype ){
        const actualElementY = this.selectedDimensions.elementY;
        if(!(actualElementY===null) && (actualElementY?.type==="node"||actualElementY?.type==="tagset")){
          actualElementY.isCheckedY = false;
        }
      }
      elt.isCheckedY = !elt.isCheckedY ;
      newSelectedDimensions = new SelectedDimensions(this.selectedDimensions.xname,this.selectedDimensions.xid,this.selectedDimensions.xtype,this.selectedDimensions.elementX,elt.name,elt.id,elt.type,elt);
      newSelectedDimensions.ischeckedX = this.selectedDimensions.ischeckedX;
      newSelectedDimensions.ischeckedY = this.selectedDimensionsService.selectedDimensions.value.ischeckedY;
    }

    else{
      elt.isCheckedY = !elt.isCheckedY ;
      this.selectedDimensionsService.selectedDimensions.value.ischeckedY = !this.selectedDimensionsService.selectedDimensions.value.ischeckedY;

      if((!elt.isCheckedY)&&(!this.selectedDimensionsService.selectedDimensions.value.ischeckedY)){
        newSelectedDimensions = new SelectedDimensions(this.selectedDimensions.xname,this.selectedDimensions.xid,this.selectedDimensions.xtype, this.selectedDimensions.elementX, undefined,undefined, undefined, undefined);
        newSelectedDimensions.ischeckedX = this.selectedDimensions.ischeckedX;
        newSelectedDimensions.ischeckedY = this.selectedDimensionsService.selectedDimensions.value.ischeckedY;
      }

      if((elt.isCheckedY)&&(this.selectedDimensionsService.selectedDimensions.value.ischeckedY)){
        newSelectedDimensions = new SelectedDimensions(this.selectedDimensions.xname,this.selectedDimensions.xid,this.selectedDimensions.xtype,this.selectedDimensions.elementX,elt.name,elt.id,elt.type,elt);
        newSelectedDimensions.ischeckedX = this.selectedDimensions.ischeckedX;
        newSelectedDimensions.ischeckedY = this.selectedDimensionsService.selectedDimensions.value.ischeckedY;
      }
    } 

    this.selectedDimensionsService.selectedDimensions.next(newSelectedDimensions);
    this.undoredoService.addDimensionsAction(newSelectedDimensions);          //Add the Action to the UndoRedoService
  }

  /**
   * Function launched when a tag is selected or deselected.
   * 
   * Depending on whether the tag has been selected or deselected, we will call the add function of the service or the remove function.
   */
  tagFilterSelected(tag: Tag) {
    tag.ischecked = !tag.ischecked;
    if (tag.ischecked) {
      this.addFilter(tag.id,tag.type,tag);
    } else {
      this.removeFilter(tag.id,tag.type);
    }
  }
  
  /**
   * Function launched when a nodes is selected or deselected as a filter.
   * 
   * Depending on whether the node has been selected or deselected, we will call the add function of the service or the remove function.
   */
  nodeFilterSelected(node: Node) {
    node.isCheckedFilters = !node.isCheckedFilters;
    if (node.isCheckedFilters) {
      this.addFilter(node.id,node.type,node);
    } else {
      this.removeFilter(node.id,node.type);
    }
  }

  /**
   * Function launched when a tagset is selected or deselected as a filter.
   * 
   * If the tagset is selected, we call add function of the service, 
   * if it is deselected, it is the remove function.
   */
  tagsetFilterSelected(tagset:Tagset): void {
    tagset.isCheckedFilters = !tagset.isCheckedFilters;

    if (tagset.isCheckedFilters) {
      this.addFilter(tagset.id,tagset.type,tagset);
    } else {
      this.removeFilter(tagset.id,tagset.type);
    }
  }

  /**
   * Add a filter to the filters List
   */
  addFilter(id: number, type: 'tagset'|'tag'|'node',element:Tag|Tagset|Node): void {
    const filter = new Filter(id, type,element);

    const newfiltersList : Filter[]=[];
    this.filtersList.forEach(filter=>{
      newfiltersList.push(filter);
    });
    newfiltersList.push(filter);
    
    this.filtersList = newfiltersList;

    this.undoredoService.addFilterAction(this.filtersList);     //Add the Action to the UndoRedoService
    this.selectedFiltersService.filtersSubject.next(this.filtersList);
  }

  /**
   * Remove a filter from the filters List
   */
  removeFilter(id: number, type: 'tagset'|'tag'|'node'): void {
    let element: Filter | null = null;

    const currentFilters = this.filtersList;
    currentFilters.forEach(elt => {
      if (elt.type === type && elt.id === id) {
        element = elt;
      }
    });

    if (element !== null) {
      const updatedFilters = currentFilters.filter(f => f !== element);
      this.filtersList = updatedFilters;
      this.undoredoService.addFilterAction(updatedFilters);     //Add the Action to the UndoRedoService
      this.selectedFiltersService.filtersSubject.next(updatedFilters);
    }
  }

}
