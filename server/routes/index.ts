/*
 * Part of RedELK
 *
 * BSD 3-Clause License
 *
 * Copyright (c) 2020, Lorenzo Bernardi
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *
 *     * Neither the name of the <organization> nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 *
 * Authors:
 * - Lorenzo Bernardi
 */

import {schema} from '@kbn/config-schema';
import {
  importSavedObjectsFromStream,
  IRouter,
  RequestHandlerContext,
  SavedObject,
  SavedObjectsClient,
  SavedObjectsImportResponse
} from '../../../../src/core/server';
import {asyncForEach, getRandomString} from '../helpers'
import fs from 'fs';
import {createSavedObjectsStreamFromNdJson} from '../../../../src/core/server/saved_objects/routes/utils';
import path from 'path';
import {IndexPattern} from 'src/plugins/data/public';
import {merge} from 'lodash';

const INDEX_PATTERN_REGEXP = /^redelk_kibana_index-pattern_(.*)\.ndjson/;
const INDEX_TEMPLATE_REGEXP = /^redelk_elasticsearch_template_(.*)\.json/;
const importSavedObject = async (filePath: string, context: RequestHandlerContext, objType: string) => {
  console.log('Importing ' + objType + ' [' + filePath + ']');
  const ds = fs.createReadStream(filePath);

  const result = await importSavedObjectsFromStream({
    typeRegistry: context.core.savedObjects.typeRegistry,
    savedObjectsClient: context.core.savedObjects.client,
    readStream: await createSavedObjectsStreamFromNdJson(ds),
    objectLimit: 10485760,
    overwrite: true,
    createNewCopies: false
  });

  return {
    type: objType,
    fileName: filePath,
    result: result
  };
}
const importIndexTemplate = async (filePath: string, context: RequestHandlerContext, templateName: string) => {
  console.log('Importing Elasticsearch index template ' + templateName + ' [' + filePath + ']');

  try {
    const tmpl: Buffer = fs.readFileSync(filePath);
    const callAsCurrentUser = context.core.elasticsearch.legacy.client.callAsCurrentUser;
    const tmplJson: object = JSON.parse(tmpl.toString());
    const result = await callAsCurrentUser('indices.putTemplate', {
      name: templateName,
      body: tmplJson
    })
    return {
      type: 'index-template',
      fileName: filePath,
      result: result
    }
  } catch (e) {
    console.error('Error import index-template: ' + templateName + ' [' + filePath + ']')
    console.error(e);
    return {
      type: 'index-template',
      fileName: filePath,
      result: e.message
    }
  }
}
const checkRtops = async (client: Pick<SavedObjectsClient, "get" | "delete" | "errors" | "create" | "bulkCreate" | "find" | "bulkGet" | "update" | "addToNamespaces" | "deleteFromNamespaces" | "bulkUpdate">) => {
  try {
    const rtops_ip: SavedObject<IndexPattern> = await client.get("index-pattern", "rtops");
    return rtops_ip !== undefined;
  } catch (e) {
    return false;
  }
}

export function defineRoutes(router: IRouter) {

  router.get(
    {
      path: '/api/redelk/ioc',
      validate: false,
    },
    async (context, request, response) => {
      console.log('Called');
      const asCurrentUser = context.core.elasticsearch.client.asCurrentUser;

      const catQuery = {
        index: 'rtops-*',
        q: 'event.type: "ioc"',
        format: 'json',
        size: 10000
      };
      const catHits = await asCurrentUser.search(catQuery);
      return response.ok({
        body: {
          response: catHits
        },
      });
    }
  );
  router.post(
    {
      path: '/api/redelk/ioc',
      validate: {
        body: schema.object({
          ioc: schema.object({
            type: schema.string(),
            domain: schema.string()
          }),
          file: schema.object({
            name: schema.string(),
            size: schema.string(),
            hash: schema.object({
              md5: schema.string()
            })
          }),
          c2: schema.object({
            message: schema.string()
          }),
          host: schema.object({
            name: schema.string()
          }),
          user: schema.object({
            name: schema.string()
          }),
          '@timestamp': schema.string()
        })
      }
    },
    async (context, request, response) => {
      console.log('Received request to create new IOC');
      const asCurrentUser = context.core.elasticsearch.client.asCurrentUser;
      let data = {
        event: {
          category: "host",
          kind: "event",
          module: "redelk",
          dataset: "c2",
          action: "ioc",
          type: "ioc"
        },
        c2: {
          log: {
            type: "ioc"
          }
        }
      }
      const query = {
        index: 'rtops-manual',
        id: getRandomString(),
        body: merge(data, request.body),
        format: 'json'
      };
      const catHits = await asCurrentUser.create(query);
      return response.ok({
        body: {
          response: catHits
        },
      });
    }
  );
  router.post(
    {
      path: '/api/redelk/iplists',
      validate: {
        body: schema.object({
          iplist: schema.object({
            ip: schema.string(),
            name: schema.string(),
            source: schema.string()
          }),
          '@timestamp': schema.string()
        })
      }
    },
    async (context, request, response) => {
      console.log('Received request to create new IP in IP lists');
      const asCurrentUser = context.core.elasticsearch.client.asCurrentUser;
      // Normalize IP (convert to CIDR if single IP)
      const cidr: RegExp = /\/[0-9]{1,2}$/;
      let ip: string = '';
      if (!cidr.test(request.body['iplist']['ip'])) {
        ip = request.body['iplist']['ip'] + '/32';
      } else {
        ip = request.body['iplist']['ip'];
      }
      const data = {
        iplist: {
          ip: ip,
          name: request.body['iplist']['name'],
          source: request.body['iplist']['source']
        },
        '@timestamp': request.body['@timestamp']
      }
      const query = {
        index: 'redelk-iplist-' + data['iplist']['name'],
        id: getRandomString(),
        body: data,
        format: 'json'
      };
      const catHits = await asCurrentUser.create(query);
      return response.ok({
        body: {
          response: catHits
        },
      });
    }
  );

  router.delete(
    {
      path: '/api/redelk/iplists',
      validate: {
        body: schema.arrayOf(
          schema.object({
            index: schema.string(),
            id: schema.string()
          })
        )
      }
    },
    async (context, request, response) => {
      console.log('Received request to delete IPs');
      const asCurrentUser = context.core.elasticsearch.client.asCurrentUser;
      const shards = {
        total: 0,
        successful: 0,
        failed: 0
      };
      await asyncForEach<Readonly<{ id: string, index: string }>>(request.body, async (doc) => {
        const res = await asCurrentUser.delete(doc);
        shards['total'] += res['body']['_shards']['total'];
        shards['successful'] += res['body']['_shards']['successful'];
        shards['failed'] += res['body']['_shards']['failed'];
        console.log('deleted', doc, res);
      });
      return response.ok({
        body: {
          response: {
            _shards: shards
          }
        },
      });
    }
  );

  router.get(
    {
      path: '/api/redelk/init',
      validate: false,
    },
    async (context, request, response) => {
      console.log('Checking RedELK initialization');
      const results: { type: string, fileName: string, result: SavedObjectsImportResponse | null | object }[] = [];
      try {
        const rtops_ip_exists = await checkRtops(context.core.savedObjects.client);
        // rtops-* index-pattern not found, initializing
        if (!rtops_ip_exists) {
          const templatesDir = path.join(__dirname, '../templates');
          const templatesFiles = fs.readdirSync(templatesDir);
          for (const tmpl of templatesFiles) {
            const match = tmpl.match(INDEX_PATTERN_REGEXP);
            if (match !== null) {
              results.push(await importSavedObject(path.join(templatesDir, match[0]), context, 'index-pattern'));
            }
            const matchIndexTemplate = tmpl.match(INDEX_TEMPLATE_REGEXP);
            if (matchIndexTemplate !== null) {
              results.push(await importIndexTemplate(path.join(templatesDir, matchIndexTemplate[0]), context, matchIndexTemplate[1]));
            }
          }
          results.push(await importSavedObject(path.join(templatesDir, 'redelk_kibana_search.ndjson'), context, 'search'));
          results.push(await importSavedObject(path.join(templatesDir, 'redelk_kibana_visualization.ndjson'), context, 'visualization'));
          results.push(await importSavedObject(path.join(templatesDir, 'redelk_kibana_dashboard.ndjson'), context, 'dashboard'));
        }

        return response.ok({
          body: {
            response: results
          },
        });
      } catch (e) {
        console.error(e);
        return response.internalError({
          body: e
        })
      }
    }
  );
}
