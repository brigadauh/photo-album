import { Component, OnInit, Input, Output, EventEmitter
  , SimpleChanges } from '@angular/core';
import { FileElement } from '../file-explorer/model/element';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent implements OnInit {
  @Input() path: string;
  @Input() currentImage: string;
  @Input() imgType: string;
  @Input() nextImage: string;
  @Input() previousImage: string;
  @Input() folderMap: FileElement[];
  @Output() navigatedNext = new EventEmitter<FileElement>();
  @Output() navigatedPrevious = new EventEmitter<FileElement>();
  @Output() close = new EventEmitter<FileElement>();

  img: any;
  filePosition: number = 0;
  constructor() {}

  ngOnInit() {}
  photoLoaded(event) {
    let currentPhoto = event.target;
    let photoWidth = currentPhoto.offsetWidth;
    let photoHeight = currentPhoto.offsetHeight;
    let photoOverlay = document.getElementById('photo_overlay');

    if (photoHeight > photoWidth) {
      photoOverlay.style.width = 'initial';
      photoOverlay.style.height = '80%';
    }
    else {
      photoOverlay.style.width = '80%';
      photoOverlay.style.height = 'initial';
    }
    console.log('photo:', currentPhoto.offsetWidth,currentPhoto.offsetHeight);
  }
  photoClose(){
    this.close.emit();
  }
  photoNavPrevious() {
    this.navigatedPrevious.emit();
  }
  photoNavNext() {
    this.navigatedNext.emit();
  }

}
