import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {
  private title = 'Electron with Angular2';
  private subTitle = 'This app was made for Electron Angular Example';

  @ViewChild('camera') video;
  @ViewChild('myCanvas') canvas;
  private ctx;

  private description;
  private faces;

  constructor(private appService: AppService) {}

  ngAfterViewInit() {
    const _video = this.video.nativeElement;
    const _canvas = this.canvas.nativeElement;

    // ctx 초기화
    this.ctx = _canvas.getContext('2d');

    // ctx 좌우 반전
    this.ctx.translate(_canvas.width, 0);
    this.ctx.scale(-1, 1);

    navigator.getUserMedia({video: true, audio: false},
      (stream) => {
        // this.video = document.getElementById('camera');
        // this.video.srcObject = stream;
        _video.srcObject = stream;

      },
      (error) => {
        console.log('Error' + error);
      }
    );
  }

  dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(','), mime = arr[ 0 ].match(/:(.*?);/)[ 1 ];
    const bstr = atob(arr[ 1 ]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[ n ] = bstr.charCodeAt(n);
    }
    return new Blob([ u8arr ], { type: 'application/octet-stream' });
  }

  takePhoto = () => {
    const _video = this.video.nativeElement;
    const _canvas = this.canvas.nativeElement;

    this.ctx.drawImage(_video, 0, 0, _canvas.width, _canvas.height);
    new Notification('캡쳐 완료', {body: '캡쳐가 완료되었습니다.'});

    // canvas의 바이너리를 blob으로 변환
    const imgData = _canvas.toDataURL('image/jpeg', 1.0);
    const blob = this.dataURLtoBlob(imgData);

    const faceURL = 'https://api.projectoxford.ai/vision/v1.0/analyze?visualFeatures=Description,Faces&language=en';
    const emotionURL = 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize';

    const faceKey = 'c8a88151c9c84934aef42a17c161eb5f';
    const emotionKey = 'c73ae0c7b3054f2e9578c20630e76ef3';

    this.appService.postRequest(faceURL, faceKey, blob).subscribe((data) => {
      const resultJson = JSON.parse(data['_body']);
      console.log(resultJson);
      this.faces = resultJson['faces'];

      this.description = resultJson['description']['captions'][0]['text'];
      for (const face of resultJson['faces']) {
        const faceRect = face['faceRectangle'];
        this.ctx.strokeStyle = '#FF0000';
        this.ctx.strokeRect(640 - parseInt(faceRect[ 'left' ], 0) - parseInt(faceRect['width'], 0) , faceRect[ 'top' ],
          faceRect[ 'width' ], faceRect[ 'height' ]);
      }

      const n = resultJson['faces'].length;
      if(n > 0){
        new Notification('얼굴 인식 완료', {body: n + '명의 얼굴을 표시하였습니다.'});
      }
      else {
        new Notification('얼굴 인식 실패', {body: '얼굴을 찾지 못하였습니다.'});
      }

    });

    this.appService.postRequest(emotionURL, emotionKey, blob).subscribe((data) => {
      const resultJson = JSON.parse(data['_body']);
      console.log(resultJson);
    });
  }

  clickFunction = () => {
    alert('Click!');
  }
}
