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
  @Input() nextImage: string;
  @Input() previousImage: string;
  @Input() folderMap: FileElement[];
  @Output() navigatedNext = new EventEmitter<FileElement>();
  @Output() navigatedPrevious = new EventEmitter<FileElement>();

  img:any;
  filePosition: number = 0;
  constructor() {}

  ngOnInit() {}

  photoClose(){
    let photo = document.getElementById('photo_overlay');
    photo.style.display='none';
  }
  photoNavPrevious() {
    this.navigatedPrevious.emit();
  }
  photoNavNext() {
    this.navigatedNext.emit();
  }

}
