import { Http2Proxy } from "./lib/Http2-Proxy.js";
const Proxy = new Http2Proxy();
Proxy.listen(process.env.PORT || 8080);
