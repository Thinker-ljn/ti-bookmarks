import { Packet } from './core/types';
import { AxiosError } from 'axios';
import { message } from 'antd';

export default function errorHandler (packet: Packet<AxiosError>) {
  // console.info(packet)
  const errorMessage = packet.status + ':' + (typeof packet.data === 'string') ? packet.data : packet.data.message
  message.error(errorMessage)
}
