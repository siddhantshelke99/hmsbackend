import { Server, Socket } from 'socket.io';

class SocketHelper {
    private io: any;
    private static instance: SocketHelper;
    private static sockets: any = [];
    public init(httpServer: any) {
        this.io = new Server(httpServer);
        this.io.on('connection', (socket: Socket) => {
            SocketHelper.sockets.push(socket.id);
            socket.on('message', (data: string) => {
                console.log(data);
            });
            socket.on('disconnect', () => {
                SocketHelper.sockets.map((skt, index) => {
                    if (skt === socket.id) {
                        SocketHelper.sockets.splice(index, 1);
                    }
                });
            });
        });
    }
    public emit(key: string, data: any) {
        this.io.emit(key, data);
    }

    public getConnections () {
        return SocketHelper.sockets;
    }

    public static getInstance(): SocketHelper {
        if (!SocketHelper.instance) {
            SocketHelper.instance = new SocketHelper();
        }
        return SocketHelper.instance;
    }

}
export default SocketHelper.getInstance();