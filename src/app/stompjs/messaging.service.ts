import { Injectable } from '@angular/core';

import {Http, Response} from "@angular/http";
import {Observable, Subject} from "rxjs";

import 'stompjs';


declare let Stomp:any;
var SockJS = require('sockjs-client');

@Injectable()
export class MessagingService {


  private stompClient;
  private stompMessage: Subject<any> = new Subject<any>();
  private stompConnectionStatus: Subject<any> = new Subject<any>();

  constructor(private http: Http) { }

  public connectMessaging(url: string) : any {
    let self = this;
    let webSocket = new SockJS(url);
    //If you do not want to use SockJS
    //Make sure you setup spring websocket config registry endpoint to not use sockJS
    //let webSocket = new WebSocket(url);
    this.stompClient = Stomp.over(webSocket);
    this.stompClient.debug = null;
    this.stompClient.connect({}, function (frame) {
      self.stompConnectionStatus.next(frame);
      self.stompClient.subscribe('/topic/messages', function (res) {
          self.stompMessage.next(JSON.parse(res.body));
      });
      return frame;
    });
  }

  public sendMessage(username: string, message: string) {
    this.stompClient.send("/add", {}, JSON.stringify({"username": username, "message": message}));
  }

  public getObservable(): Observable<any> {
    // return this.stompClient.asObservable();
    return this.stompMessage;
  }

  public getStatusObservable(): Observable<any> {
    return this.stompConnectionStatus;
  }

}
