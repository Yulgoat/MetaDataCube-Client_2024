import { Component } from '@angular/core';
import { GetCellsService } from '../../services/get-cells.service';
import { combineLatest } from 'rxjs';
import { GetCellStateService } from '../../services/get-cell-state.service';
import { MediaInfos } from '../../models/media-infos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cell-state',
  templateUrl: './cell-state.component.html',
  styleUrl: './cell-state.component.css'
})
export class CellStateComponent {

  mediasInfos: MediaInfos[] = [];
  /** Image selected in the grid. The image is kept in memory even when you return to the grid, so as not to lose it when you change view. */
  currentMedia: MediaInfos = new MediaInfos("",0,"");     

  display_grid : boolean = true;
  display_single : boolean = false;

  constructor(
    private getCellStateService : GetCellStateService,
    private router: Router,
  ){}

  ngOnInit() {    
    this.getCellStateService.allMediasInfos$.subscribe(data => {
      data.forEach(mediaInfos => {
        const completeURL = this.getCompleteUrl(mediaInfos.uri);
        const imageInfo: MediaInfos = new MediaInfos(completeURL,mediaInfos.mediaID,mediaInfos.extension);
        imageInfo.songName = mediaInfos.songName;
        imageInfo.artistName = mediaInfos.artistName;

        this.mediasInfos.push(imageInfo);
        this.currentMedia = this.mediasInfos[0];
      })
    });
  }

  /**
   * We add to the initial url the end of the url leading to the image 
   */
  getCompleteUrl(URI:string): string{
    let baseurl = `assets/images/lsc_thumbs512/thumbnails512/`;
    return baseurl+URI;
  }

  /**
   * Displays the view with the image clicked in the grid view. We will therefore hide the grid view, but also update the current image.
   */
  show_single_component(currentMedia : MediaInfos){
    this.currentMedia = currentMedia;
    this.display_grid  = false;
    this.display_single = true;
  }

  /**
   * Displays the grid view.
   */
  show_grid_component(){
    this.display_grid  = true;
    this.display_single = false;
  }

  /**
   * Change variables to display the browsing-state Page
   */
  go_to_browsingState_Page():void{
    this.router.navigate(['/browsing-state']);
  }

  //Test Function
  test(){
    for(let i of [1,2,3,4,5,6]){
      const mediaInfo: MediaInfos = new MediaInfos(`assets/images/test${i}.jpg`,1,"jpg");
      this.mediasInfos.push(mediaInfo);
    }
    const mediaInfo: MediaInfos = new MediaInfos(`assets/images/audio_test.mp3`,1,"mp3");
    mediaInfo.songName = "SPECIALZ";
    mediaInfo.artistName = "King Gnu";
    this.mediasInfos.push(mediaInfo);
  }

}
