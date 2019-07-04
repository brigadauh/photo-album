import { Component, Input, Output, EventEmitter
  ,OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { FileElement } from './model/element';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material/dialog';
import { NewFolderDialogComponent } from './modals/newFolderDialog/newFolderDialog.component';
import { RenameDialogComponent } from './modals/renameDialog/renameDialog.component';

@Component({
  selector: 'file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent {
  public breakpoint: any;
  constructor(public dialog: MatDialog) {

  }

  @Input() fileElements: FileElement[];
  @Input() canNavigateUp: string;
  @Input() path: string;

  @Output() folderAdded = new EventEmitter<{ name: string }>();
  @Output() elementRemoved = new EventEmitter<FileElement>();
  @Output() elementRenamed = new EventEmitter<FileElement>();
  @Output() elementMoved = new EventEmitter<{ element: FileElement; moveTo: FileElement }>();
  @Output() navigatedDown = new EventEmitter<FileElement>();
  @Output() showFile = new EventEmitter<FileElement>();
  @Output() navigatedUp = new EventEmitter();
  ngOnInit() {
      if (window.innerWidth>=1200) this.breakpoint = 8;
      if (window.innerWidth>=800 && window.innerWidth<1200) this.breakpoint = 4;
      if (window.innerWidth>=400 && window.innerWidth<800) this.breakpoint = 2;
      if (window.innerWidth<400) this.breakpoint = 1;
      //console.log(window.innerWidth);
  }
  onResize(event) {
    if (window.innerWidth>=1200) this.breakpoint = 8;
    if (window.innerWidth>=800 && window.innerWidth<1200) this.breakpoint = 4;
    if (window.innerWidth>=400 && window.innerWidth<800) this.breakpoint = 2;
    if (window.innerWidth<400) this.breakpoint = 1;
    //console.log(window.innerWidth);
  }
  deleteElement(element: FileElement) {
    this.elementRemoved.emit(element);
  }

  navigate(element: FileElement) {
    //console.log('fileElements',this.fileElements);
    if (element.isFolder) {
      this.navigatedDown.emit(element);
    }
    else {
      this.showFile.emit(element);
    }
  }

  navigateUp() {
    this.navigatedUp.emit();
  }

  moveElement(element: FileElement, moveTo: FileElement) {
    this.elementMoved.emit({ element: element, moveTo: moveTo });
  }

  openNewFolderDialog() {
    let dialogRef = this.dialog.open(NewFolderDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.folderAdded.emit({ name: res });
      }
    });
  }

  openRenameDialog(element: FileElement) {
    let dialogRef = this.dialog.open(RenameDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        element.name = res;
        this.elementRenamed.emit(element);
      }
    });
  }

  openMenu(event: MouseEvent, viewChild: MatMenuTrigger) {
    event.preventDefault();
    viewChild.openMenu();
  }
}
