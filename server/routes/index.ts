import {schema} from '@kbn/config-schema';
import {IRouter} from '../../../../src/core/server';
import {getRandomString} from '../helpers'

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
        }
      }
      const query = {
        index: 'rtops-manual',
        id: getRandomString(),
        body: Object.assign(data, request.body),
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
}
