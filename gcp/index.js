import Fastify from 'fastify';
import fetch from 'node-fetch';

const fastify = Fastify({ logger: true });

fastify.post('/', async (request, reply) => {
  const { callbackUrl = undefined } = request.body;
  if (!callbackUrl) throw new Error('Invalid body');

  const body = {
    message: 'from worker',
  };
  const response = await fetch(callbackUrl, {
    method: 'post',
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Fetch failed: url=${callbackUrl}, response.status=${response.status}`);
  }

  reply.code(204).send();
});

const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 8080, '0.0.0.0');
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}
start();
