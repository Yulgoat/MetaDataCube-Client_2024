import { Component, EventEmitter, Output } from '@angular/core';
import { Tagset } from '../../../models/tagset';
import { Node } from '../../../models/node';
import { SelectedDimensions } from '../../../models/selected-dimensions';
import { GetTagsetListService } from '../../../services/get-tagset-list.service';
import { Hierarchy } from '../../../models/hierarchy';
import { UndoRedoService } from '../../../services/undo-redo.service';

@Component({
  selector: 'app-pre-selection-popup',
  templateUrl: './pre-selection-popup.component.html',
  styleUrl: './pre-selection-popup.component.css'
})
export class PreSelectionPopupComponent {

  @Output() close_popup_event = new EventEmitter();

  tagsetlist: Tagset[] = [];

  selectedDimensions : SelectedDimensions = new SelectedDimensions();


  constructor(
    private getTagsetListService: GetTagsetListService,        
    private undoRedoService : UndoRedoService,
  ) 
  {}

  /**
   * When the component is started, we get a list of all the tagset.
   */
  async ngOnInit(): Promise<void> {
    this.getTagsetListService.tagsetList$.subscribe(data => {
      this.tagsetlist = data;
    });
  }

  /**
   * Sort a hierarchy list alphabetically (Symbol -> Number ->aAbCdDeF)
   */
  sortHierarchy(hierarchy: Hierarchy[]): Hierarchy[] {
    return hierarchy.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Send a signal to browsingState Component to close the pop-up
   */
  close_popup() : void {
    this.close_popup_event.emit();
  }

  /**
   * Function launched when a tagset checkbox is updated
   */
  check_tagset(tagset : Tagset){
    let modified_elements : (Tagset|Hierarchy)[] = [];

    tagset.hierarchies.forEach(hierarchy => {
      if((hierarchy.isVisible === tagset.isVisibleDimensions)){
        hierarchy.isVisible = !hierarchy.isVisible;
        modified_elements.push(hierarchy);
      }
    })
    tagset.isVisibleDimensions = !tagset.isVisibleDimensions;
    modified_elements.push(tagset);

    this.undoRedoService.addPreSelectionAction(modified_elements);
  }

  /**
   * Function launched when a hierarchy checkbox is updated
   */
  check_hierarchy(hierarchy: Hierarchy,tagset : Tagset){
    let modified_elements : (Tagset|Hierarchy)[] = [];
    
    hierarchy.isVisible = !hierarchy.isVisible;
    modified_elements.push(hierarchy);

    if(hierarchy.isVisible){
      tagset.isVisibleDimensions = true;
      modified_elements.push(tagset);
    }

    this.undoRedoService.addPreSelectionAction(modified_elements);
  }

}
