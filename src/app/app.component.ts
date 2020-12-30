import { Component, OnInit, OnDestroy } from '@angular/core';
import { FileElement } from './file-explorer/model/element';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { FileService } from './service/file.service';
import { PhotoComponent } from './photo/photo.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  //public fileElements: Observable<FileElement[]>;

  currentRoot: FileElement;
  folderMap:FileElement[];
  currentPath: string = '';
  canNavigateUp = false;
  imageFile: any;
  imgType: string;
  path: string;
  nextImage:FileElement;
  previousImage:FileElement;
  imgDisplay: boolean;
  getDataSubscription = new Subscription();
  constructor(public fileService: FileService) {}

  ngOnInit() {
    this.updateFileElementQuery();
  }
  ngOnDestroy() {
    if (this.getDataSubscription) { this.getDataSubscription.unsubscribe(); }
  }
  addFolder(folder: { name: string }) {
    this.fileService.add({ isFolder: true, name: folder.name, parent: this.currentRoot ? this.currentRoot.id : 'root' });
    this.updateFileElementQuery();
  }

  removeElement(element: FileElement) {
    this.fileService.delete(element.id);
    this.updateFileElementQuery();
  }

  navigateToFolder(element: FileElement) {
    this.currentRoot = element;
    this.currentPath = this.pushToPath(this.currentPath, element.name);
    this.canNavigateUp = true;
    this.updateFileElementQuery();
  }

  showFile(element: FileElement) {
    this.currentRoot = element;
    //console.log('current element', element);
    this.imageFile = this.fileService.getURL('/'+this.currentPath+this.currentRoot.name);
    this.imgType = this.fileType(this.imageFile.toLowerCase()).type;
    this.path = this.fileService.getURL('/'+this.currentPath);
    this.nextImage = null;
    this.previousImage = null;
    //console.log('this.folderMap',this.folderMap);
    for (let i = 0; i< this.folderMap.length; i++){
      let fileName = this.folderMap[i];
      //console.log('matching:', fileName.name, element.name);
      if (fileName.name === element.name) {
        //console.log('match', fileName.name, element.name);
        //looking for next picture
        for (let j = i+1; j < this.folderMap.length; j++) {
          fileName = this.folderMap[j];
          if (this.fileType(fileName.name.toLowerCase()).playable) {
            this.nextImage = fileName;
            break;
          }
        }
        break;
      }
      //defining previous picture
      if (this.fileType(fileName.name.toLowerCase()).playable) {
        this.previousImage = fileName;
      }
    }
    this.imgDisplay = true;

    //console.log('prev/next:',this.previousImage, this.nextImage);

  }
  fileType(file: string): any {
    let ret = {'type': 'unknown', 'playable': false};
    if (file.indexOf('.jpg') !== -1 ||
      file.indexOf('.png') !== -1 ||
      file.indexOf('.gif') !== -1 ) {
        ret = {'type':'pic', 'playable': true};
    }
    else if (file.indexOf('.mp4') !== -1  ||
      file.indexOf('.mov') !== -1 ||
      file.indexOf('.vob') !== -1) {
        ret = {'type':'video', 'playable': true};
    }
    return ret;
  }
  navigateNext() {
    this.imgType = 'unknown';
    this.imgDisplay = false;
    if (this.fileType(this.nextImage.name.toLowerCase()).type === 'video') {
      setTimeout( () => {
        this.showFile(this.nextImage);
      },100);
    }
    else {
      this.showFile(this.nextImage);
    }
  }
  navigatePrevious() {
    this.imgType = 'unknown';
    this.imgDisplay = false;
    if (this.fileType(this.previousImage.name.toLowerCase()).type === 'video') {
      setTimeout( () => {
        this.showFile(this.previousImage);
      },100);
    }
    else {
      this.showFile(this.previousImage);
    }
  }
  navigateUp() {
    // if (this.currentRoot && this.currentRoot.parent === 'root') {
    //   this.currentRoot = null;
    //   this.canNavigateUp = false;
    // } else {
    //   this.currentRoot = this.fileService.get(this.currentRoot.parent);
    // }
    this.currentPath = this.popFromPath(this.currentPath);
    this.updateFileElementQuery();
  }

  moveElement(event: { element: FileElement; moveTo: FileElement }) {
    this.fileService.update(event.element.id, { parent: event.moveTo.id });
    this.updateFileElementQuery();
  }

  renameElement(element: FileElement) {
    this.fileService.update(element.id, { name: element.name });
    this.updateFileElementQuery();
  }

  updateFileElementQuery() {
    this.getDataSubscription = this.fileService.getdataAsObservable('/'+this.currentPath).subscribe((folderMap) => {
      //console.log('updateFileElementQuery',this.currentPath, folderMap);
      //this.fileElements = this.fileService.queryFolderMap();
      let result = [];
      folderMap.forEach(element => {
          result.push(element);
      });
      this.folderMap = result;
    });
  }

  pushToPath(path: string, folderName: string) {
    let p = path ? path : '';
    p += `${folderName}/`;
    return p;
  }

  popFromPath(path: string) {
    let p = path ? path : '';
    let split = p.split('/');
    split.splice(split.length - 2, 1);
    p = split.join('/');
    return p;
  }
}
