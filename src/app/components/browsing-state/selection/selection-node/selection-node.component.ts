import { Component, EventEmitter, Input, Output  } from '@angular/core';
import { Node } from '../../../../models/node';
import { SelectionFunctionsService } from '../../../../services/selection-functions.service';

@Component({
  selector: 'app-selection-node',
  templateUrl: './selection-node.component.html',
  styleUrls: ['../selection.component.css'],
})

export class SelectionNodeComponent {
  list:Node[]=[];
  @Input() node: Node = new Node("test",0,null,this.list,-1,-1);
  @Input() nodegen: number=-1;

  marginLeft: number = 0.8;
  fontSize: number=1;

  constructor(
    private selectionFunctionsService : SelectionFunctionsService,
  ){  }


  /***
   * Give the font size 
   */
  getFontSize():number{
    if(this.nodegen<2){
      return 0.9;
    }else{
      return 1;  
    };
  }
  
  /***
   * Sort a node list alphabetically (Symbol -> Number ->aAbCdDeF)
   */
  sortNodes(nodes: Node[] | null = null): Node[] {
    if (nodes) {
      const sortedNodes = nodes.slice();
      return sortedNodes.sort((a, b) => a.name.toString().localeCompare(b.name.toString()));
    } else {
      return [];
    }
  }

  /***
   * Function that will be launched if you click to check or uncheck one of the X boxes. 
   */
  dimXSelected(node : Node): void {
    this.selectionFunctionsService.dimXSelected(node);
  }

  /***
   * Function that will be launched if you click to check or uncheck one of the Y boxes. 
   */
  dimYSelected(node : Node): void {
    this.selectionFunctionsService.dimYSelected(node);
  }
  
  /**
   * Function launched when a tagset is selected or deselected as a filter.
   */
  nodeFilterSelected(node:Node) {
    this.selectionFunctionsService.nodeFilterSelected(node);
  }

}
