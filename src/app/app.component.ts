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
  public fileElements: Observable<FileElement[]>;

  constructor(public fileService: FileService) {}

  currentRoot: FileElement;
  currentPath: string = '';
  canNavigateUp = false;
  imageFile: any;

  ngOnInit() {
    // const folderA = this.fileService.add({ name: 'Folder A', isFolder: true, parent: 'root' });
    // this.fileService.add({ name: 'Folder B', isFolder: true, parent: 'root' });
    // this.fileService.add({ name: 'Folder C', isFolder: true, parent: folderA.id });
    // this.fileService.add({ name: 'File A', isFolder: false, parent: 'root' });
    // this.fileService.add({ name: 'File B', isFolder: false, parent: 'root' });
    ////this.fileService._get('/').then(() => this.updateFileElementQuery());
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
    this.imageFile = this.fileService._getURL('/'+this.currentPath+this.currentRoot.name);
    let photo = document.getElementById('photo_overlay');
    photo.style.display='';
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
    this.fileService._get('/'+this.currentPath).then((folderMap) => {
      this.fileElements = this.fileService.queryFolderMap();
      //console.log('this.currentPath',this.currentPath, this.fileElements);
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
