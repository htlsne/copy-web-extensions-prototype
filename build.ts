import * as chokidar from 'chokidar';
import { build } from 'esbuild';
import { promises as fs } from 'fs';
import path from 'path';

const watchFlag = process.argv.includes('--watch');

fs.mkdir('dist/popup');
fs.mkdir('dist/icons');

build({
  entryPoints: ['popup/index.tsx'],
  bundle: true,
  outdir: 'dist/popup',
});

if (watchFlag) {
  chokidar.watch('popup/popup.html').on('all', (event, path) => {
    console.log(event, path);
    fs.copyFile(path, 'dist/popup/popup.html');
  });
  chokidar.watch('manifest.json').on('all', (event, path) => {
    console.log(event, path);
    fs.copyFile(path, 'dist/manifest.json');
  });
  chokidar.watch('icons/*').on('all', (event, filepath) => {
    console.log(event, filepath);
    fs.copyFile(filepath, path.join('dist', path.basename(filepath)));
  });
} else {
  fs.copyFile('popup/popup.html', 'dist/popup/popup.html');
  fs.copyFile('manifest.json', 'dist/manifest.json');
  fs.cp('icons', 'dist/icons', { recursive: true });
}
