import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';

export default [
  { ignores: ['dist', 'node_modules', 'pnpm-lock.yaml', '.eslintrc.cjs', 'postcss.config.cjs', 'scripts/**', 'temp/**'] },
  js.configs.recommended,
  ...tseslint.configs['flat/recommended'],
  prettier,
];
