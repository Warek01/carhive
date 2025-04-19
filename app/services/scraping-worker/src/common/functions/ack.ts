import { RmqContext } from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';

// Acknowledge rabbitmq message
export const ack = (ctx: RmqContext): void => {
   const channel: Channel = ctx.getChannelRef();
   const msg = ctx.getMessage() as Message;
   channel.ack(msg);
};
