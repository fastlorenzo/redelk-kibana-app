"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineRoutes = void 0;
const config_schema_1 = require("@kbn/config-schema");
const helpers_1 = require("../helpers");
function defineRoutes(router) {
    router.get({
        path: '/api/redelk/indices',
        validate: false,
    }, async (context, request, response) => {
        console.log('Called');
        const callAsCurrentUser = context.core.elasticsearch.legacy.client.callAsCurrentUser;
        const catQuery = {
            format: 'json',
            h: 'health,status,index,uuid,pri,rep,docs.count,sth,store.size',
            expand_wildcards: 'hidden,all'
        };
        const catHits = await callAsCurrentUser('transport.request', {
            method: 'GET',
            path: '/_cat/indices',
            query: catQuery
        });
        return response.ok({
            body: {
                response: catHits
            },
        });
    });
    router.get({
        path: '/api/redelk/ioc',
        validate: false,
    }, async (context, request, response) => {
        console.log('Called');
        const callAsCurrentUser = context.core.elasticsearch.legacy.client.callAsCurrentUser;
        const catQuery = {
            index: 'rtops-*',
            q: 'event.type: "ioc"',
            format: 'json',
            size: 10000
        };
        const catHits = await callAsCurrentUser('search', catQuery);
        return response.ok({
            body: {
                response: catHits
            },
        });
    });
    router.post({
        path: '/api/redelk/ioc',
        validate: {
            body: config_schema_1.schema.object({
                rtops: config_schema_1.schema.object({
                    type: config_schema_1.schema.string()
                }),
                file: config_schema_1.schema.object({
                    name: config_schema_1.schema.string(),
                    size: config_schema_1.schema.string(),
                    hash: config_schema_1.schema.object({
                        md5: config_schema_1.schema.string()
                    })
                }),
                c2: config_schema_1.schema.object({
                    message: config_schema_1.schema.string()
                }),
                host: config_schema_1.schema.object({
                    name: config_schema_1.schema.string()
                }),
                user: config_schema_1.schema.object({
                    name: config_schema_1.schema.string()
                }),
                '@timestamp': config_schema_1.schema.string()
            })
        }
    }, async (context, request, response) => {
        console.log('Received request to create new IOC');
        const callAsCurrentUser = context.core.elasticsearch.legacy.client.callAsCurrentUser;
        // return response.ok({
        //   body: request.body
        // })
        let data = {
            event: {
                category: "host",
                kind: "event",
                module: "redelk",
                dataset: "c2",
                action: "ioc",
                type: "ioc"
            }
        };
        const query = {
            index: 'rtops-manual',
            id: helpers_1.getRandomString(),
            body: Object.assign(data, request.body),
            format: 'json'
        };
        const catHits = await callAsCurrentUser('create', query);
        return response.ok({
            body: {
                response: catHits
            },
        });
    });
}
exports.defineRoutes = defineRoutes;
