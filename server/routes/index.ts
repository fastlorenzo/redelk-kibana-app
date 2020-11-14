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
import {getRandomString} from '../helpers'
import fs from 'fs';
import {createSavedObjectsStreamFromNdJson} from '../../../../src/core/server/saved_objects/routes/utils';
import path from 'path';
import {IndexPattern} from 'src/plugins/data/public';
import {merge} from 'lodash';

interface Hit {
  health: string;
  status: string;
  index: string;
  uuid: string;
  pri: string;
  rep: string;
  'docs.count': any;
  'store.size': any;
  sth: 'true' | 'false';
  hidden: boolean;
}

const INDEX_PATTERN_REGEXP = /^redelk_kibana_index-pattern_(.*)\.ndjson/;
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
      path: '/api/redelk/indices',
      validate: false,
    },
    async (context, request, response) => {
      console.log('Called');
      const callAsCurrentUser = context.core.elasticsearch.legacy.client.callAsCurrentUser;

      const catQuery = {
        format: 'json',
        h: 'health,status,index,uuid,pri,rep,docs.count,sth,store.size',
        expand_wildcards: 'hidden,all'
      };
      const catHits: Hit[] = await callAsCurrentUser('transport.request', {
        method: 'GET',
        path: '/_cat/indices',
        query: catQuery
      });
      return response.ok({
        body: {
          response: catHits
        },
      });
    }
  );
  router.get(
    {
      path: '/api/redelk/ioc',
      validate: false,
    },
    async (context, request, response) => {
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
      const catHits = await callAsCurrentUser('create', query);
      return response.ok({
        body: {
          response: catHits
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
      const results: { type: string, fileName: string, result: SavedObjectsImportResponse }[] = [];
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
