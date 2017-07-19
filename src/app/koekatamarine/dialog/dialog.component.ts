import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  recording = false; 
  micClass = ''; 
  @Output() recordStart = new EventEmitter();
  @Output() recordPause = new EventEmitter();

  onMicClick () { 
    this.recording = !this.recording; 
    if (this.recording) { 
      this.micClass = 'recording';
      this.recordStart.emit();
    } 
    else { 
      this.micClass = '';
      this.recordPause.emit();
    } 
  }
}
