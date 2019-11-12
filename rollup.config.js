import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'crel.js',
    output: {
        file: 'crel.mjs',
        format: 'esm'
    },
    plugins: [commonjs()]
};