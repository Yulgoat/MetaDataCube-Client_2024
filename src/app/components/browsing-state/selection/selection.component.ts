import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { GetTagsetListService } from '../../../services/get-tagset-list.service';
import { Tagset } from '../../../models/tagset';
import { Node } from '../../../models/node';
import { Hierarchy } from '../../../models/hierarchy';
import { SelectedDimensionsService } from '../../../services/selected-dimensions.service';
import { SelectedDimensions } from '../../../models/selected-dimensions';
import { UndoRedoService } from '../../../services/undo-redo.service';
import { Filter } from '../../../models/filter';
import { SelectedFiltersService } from '../../../services/selected-filters.service';
import { Tag } from '../../../models/tag';
import { SelectionFunctionsService } from '../../../services/selection-functions.service';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css',],
  encapsulation: ViewEncapsulation.None
})

export class SelectionComponent {
  /** String corresponding to what the user enters in the search field */
  elementToSearch = '';

  /** List of all tag ids linked to each tagsetList node (allows you to see which tags are not linked to any nodes). */
  nodesTagIDList : number[] = []; 

  // Initialization of variables which will then be linked to the various desired observables (see constructor && ngOnInit).
  tagsetlist: Tagset[] = [];
  filtersList : Filter[]=[];
  selectedDimensions : SelectedDimensions = new SelectedDimensions();

  constructor(
    private getTagsetListService: GetTagsetListService,                   
    protected selectedDimensionsService:SelectedDimensionsService,  
    private selectedFiltersService:SelectedFiltersService,                 // Service containing information on selected filters      
    private undoredoService : UndoRedoService,
    private selectionFunctionsService : SelectionFunctionsService,
  ) {}

  /**
   * When the component is started, we get the tagsetList, the selected Dimensions and Filters
   * 
   * Each time we get new Dimensions or new Filters, we return them and update the list of checked elements
   */
  ngOnInit() {
    this.getTagsetListService.tagsetList$.subscribe(data => {
      this.tagsetlist = data;
      this.getNodesTagId();
    });

    this.selectedDimensionsService.selectedDimensions$.subscribe(data => {
      this.selectedDimensions = data;
    });

    this.selectedFiltersService.filters$.subscribe(data =>{
      this.filtersList = data;
    })

    this.selectionFunctionsService.elementToSearch$.subscribe(data =>{
      this.elementToSearch = data;
    })
  }



  /**
   * Sort a hierarchy list alphabetically (Symbol -> Number ->aAbCdDeF)
   */
  sortHierarchy(hierarchy: Hierarchy[]): Hierarchy[] {
    return hierarchy.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Two next function sort a node list alphabetically (Symbol -> Number ->aAbCdDeF)
   */
  sortNodes(nodes: Node[]): Node[] {
    return nodes.sort((a, b) => a.name.toString().localeCompare(b.name.toString()));
  }
  sortNodeChildren(node:Node):Node[]{
    if (!node || !node.children || node.children.length === 0) {
      return [];    
    }
    let sortedChildren = this.sortNodes(node.children);    
    return sortedChildren;
  }

  /**
  * Sort a Tag list alphabetically (Symbol -> Number ->aAbCdDeF).
  */
  sortTags(tags: Tag[]): Tag[] {
    return tags.sort((a, b) => a.name.toString().localeCompare(b.name.toString()));
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



  /**
   *  Function to retrieve all tagId present in the nodes of the tagset hierarchies.
   * 
   * Allows you to see which tagId is not present in this site, so you know which tag is not in a node.
   */
  getNodesTagId(){
    this.tagsetlist.forEach(tagset=>{
      tagset.hierarchies.forEach(hierarchy=>{
        getTagId(hierarchy.firstNode,this.nodesTagIDList);
      })
    })

    function getTagId(node:Node,nodesTagIDList:number[]){
      nodesTagIDList.push(node.tagId);

      if(node.children && node.children.length>0){
        node.children.forEach(childNode=>{
          getTagId(childNode,nodesTagIDList);
        })
      }
    }
  }

  /**
   * Retrieves the list of tags not present in a tagset's hierarchy nodes.
   */
  getTagsetTagList(tagset : Tagset):Tag[]{
    let tags : Tag[] = [];

    tagset.tagList.tags.forEach(tag=>{
      if(!(this.nodesTagIDList.includes(tag.id))){
        tags.push(tag);
      }
    })

    return tags;
  }



  /**
   * Function to delete the selection made for X and Y
   * 
   * We uncheck and reduce as much as possible.
   */ 
  clearSelection(){

    if(this.selectedDimensions.xid && this.selectedDimensions.xtype){
      const elementX = this.selectedDimensions.elementX;
      if(!(elementX===null) && (elementX?.type==="node"||elementX?.type==="tagset")){
        elementX.isCheckedX = false;
      }
    }

    if(this.selectedDimensions.yid && this.selectedDimensions.ytype){
      const elementY = this.selectedDimensions.elementY;
      if(!(elementY===null) && (elementY?.type==="node"||elementY?.type==="tagset")){
        elementY.isCheckedY = false;
      }
    }

    this.filtersList.forEach(elt => {
      if(elt.element.type==="tag"){
        elt.element.ischecked = false;
      }
      else{
        elt.element.isCheckedFilters = false;
      }
    });

    this.tagsetlist.forEach(tagset => {
      tagset.hierarchies.forEach(hierarchy => {
          const nodesToProcess: Node[] = [hierarchy.firstNode];
          const allNodes: Map<number, Node> = new Map();

          while (nodesToProcess.length > 0) {
              const currentNode = nodesToProcess.pop()!;
              allNodes.set(currentNode.id, currentNode); 
              if (currentNode.children) {
                  nodesToProcess.push(...currentNode.children);
              }
          }

          allNodes.forEach(node => node.isExpanded = false);
          allNodes.forEach(node => node.isExpanded = false);
      });
      tagset.tagList.isExpanded = false;
    });
   
    const newSelectedDimensions = new SelectedDimensions();
    newSelectedDimensions.ischeckedX = false;
    newSelectedDimensions.ischeckedY = false;
    this.selectedFiltersService.filtersSubject.next([]);
    this.selectedDimensionsService.selectedDimensions.next(newSelectedDimensions);

    //Add the Action to the UndoRedoService
    this.undoredoService.addDimensionsAction(newSelectedDimensions);          
    this.undoredoService.addFilterAction([]);

    //this.selectionFunctionsService.checked_elements.next(new Set<Tagset|Tag|Node> ());
  }



  /**
   * Function that, depending on what you type in the taskbar, displays tags / hierarchies / nodes starting with what you've typed. 
   * It will then display only the corresponding elements and all its ancestors.
   * 
   * When you return to the initial state (nothing in the search bar), you will make everything visible again.
   * 
   * This function comprises two internal functions
   */
  /**
   * Function to search for the tag / node / tagset whose name matches what is marked in the search field.
   */
  search_Elements(): void {

    // Function to reset all tags/tagset to isExpanded = false and isVisible = true
    function resetSearch(tagsets: Tagset[]):void{
      tagsets.forEach(tagset => {
        tagset.isVisible = true;
        tagset.isExpanded = false;
        tagset.tagList.tags.forEach(tag=>{
          tag.isVisible = true;
        });
        tagset.hierarchies.forEach(hierarchy => {
          hierarchy.isVisible = true;
          const nodesToProcess: Node[] = [hierarchy.firstNode];
          while (nodesToProcess.length > 0) {
            const currentNode = nodesToProcess.pop()!;
            currentNode.isExpanded = false;
            currentNode.isVisible = true;
            if (currentNode.children) {
              nodesToProcess.push(...currentNode.children);
            }
          }
        });
      });
    }

    // Recursive function to mark parents as isExpanded and isVisible
    function expandParents(node: Node, allNodes: Map<number, Node>): void {
        if (node.parentID !== null) {
            const parent = allNodes.get(node.parentID);
            if (parent) {
                parent.isExpanded = true;
                parent.isVisible = true;
                expandParents(parent, allNodes);
            }
        }
    }

    // Recursive function to mark children Visible
    function childrenVisible(node:Node, toSearch : string){
      if(node.children && node.children.length > 0){
        node.children.forEach(child =>{
          child.isVisible = true;
          if (!(child.name.startsWith(toSearch))) {
            child.isExpanded = false;
          }
          childrenVisible(child,toSearch);
        })
      }
    }

    this.selectionFunctionsService.elementToSearch.next(this.elementToSearch);    

    // Reset all nodes if nodestosearch is empty
    if (this.elementToSearch === '') {
      resetSearch(this.tagsetlist);
      return;
    }

    // We go through the tagset list to retrieve items starting with nodetosearch and display them.
    this.tagsetlist.forEach(tagset => {
      tagset.isVisible = false; 
      if(tagset.name.toString().startsWith(this.elementToSearch)){
        tagset.isVisible = true;
      }

      this.getTagsetTagList(tagset).forEach(tag => {
        tag.isVisible = false; 
          if (tag.name.toString().startsWith(this.elementToSearch)) {
            tag.isVisible = true;
  
            // Display the tagset of the corresponding tag
            tagset.isExpanded = true;
            tagset.isVisible = true;
          }
      });


      tagset.hierarchies.forEach(hierarchy => {
        hierarchy.isVisible = false; // Hide default hierarchies
        const nodesToProcess: Node[] = [hierarchy.firstNode];
        const allNodes: Map<number, Node> = new Map();

        if(hierarchy.name.startsWith(this.elementToSearch)){
          hierarchy.isVisible = true;
        }

        // Map of all the nodes
        while (nodesToProcess.length > 0) {
            const currentNode = nodesToProcess.pop()!;
            allNodes.set(currentNode.id, currentNode); 
            if (currentNode.children) {
                nodesToProcess.push(...currentNode.children); // Adding children to the process
            }
        }

        // Hide and reduce all nodes 
        allNodes.forEach(node => node.isVisible = false);
        allNodes.forEach(node => node.isExpanded = false);

        
        
        allNodes.forEach(node => {
          if (node.name.startsWith(this.elementToSearch)) {
            node.isExpanded = true;
            node.isVisible = true;
            childrenVisible(node, this.elementToSearch);
            expandParents(node, allNodes);

            // Display the hierarchy and tagset of the corresponding node
            hierarchy.isVisible = true;
            tagset.isVisible = true;
            tagset.isExpanded = true;
          }          
        });
      });
    }); 
  }
  
}
