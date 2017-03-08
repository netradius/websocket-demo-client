import {Component, Input} from '@angular/core';
import {MessagingService} from "./stompjs/messaging.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [MessagingService],
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private messagingService: MessagingService) { }

  connectMessaging(): void {
    let host = window.location.hostname;
    //Comment this out if you are running in production
    this.messagingService.connectMessaging("//localhost:8080/api/connect");
    //Uncomment this if you are running in production
    //this.messagingService.connectMessaging("//" + host + "/api/connect");

    this.connectionSubscription = this.messagingService.getStatusObservable().subscribe(status => {
      if (status && status.command === "CONNECTED") {
        this.connected = true;
        if (this.username === "") {
          this.username = "Guest"
        }
        this.messages += status.command + " as " + this.username + "\n";

      } else {
        this.connected = false;
        this.messages += "Disconnected\n";
      }
    });
    this.messagingService.getObservable().subscribe(payload => {
      this.message = "";
      this.messages += payload.username + " (" + this.formatDateTime(new Date(payload.dateTime))  + "): " + payload.message + "\n";
    });
  }

  disconnectMessaging(): void {
    this.messagingService.disconnectMessaging();
    this.connectionSubscription.unsubscribe();

  }

  sendMessage():void {
    this.messagingService.sendMessage(this.username, this.message);
  }

  private formatDateTime(date: Date):string {
    return date.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
  }

  title = 'WebSocket demo: A simple messaging app';
  username:string = "";
  message: string = "";
  messages:string = "";
  connected:boolean = false;
  connectionSubscription: any;
}
