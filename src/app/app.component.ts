import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'app work22s!';
  private video;
  private canvas;
  private ctx;

  constructor() {

  }

  ngAfterViewInit() {
    this.canvas = document.getElementById('mycanvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.translate(this.canvas.width, 0);
    this.ctx.scale(-1, 1);
    navigator.getUserMedia({video: true, audio: false},
      (stream) => {
        this.video = document.getElementById('camera');
        this.video.srcObject = stream;
      },
      function(error) {}
    )
  }

  test = () => {
    const option = {
      title: 'test2',
      body: 'testest'
    };


    this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    console.log(this.title);
    new Notification('test', option);
  }
}
