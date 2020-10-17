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

  const supportedTypes = context.core.savedObjects.typeRegistry
    .getImportableAndExportableTypes()
    .map((type) => type.name);

  const result = await importSavedObjectsFromStream({
    supportedTypes,
    savedObjectsClient: context.core.savedObjects.client,
    readStream: createSavedObjectsStreamFromNdJson(ds),
    objectLimit: 10485760,
    overwrite: true,
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
            type: schema.string()
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
