import { argv, exit } from 'node:process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { execa } from 'execa';

function parseArgs() {
  const args = argv.slice(2);
  const result: { slug?: string } = {};

  for (const arg of args) {
    if (arg.startsWith('--slug=')) {
      result.slug = arg.split('=')[1];
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      exit(0);
    }
  }

  return result;
}

function printHelp() {
  console.log(`Usage: npm run build:page -- --slug=<slug>`);
  console.log('If --slug is omitted the full site will be built.');
}

async function run() {
  const { slug } = parseArgs();
  const env = { ...process.env };
  let message = 'Building entire site...';

  if (slug) {
    env.ONLY_PAGE = slug;
    message = `Building single page for slug: ${slug}`;
  }

  console.log(message);
  const astroBin = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'node_modules', '.bin', 'astro');
  const subprocess = execa(astroBin, ['build'], {
    stdio: 'inherit',
    env
  });

  await subprocess;
  console.log('Build finished successfully.');
}

run().catch((error) => {
  console.error(error);
  exit(1);
});
