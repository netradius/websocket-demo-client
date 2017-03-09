import { Injectable } from '@angular/core';

import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {Observable, Subject} from "rxjs";

import 'stompjs';


declare let Stomp:any;
var SockJS = require('sockjs-client');

@Injectable()
export class MessagingService {


  private stompClient;
  private stompMessage: Subject<any> = new Subject<any>();
  private stompConnectionStatus: Subject<any> = new Subject<any>();
  private pingMessage: Subject<any> = new Subject<any>();

  //Change the API_URL below depending on the environment
  private API_URL: string = "//" + window.location.hostname + "/api";
  // private API_URL: string = "//localhost:8080/api";

  constructor(private http: Http) { }

  public connectMessaging() : void {
    let self = this;
    let webSocket = new SockJS(this.API_URL + "/connect");
    //If you do not want to use SockJS
    //Make sure you setup spring websocket config registry endpoint to not use sockJS
    //and prepend your url string with ws://
    //let webSocket = new WebSocket(this.API_URL + "/connect");
    this.stompClient = Stomp.over(webSocket);
    this.stompClient.debug = null;
    this.stompClient.connect({}, function (frame) {
      self.stompConnectionStatus.next(frame);
      self.stompClient.subscribe('/topic/messages', function (res) {
          self.stompMessage.next(JSON.parse(res.body));
      });
    });
  }

  public disconnectMessaging(): any {
    let self = this;
    this.stompClient.disconnect(function() {
      self.stompConnectionStatus.next(null);
    });
  }

  public sendMessage(username: string, message: string) {
    this.stompClient.send("/add", {}, JSON.stringify({"username": username, "message": message}));
  }

  public sendPing(username: string): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.API_URL + "/ping", JSON.stringify({"username":username, "message":""}), options);
  }

  public getObservable(): Observable<any> {
    return this.stompMessage;
  }

  public getStatusObservable(): Observable<any> {
    return this.stompConnectionStatus;
  }

  public getPingObservable(): Observable<any> {
    return this.pingMessage;
  }

}
