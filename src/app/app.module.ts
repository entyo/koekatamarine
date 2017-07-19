import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { SpeechRecognitionService } from "./speech-recognition.service";
import { KoekatamarineComponent } from './koekatamarine/koekatamarine.component';
import { DialogComponent } from './koekatamarine/dialog/dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    KoekatamarineComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [SpeechRecognitionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
