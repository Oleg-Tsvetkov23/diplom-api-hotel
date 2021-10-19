import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, MessageBody } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SendMessageDto } from './chai.interface';

@WebSocketGateway({cors:{origin : true/*}*/, credentials: true}, allowEIO3: true, transports: ['websocket', 'polling']})
export class ChatGateway implements OnGatewayInit {

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: any) {
    this.logger.log('Initialized!');
  }

  handleConnection(client) {
    client.emit('connection', 'Successfully connected to server');
  }

  handleDisconnect(client) {
    client.emit('disconnection', 'Successfully disconnected on server');
  }

  @SubscribeMessage('messages')
  handleMessage(client: Socket, payload: string): void {
    this.wss.emit('message', payload);
  }

  @OnEvent('newMessage')
  handleNewMessage(message: SendMessageDto): void {
    console.debug('onEvent triggered', message);
/*
    let mess = {
      data : message.text,
    }
    this.wss.emit('message',mess);
    */

    this.wss.emit('message', {
      data: message.text,
    });
/*
    this.wss.to(message.supportRequest as string).emit('message', {
      author: message.author,
      text: message.text,
    });
    */
    console.debug('message sent');
  }
  
 /*
  @SubscribeMessage('chatToServer')
  handleMessage2(client: Socket, message: { sender: string, room: string, message: string }) {
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

