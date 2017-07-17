import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css']
})
export class FrontComponent implements OnInit {
  allowedAction: string;

  constructor() { this.allowedAction = 'record'; }

  ngOnInit() {
  }

  onClick () {
    
  }

}
