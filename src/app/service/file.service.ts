import { Injectable } from '@angular/core';

import { v4 } from 'uuid';
import { FileElement } from '../file-explorer/model/element';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Headers, Http } from '@angular/http';
import { HttpParams, HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Subject, throwError } from 'rxjs';
import  { map } from 'rxjs/operators';

export interface IFileService {
  add(fileElement: FileElement);
  delete(id: string);
  update(id: string, update: Partial<FileElement>);
  queryInFolder(folderId: string): Observable<FileElement[]>;
  get(id: string): FileElement;
}

@Injectable()
export class FileService implements IFileService {
  allDataSubj = new Subject<any>();
  private folderMap = new Map<string, FileElement>();
  private serviceUrl = '/api/photo';  // URL to
  private querySubject: BehaviorSubject<FileElement[]>;
  private token: string = '';
  private fileDataChanged = new Subject<any>();

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }


  constructor(private http: Http, private httpAsObservable: HttpClient) {
    const url = window.location.href;
    if (url.indexOf('?') !== -1) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      this.token = httpParams.get('t');
      console.log('token', this.token);
    }
  }

  add(fileElement: FileElement) {
    fileElement.id = v4();
    this.folderMap.set(fileElement.id, this.clone(fileElement));
    return fileElement;
  }

  delete(id: string) {
    this.folderMap.delete(id);
  }

  update(id: string, update: Partial<FileElement>) {
    let element = this.folderMap.get(id);
    element = Object.assign(element, update);
    this.folderMap.set(element.id, element);
  }

//not in use
  queryInFolder(folderId: string) {
    const result: FileElement[] = [];
    this.folderMap.forEach(element => {
      if (element.parent === folderId) {
        result.push(this.clone(element));
      }
    });
    if (!this.querySubject) {
      this.querySubject = new BehaviorSubject(result);
    } else {
      this.querySubject.next(result);
    }
    return this.querySubject.asObservable();
  }
  ////////////////////////////////////

  queryFolderMap() {
    const result: FileElement[] = [];
    this.folderMap.forEach(element => {
        result.push(this.clone(element));
    });
    if (!this.querySubject) {
      this.querySubject = new BehaviorSubject(result);
    } else {
      this.querySubject.next(result);
    }
    return this.querySubject.asObservable();
  }
  getdataAsPromise(path): Promise<any> {
    return this.http.post(this.serviceUrl,{
      body: path,
      token: this.token
    })
    .toPromise()
    .then((response:any) => {
       this.folderMap = new Map<string, FileElement>();
       //console.log('response.data', response);
       let body=JSON.parse(response.text());
       if (body.status && body.status=='ok' && body.data) {
         body.data.map((item:any) =>{
           this.add({ name: item.name, isFolder: item.isFolder, parent: 'root' })
         });
         //console.log('folderMap', this.folderMap);
       }
       return this.folderMap;
     })
     .catch(this.handleError);
  }
  getdataAsObservable(path) {
    const httpHeaders = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.httpAsObservable.post(this.serviceUrl, {
        body: path,
        token: this.token
      })
    .pipe(map(r => {
       this.folderMap = new Map<string, FileElement>();
       // console.log('response.data', r['data']);

       if (r['status'] && r['status'] === 'ok' && r['data']) {
           r['data'].map((item:any) =>{
             this.add({ name: item.name, isFolder: item.isFolder, parent: 'root' })
           });
        // console.log('folderMap', this.folderMap);
       }
       return this.folderMap;
     }));
  }
  getURL(path) {
    return this.serviceUrl + '?t=' + this.token + '&p=' + encodeURIComponent(path);
  }
  renderFile(path):Promise<any> {
    return this.http.post(this.serviceUrl,{
      body: path
    })
    .toPromise()
    .then((response:any) => {
        return response;
    })
    .catch(this.handleError);
  }
  get(id: string) {
    return this.folderMap.get(id);
  }

  clone(element: FileElement) {
    return JSON.parse(JSON.stringify(element));
  }
  forceRefresh() {
    this.fileDataChanged.next(); // triggers change of an observable, subscription callback will fire
  }
}
