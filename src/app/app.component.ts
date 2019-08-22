import { Component } from '@angular/core';
import { FileElement } from './file-explorer/model/element';
import { Observable } from 'rxjs/Observable';
import { FileService } from './service/file.service';
import { PhotoComponent } from './photo/photo.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //public fileElements: Observable<FileElement[]>;

  currentRoot: FileElement;
  folderMap:FileElement[];
  currentPath: string = '';
  canNavigateUp = false;
  imageFile: any;
  path: string;
  nextImage:FileElement;
  previousImage:FileElement;
  constructor(public fileService: FileService) {}

  ngOnInit() {
    this.updateFileElementQuery();
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
    this.path = this.fileService.getURL('/'+this.currentPath);
    let photoOverlay = document.getElementById('photo_overlay');
    photoOverlay.style.display='';
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
          if (fileName.name.toLowerCase().indexOf('.jpg')!== -1 || fileName.name.toLowerCase().indexOf('.png')!== -1 || fileName.name.toLowerCase().indexOf('.gif')!== -1 ){
            this.nextImage = fileName;
            break;
          }
        }
        break;
      }
      //defining previous picture
      if (fileName.name.toLowerCase().indexOf('.jpg')!== -1 || fileName.name.toLowerCase().indexOf('.png')!== -1 || fileName.name.toLowerCase().indexOf('.gif')!== -1 ){
        this.previousImage = fileName;
      }
    }
    //console.log('prev/next:',this.previousImage, this.nextImage);

  }
  navigateNext() {
    this.showFile(this.nextImage);
  }
  navigatePrevious() {
    this.showFile(this.previousImage);
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
    this.fileService.getdata('/'+this.currentPath).then((folderMap) => {
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
