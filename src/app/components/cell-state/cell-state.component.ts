import { Component } from '@angular/core';
import { GetCellsService } from '../../services/get-cells.service';
import { combineLatest } from 'rxjs';
import { GetCellStateService } from '../../services/get-cell-state.service';

@Component({
  selector: 'app-cell-state',
  templateUrl: './cell-state.component.html',
  styleUrl: './cell-state.component.css'
})
export class CellStateComponent {

  imagesURI: string[] = [];

  constructor(
    private getCellStateService : GetCellStateService,
  ){}

  async ngOnInit(): Promise<void> {    
    this.getCellStateService.allImagesURI$.subscribe(data => {
      this.imagesURI = this.getCompleteUrl(data);
    });
  }

  getCompleteUrl(URIs:string[]): string[]{
    let baseurl = `assets/images/lsc_thumbs512/thumbnails512/`;
    let res : string[] = [];
    URIs.forEach(uri => {
      res.push(baseurl+uri);
    });
    return res;
  }

}
