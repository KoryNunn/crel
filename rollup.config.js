import commonjs from 'rollup-plugin-commonjs';
import buble from '@rollup/plugin-buble'

export default {
    input: 'crel.js',
    output: {
        file: 'crel.es.js',
        format: 'esm'
    },
    plugins: [commonjs(), buble()]
};
