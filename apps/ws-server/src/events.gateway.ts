import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'events',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-hospital')
  handleJoinHospital(client: Socket, hospitalId: string) {
    client.join(`hospital-${hospitalId}`);
    return { event: 'joined', data: hospitalId };
  }

  // Method to be called from other services via Redis/API
  sendAppointmentUpdate(hospitalId: string, data: any) {
    this.server.to(`hospital-${hospitalId}`).emit('appointment-updated', data);
  }

  sendQueueUpdate(hospitalId: string, data: any) {
    this.server.to(`hospital-${hospitalId}`).emit('queue-updated', data);
  }

  sendClinicalUpdate(hospitalId: string, data: any) {
    this.server.to(`hospital-${hospitalId}`).emit('clinical-updated', data);
  }
}

