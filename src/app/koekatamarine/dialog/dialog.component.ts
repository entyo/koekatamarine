import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  @Input() recording = false; 
  @Output() recordStart = new EventEmitter();
  @Output() recordPause = new EventEmitter();

  onMicClick () { 
    this.recording = !this.recording; 
    if (this.recording) { 
      this.recordStart.emit();
    } 
    else { 
      this.recordPause.emit();
    } 
  }
}
