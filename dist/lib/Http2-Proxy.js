import * as fs from "fs";
import * as http2 from "http2";
import * as net from "net";
import { URL } from "url";
const { NGHTTP2_REFUSED_STREAM, NGHTTP2_CONNECT_ERROR } = http2.constants;
export class Http2Proxy {
    constructor() {
        this.server = this.init();
    }
    init() {
        const server = http2.createSecureServer({
            key: fs.readFileSync('../localhost-privkey.pem'),
            cert: fs.readFileSync('../localhost-cert.pem')
        });
        server.on('stream', (stream, headers) => {
            console.log('st');
            if (headers[':method'] !== 'CONNECT') {
                stream.close(NGHTTP2_REFUSED_STREAM);
                return;
            }
            const auth = new URL(`tcp://${headers[':authority']}`);
            console.log(auth);
            const socket = net.connect(Number.parseInt(auth.port), auth.hostname, () => {
                console.log('net.');
                stream.respond();
                socket.pipe(stream);
                stream.pipe(socket);
            });
            socket.on("error", err => {
                console.log(err.message);
                stream.close(NGHTTP2_CONNECT_ERROR);
            });
        });
        return server;
    }
    listen(port) {
        this.server.listen(port);
    }
}
