"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditTrailService = void 0;
const router_1 = require("../http/router");
const defaultAuditorFactory = {
    asScoped() {
        return {
            add() { },
            withAuditScope() { },
        };
    },
};
class AuditTrailService {
    constructor(core) {
        this.auditor = defaultAuditorFactory;
        this.auditors = new WeakMap();
        this.log = core.logger.get('audit_trail');
    }
    setup() {
        return {
            register: (auditor) => {
                if (this.auditor !== defaultAuditorFactory) {
                    throw new Error('An auditor factory has been already registered');
                }
                this.auditor = auditor;
                this.log.debug('An auditor factory has been registered');
            },
        };
    }
    start() {
        return {
            asScoped: (request) => {
                const key = router_1.ensureRawRequest(request);
                if (!this.auditors.has(key)) {
                    this.auditors.set(key, this.auditor.asScoped(request));
                }
                return this.auditors.get(key);
            },
        };
    }
    stop() { }
}
exports.AuditTrailService = AuditTrailService;
