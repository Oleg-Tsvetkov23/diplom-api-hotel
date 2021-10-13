/*
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayInit {

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: any) {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('chatToServer')
  handleMessage(client: Socket, message: { sender: string, room: string, message: string }) {
    this.wss.to(message.room).emit('chatToClient', message);
  }

  @SubscribeMessage('joinRoom')
  handleRoomJoin(client: Socket, room: string ) {
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleRoomLeave(client: Socket, room: string ) {
    client.leave(room);
    client.emit('leftRoom', room);
  }

}
*/

/*
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

const io = require("socket.io")({  allowEIO3: true });// false by default});

@WebSocketGateway(3001,{ transport: ['websocket'] })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  ws;

  handleConnection(client) {
    console.log(`Client connected: ${client.id}`);
    client.emit('connection', 'Successfully connected to server');
  }

  handleDisconnect(client) {
    client.emit('disconnection', 'Successfully disconnected on server');
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    console.log('------>',payload);
    this.ws.emit('msgToClient', payload);
  }

  
}
*/
/*
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";


@WebSocketGateway()
//@WebSocketGateway({cors:{origin :'http://localhost:3000', credentials: true, allowEIO3: true, transports: ['websocket', 'polling'],}})//{ cors: {origin:'http://localhost:3000'} })
export class ChatGateway {
  @WebSocketServer()
  server;

  handleConnection(client) {
    console.log(`Client connected: ${client.id}`);
    client.emit('connection', 'Successfully connected to server');
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    console.log("message",message)
    this.server.emit('message', message);
  }

}
*/
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, MessageBody } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({cors:{origin : true/*}*/, credentials: true}, allowEIO3: true, transports: ['websocket', 'polling']})
export class ChatGateway implements OnGatewayInit {

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: any) {
    console.log('init')
    this.logger.log('Initialized!');
  }

  handleConnection(client) {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('connection', 'Successfully connected to server');
  }

  handleDisconnect(client) {
    client.emit('disconnection', 'Successfully disconnected on server');
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string): void {
    console.log('------>',payload, client.id);
    console.log(client.handshake.headers.cookie)
    console.log(client.request)
    this.wss.emit('message', payload);
  }

  
  /*
  @SubscribeMessage('message')
  handleMessage1(client: Socket, @MessageBody() message: string): void {
    this.logger.log('client current',`${client}`)
    this.wss.emit('message', message);
  }

  @SubscribeMessage('chatToServer')
  handleMessage(client: Socket, message: { sender: string, room: string, message: string }) {
    this.wss.to(message.room).emit('chatToClient', message);
  }

  @SubscribeMessage('joinRoom')
  handleRoomJoin(client: Socket, room: string ) {
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleRoomLeave(client: Socket, room: string ) {
    client.leave(room);
    client.emit('leftRoom', room);
  }
  */

}

