import { Server } from "./src/server";
import { exec } from 'child_process';

class IndexClass {
    private serverInstance: Server;
    constructor() {
        this.serverInstance = new Server();
    }

    startServer() {
        this.serverInstance.listen();
    }

    

    executeCommand(path: string) {
        exec(`node ${path}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return;
            }
            console.log(`Success: ${stdout}`);
        });
    }
}

const indexServer = new IndexClass();
indexServer.startServer();

