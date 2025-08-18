// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Bỏ qua thư mục build và lib
  { ignores: ['node_modules', 'dist', 'coverage'] },

  // ESLint cho JS
  eslint.configs.recommended,

  // ⚠️ Dùng bản KHÔNG type-checked để giảm noise
  ...tseslint.configs.recommended,

  // Cấu hình chung
  {
    languageOptions: {
      sourceType: 'commonjs',
      parserOptions: {
        // tắt type-aware linting để đỡ đỏ
        projectService: false,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      // Nới lỏng các rule hay vướng
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',

      // Stylistic (để Prettier xử lý, không báo lỗi ở ESLint)
      'comma-dangle': 'off',
      quotes: 'off',
      semi: 'off',
    },
  },

  // File test: cho phép thoáng hơn nữa
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
);
