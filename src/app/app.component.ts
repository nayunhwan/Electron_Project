import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements AfterViewInit {
  title = 'Angular2 Electron';

  public result: string;
  public faces;
  public gender = 'gender';
  public age: 'age';

  private video;
  private canvas;
  private ctx;

  constructor(private appService: AppService) {

  }

  ngAfterViewInit() {
    this.canvas = document.getElementById('mycanvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.translate(this.canvas.width, 0);
    this.ctx.scale(-1, 1);
    navigator.getUserMedia({ video: true, audio: false },
      (stream) => {
        this.video = document.getElementById('camera');
        this.video.srcObject = stream;
      },
      function (error) {
      }
    )
  }

  dataURLtoBlob(dataurl) {
    const arr = dataurl.split(','), mime = arr[ 0 ].match(/:(.*?);/)[ 1 ];
    const bstr = atob(arr[ 1 ]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[ n ] = bstr.charCodeAt(n);
    }
    return new Blob([ u8arr ], { type: 'application/octet-stream' });
  }

  test = () => {
    const option = {
      title: 'test2',
      body: ''
    };

    this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    const imgData = this.canvas.toDataURL('image/jpeg', 1.0);
    const blob = this.dataURLtoBlob(imgData);
    console.log(blob);
    const cognitiveURL = 'https://api.projectoxford.ai/vision/v1.0/analyze?visualFeatures=Description,Faces&language=en';
    const emotionURL = 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize';

    this.appService.postRequest(cognitiveURL, blob).subscribe((data) => {
      let n = 0;
      console.log('success');
      const resultJson = JSON.parse(data[ '_body' ]);
      console.log(resultJson);
      for (const caption of resultJson['description']['captions']){
        this.result = caption.text;
      }
      this.faces = resultJson['faces'];
      n = resultJson['faces'].length;
      for (const face of resultJson[ 'faces' ]) {
        console.log(face);
        const faceRect = face[ 'faceRectangle' ];
        this.ctx.strokeStyle = '#FF0000';
        this.ctx.strokeRect(640 - parseInt(faceRect[ 'left' ], 0) - parseInt(faceRect['width'], 0) , faceRect[ 'top' ],
          faceRect[ 'width' ], faceRect[ 'height' ]);
        // this.gender = face['gender'];
        // this.age = face['age'];
      }
      if (n > 0) {
        option.body = n + '명이 감지되었습니다';
      } else {
        option.body = '얼굴을 감지하지 못하였습니다.';
      }

      new Notification('test', option);
    });

    this.appService.emotionRequest(emotionURL, blob).subscribe((data) => {
      const resultJson = JSON.parse(data[ '_body' ]);
      console.log('success');
      console.log(resultJson);



    });
  }
}
