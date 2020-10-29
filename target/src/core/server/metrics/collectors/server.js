"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerMetricsCollector = void 0;
class ServerMetricsCollector {
    constructor(server) {
        this.server = server;
        this.requests = {
            disconnects: 0,
            total: 0,
            statusCodes: {},
        };
        this.responseTimes = {
            count: 0,
            total: 0,
            max: 0,
        };
        this.server.ext('onRequest', (request, h) => {
            this.requests.total++;
            request.events.once('disconnect', () => {
                this.requests.disconnects++;
            });
            return h.continue;
        });
        this.server.events.on('response', (request) => {
            const statusCode = request.response?.statusCode;
            if (statusCode) {
                if (!this.requests.statusCodes[statusCode]) {
                    this.requests.statusCodes[statusCode] = 0;
                }
                this.requests.statusCodes[statusCode]++;
            }
            const duration = Date.now() - request.info.received;
            this.responseTimes.count++;
            this.responseTimes.total += duration;
            this.responseTimes.max = Math.max(this.responseTimes.max, duration);
        });
    }
    async collect() {
        const connections = await new Promise((resolve) => {
            this.server.listener.getConnections((_, count) => {
                resolve(count);
            });
        });
        return {
            requests: this.requests,
            response_times: {
                avg_in_millis: this.responseTimes.total / Math.max(this.responseTimes.count, 1),
                max_in_millis: this.responseTimes.max,
            },
            concurrent_connections: connections,
        };
    }
    reset() {
        this.requests = {
            disconnects: 0,
            total: 0,
            statusCodes: {},
        };
        this.responseTimes = {
            count: 0,
            total: 0,
            max: 0,
        };
    }
}
exports.ServerMetricsCollector = ServerMetricsCollector;
