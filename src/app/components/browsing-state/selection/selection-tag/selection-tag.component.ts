import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tag } from '../../../../models/tag';
import { SelectionFunctionsService } from '../../../../services/selection-functions.service';

@Component({
  selector: 'app-selection-tag',
  templateUrl: './selection-tag.component.html',
  styleUrl: '../selection.component.css'
})
export class SelectionTagComponent {
  @Input() tag: Tag = new Tag("test",0,0);

  constructor(
    private selectionFunctionsService : SelectionFunctionsService,
  ){}

  /**
   * Function launched when a tag is selected or deselected as a filter.
   */
  tagFilterSelected(tag:Tag) {
    this.selectionFunctionsService.tagFilterSelected(tag);
  }
  
}
