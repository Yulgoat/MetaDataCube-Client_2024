export class Node {
    name: string;
    id: number;
    type:'node';
    parentID: number | null;
    tagsetID : number;
    children: Node[] | null;
    tagId : number;

    isExpanded : boolean;
    isCheckedX : boolean; 
    isCheckedY : boolean; 
    isCheckedFilters : boolean;
    isVisible : boolean;

    constructor(name: string, id: number, parents: number | null = null, children: Node[] | null = null, tagID:number, tagsetID : number) {
        this.name = name;
        this.id = id;
        this.parentID = parents;
        this.tagsetID = tagsetID;
        this.children = children;
        this.tagId = tagID;

        this.isExpanded = false;
        this.isCheckedX = false;
        this.isCheckedY = false;
        this.isCheckedFilters = false;
        this.isVisible = true;
        
        this.type = 'node';
    }
}
