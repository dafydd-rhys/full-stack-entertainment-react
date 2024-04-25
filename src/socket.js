import { io } from "socket.io-client";
const socket = io('http://localhost:4');
export default socket;
