import { SubscriptionManager } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import schema from './schema';

const redisConnectionListener = (err) => {
  if (err) console.error(err); // eslint-disable-line no-console
  console.info('Succefuly connected to redis'); // eslint-disable-line no-console
};

// Docs on the different redis options
// https://github.com/NodeRedis/node_redis#options-object-properties
const redisOptions = {
  host: 'localhost',
  port: 6379,
  connect_timeout: 15000,
  enable_offline_queue: true,
  retry_unfulfilled_commands: true,
};

const pubsub = new RedisPubSub({
  connection: redisOptions,
  connectionListener: redisConnectionListener,
});

const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: {
    commentAdded: (options, args) => ({
      commentAdded: comment => comment.repository_name === args.repoFullName,
    }),
  },
});

export { subscriptionManager, pubsub };
