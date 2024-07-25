import { Hierarchy } from "./hierarchy";
import { Tag } from "./tag";
import { TagList } from "./tag-list";

export class Tagset {
    name: string;
    id: number;
    type:'tagset';
    hierarchies: Hierarchy[];
    tagList : TagList;
    isCheckedX:boolean;
    isCheckedY:boolean;
    isCheckedFilters:boolean;
    isVisible : boolean;
    isExpanded : boolean;


    constructor(name: string, id: number,hierarchies: Hierarchy[],tags:Tag[] ) {
        this.name = name;
        this.id = id;
        this.hierarchies = hierarchies;
        this.tagList = new TagList(tags,id);

        this.isCheckedX = false;
        this.isCheckedY = false;
        this.isCheckedFilters = false;
        this.isVisible = true;
        this.isExpanded = false;

        this.type = 'tagset';
    }

}
