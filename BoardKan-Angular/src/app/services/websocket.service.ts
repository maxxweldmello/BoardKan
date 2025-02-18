import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client;
  private serverUrl = 'http://localhost:8080/ws';
  private taskUpdates = new Subject<any>(); 

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.serverUrl),
      reconnectDelay: 5000, 
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log(str)
    });

    this.stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      this.subscribeToTasks();
    };

    this.stompClient.onStompError = (frame) => {
      console.error('WebSocket Error:', frame);
    };

    this.stompClient.onDisconnect = () => {
      console.log('Disconnected from WebSocket. Attempting to reconnect...');
      this.reconnect();
    };

    this.stompClient.activate();
  }

  private subscribeToTasks() {
    this.stompClient.subscribe('/topic/tasks', (message) => {
      console.log('Received WebSocket Task Update:', message.body);
      this.taskUpdates.next(JSON.parse(message.body));
    });
  }

  getTaskUpdates(): Observable<any> {
    return this.taskUpdates.asObservable();
  }

  sendMessage(destination: string, body: any) {
    if (this.stompClient.connected) {
      this.stompClient.publish({ destination: `/app/${destination}`, body: JSON.stringify(body) });
      console.log('Message sent:', body);
    } else {
      console.error('WebSocket is not connected. Message not sent.');
    }
  }

  closeConnection() {
    if (this.stompClient.connected) {
      this.stompClient.deactivate();
      console.log('WebSocket connection closed');
    } else {
      console.warn('WebSocket is already disconnected');
    }
  }

  reconnect() {
    if (!this.stompClient.connected) {
      console.log('Attempting to reconnect...');
      setTimeout(() => this.stompClient.activate(), 5000);
    }
  }
}
