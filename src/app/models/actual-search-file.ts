import { Filter } from "./filter";
import { Hierarchy } from "./hierarchy";
import { SelectedDimensions } from "./selected-dimensions";
import { TagList } from "./tag-list";
import { Tagset } from "./tagset";

export class ActualSearchFile {
    selectedDimensions : SelectedDimensions;
    selectedFilters : Filter[];
    preSelection : ((Hierarchy|Tagset|TagList)[])[];

    constructor(selectedDimensions : SelectedDimensions, selectedFilters : Filter[], preSelection : ((Hierarchy|Tagset|TagList)[])[]){
        this.selectedDimensions = selectedDimensions;
        this.selectedFilters = selectedFilters;
        this.preSelection = preSelection;
    }
}
