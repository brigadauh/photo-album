import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent implements OnInit {
  @Input() filename;
  img:any;
  constructor() {}

  ngOnInit() {}
  photoClose(){
    let photo = document.getElementById('photo_overlay');
    photo.style.display='none';
  }

}
