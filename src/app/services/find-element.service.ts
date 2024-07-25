import { Injectable } from '@angular/core';
import { Tagset } from '../models/tagset';
import { Node } from '../models/node';
import { GetTagsetListService } from './get-tagset-list.service';
import { Tag } from '../models/tag';
import { Hierarchy } from '../models/hierarchy';
import { TagList } from '../models/tag-list';

@Injectable({
  providedIn: 'root'
})
export class FindElement {

  tagsetList:Tagset[] = [];

  constructor(
    private getTagsetListService : GetTagsetListService,
  ) {
    this.getTagsetListService.tagsetList$.subscribe(data => {
      this.tagsetList = data;
    });
   }

  /**
   * Retrieves a node, tagset, tag or hierarchy using the type and id of the element. This will retrieve the exact object from the tagsetList.
   * 
   * Contains an internal function  "findNodeById" which searches for the node (if the component is a node) in depth.
   */
  findElementinTagsetList(elementid: number, elementType: 'node' | 'tagset' | 'tag' | 'hierarchy' | 'tagList'): Tagset | Node | Tag | Hierarchy| TagList | null {
    let element: Tagset | Node | Tag | Hierarchy| TagList |  null = null;
    
    for (const tagset of this.tagsetList) {
        if (elementType === 'tagset') {
            if (tagset.id ===  elementid) {
                element = tagset;
                break;
            }
        } 
        else if (elementType === 'node') {
            for (const hierarchy of tagset.hierarchies) {
                if (hierarchy.firstNode.id === elementid) {
                    element = hierarchy.firstNode;
                    break;
                } else {
                    const foundNode = findNodeById(hierarchy.firstNode, elementid);
                    if (foundNode) {
                        element = foundNode;
                        break;
                    }
                }
            }
        }
        else if (elementType === 'tag') {
            for (const tag of tagset.tagList.tags) {
                if (tag.id === elementid) {
                    element = tag;
                    break;
                }
            }
        }
        else if (elementType === 'hierarchy') {
            for (const hier of tagset.hierarchies) {
                if (hier.id === elementid) {
                    element = hier;
                    break;
                }
            }
        }
        else if (elementType === 'tagList') {            
          if (tagset.id ===  elementid) {
            element = tagset.tagList;
            break;
          }
        }
    }

    return element;
    

    function findNodeById(node: Node, id: number): Node | null {
      if (node.id === id) {
          return node;
      }  
      if (node.children) {
          for (const childNode of node.children) {
              const foundNode = findNodeById(childNode, id);
              if (foundNode) {
                  return foundNode;
              }
          }
      }  
      return null;
    }
  }


  /**
   * Function that extends all the parents of a node in Dimensions Case.
   */
  expandNodeParents(parentid: number|null): void {
    if(!(parentid===null)){
      const parent = this.findElementinTagsetList(parentid,'node');
      if(parent && parent.type==='node'){
        parent.isExpanded = true;
        this.expandNodeParents(parent.parentID);
      }
    }
  }

  /**
   * Function that extends the tagset of the element
   */
  expandParentTagset(elt : Tag|Node): void {
    if(!(elt.tagsetID===null)){
      const parentTagset = this.findElementinTagsetList(elt.tagsetID,'tagset');
      if(parentTagset && parentTagset.type==='tagset'){
        parentTagset.isExpanded=true;
      }
    }
  }

  /**
   * Function that extends the tagset of the element
   */
  expandParentTagList(elt : Tag): void {
    if(!(elt.tagsetID===null)){
      const parentTagset = this.findElementinTagsetList(elt.tagsetID,'tagset');
      if(parentTagset && parentTagset.type==='tagset'){
        parentTagset.tagList.isExpanded=true;
      }
    }
  }
}

