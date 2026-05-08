import { Worker } from 'bullmq';

async function main() {
  const worker = new Worker('default', async (job) => {
    console.log('Processing job', job.name, job.data);
    return { ok: true };
  }, { connection: { host: process.env.REDIS_HOST || '127.0.0.1', port: Number(process.env.REDIS_PORT || 6379) } as any });

  worker.on('completed', (job) => console.log('Job completed', job.id));
  worker.on('failed', (job, err) => console.error('Job failed', job?.id, err));

  console.log('Worker started');
}

main().catch((e) => { console.error(e); process.exit(1); });
