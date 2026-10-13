import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['playwright-report/', 'test-results/', 'node_modules/'] },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: { '@typescript-eslint/no-floating-promises': 'error' },
  },
);