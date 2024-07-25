import { Component } from '@angular/core';
import { Tagset } from '../../../models/tagset';
import { Tag } from '../../../models/tag';
import { Node } from '../../../models/node';
import { SelectionFunctionsService } from '../../../services/selection-functions.service';

@Component({
  selector: 'app-checked-elements',
  templateUrl: './checked-elements.component.html',
  styleUrl: './checked-elements.component.css'
})
export class CheckedElementsComponent {
  
  /** Set of all selected elements, either as dimensions or filters */
  checked_elements : Set<Tagset|Node|Tag> = new Set<Tagset|Node|Tag> ();  
  
  
  constructor(
    private selectionFunctionsService : SelectionFunctionsService,
  ) {}

  /**
   * When the component is started, we get the tagsetList, the selected Dimensions and Filters
   * 
   * Each time we get new Dimensions or new Filters, we return them and update the list of checked elements
   */
  ngOnInit() {
    this.selectionFunctionsService.checked_elements$.subscribe(data =>{
      this.checked_elements = data;
    })
  }

  /**
   * Function that will be launched if you click to check or uncheck one of the X boxes. 
   */
  dimXSelected(elt:Node|Tagset): void {
    this.selectionFunctionsService.dimXSelected(elt);
  }

  /**
   * Function that will be launched if you click to check or uncheck one of the Y boxes. 
   */
  dimYSelected(elt:Node|Tagset): void {
    this.selectionFunctionsService.dimYSelected(elt);
  }

  /**
   * Function launched when a tag is selected or deselected.
   */
  tagFilterSelected(tag: Tag) {
    this.selectionFunctionsService.tagFilterSelected(tag);
  }
  
  /**
   * Function launched when a nodes is selected or deselected as a filter.
   */
  nodeFilterSelected(node: Node) {
    this.selectionFunctionsService.nodeFilterSelected(node);
  }

  /**
   * Function launched when a tagset is selected or deselected as a filter.
   */
  tagsetFilterSelected(tagset:Tagset): void {
    this.selectionFunctionsService.tagsetFilterSelected(tagset);
  }


}
