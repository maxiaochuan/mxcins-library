// import { join } from 'path';
import Debug from 'debug';
import { rollup, watch, InputOptions, OutputOptions } from 'rollup';

// plugins
// 2020-03-28 15:56:39 UNRESOLVED_IMPORT
import nodeResolve from '@rollup/plugin-node-resolve';
// 2020-03-28 16:07:28 for typescript
import typescript from 'rollup-plugin-typescript2';

const debug = Debug('mlib:rollup');

const OUTPUT_DIR = './dist';

export default async (opts: Record<string, any>) => {
  debug('input opts:\n%O', opts);

  const inputOptions: InputOptions = {
    input: './src/index.ts',
    plugins: [
      nodeResolve({
        preferBuiltins: true, // https://github.com/rollup/plugins/tree/master/packages/node-resolve/#preferbuiltins
      }),
      typescript({
        tsconfigDefaults: {
          compilerOptions: {
            declarationDir: OUTPUT_DIR,
            declaration: true,
          },
        },
      }),
    ],
  };

  const outputOptions: OutputOptions = {
    file: `${OUTPUT_DIR}/bundle.js`,
  };

  try {
    const bundle = await rollup(inputOptions);

    await bundle.write(outputOptions);

    if (opts.dev) {
      const watcher = watch({ ...inputOptions, output: outputOptions });
      watcher.on('event', evt => {
        debug('on watch event:\n%O', evt);
      });

      process.on('exit', () => watcher.close());
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
};
