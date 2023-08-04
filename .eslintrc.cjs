module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  plugins: ['@typescript-eslint', 'jsdoc', 'eslint-plugin-tsdoc', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript'
  ],
  parser: '@typescript-eslint/parser',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  ignorePatterns: ['lib/', 'tests/temp/', 'pnpm-lock.yaml'],
  rules: {
    'jsdoc/check-access': 1, // Recommended
    'jsdoc/check-alignment': 1, // Recommended
    'jsdoc/check-examples': 0,
    'jsdoc/check-indentation': 1,
    'jsdoc/check-line-alignment': 1,
    'jsdoc/check-param-names': 1, // Recommended
    'jsdoc/check-property-names': 1, // Recommended
    'jsdoc/check-syntax': 1,
    'jsdoc/check-tag-names': 1, // Recommended
    'jsdoc/check-types': 1, // Recommended
    'jsdoc/check-values': 1, // Recommended
    'jsdoc/empty-tags': 1, // Recommended
    'jsdoc/implements-on-classes': 1, // Recommended
    'jsdoc/match-description': 1,
    'jsdoc/multiline-blocks': 1, // Recommended
    'jsdoc/no-bad-blocks': 1,
    'jsdoc/no-defaults': 1,
    'jsdoc/no-missing-syntax': 0,
    'jsdoc/no-multi-asterisks': 1, // Recommended
    'jsdoc/no-restricted-syntax': 0,
    'jsdoc/no-types': 1,
    'jsdoc/no-undefined-types': 1, // Recommended
    'jsdoc/require-asterisk-prefix': 1,
    'jsdoc/require-description': 1,
    'jsdoc/require-description-complete-sentence': 1,
    'jsdoc/require-example': 0,
    'jsdoc/require-file-overview': 0,
    'jsdoc/require-hyphen-before-param-description': 1,
    'jsdoc/require-jsdoc': [
      'error',
      {
        publicOnly: true, // only report exports
        require: {
          ArrowFunctionExpression: true,
          ClassDeclaration: true,
          ClassExpression: true,
          FunctionDeclaration: true,
          FunctionExpression: true,
          MethodDefinition: false
        },
        contexts: [
          'ArrowFunctionExpression',
          'ClassDeclaration',
          'ClassExpression',
          'ClassProperty',
          'FunctionDeclaration', // function
          'FunctionExpression',
          'MethodDefinition',
          'TSDeclareFunction', // function without body
          'TSEnumDeclaration',
          'TSInterfaceDeclaration',
          'TSModuleDeclaration', // namespace
          'TSTypeAliasDeclaration',
          'VariableDeclaration'
        ]
      }
    ],
    'jsdoc/require-param': 1, // Recommended
    'jsdoc/require-param-description': 1, // Recommended
    'jsdoc/require-param-name': 1, // Recommended
    'jsdoc/require-param-type': 0,
    'jsdoc/require-property': 1, // Recommended
    'jsdoc/require-property-description': 1, // Recommended
    'jsdoc/require-property-name': 1, // Recommended
    'jsdoc/require-property-type': 1, // Recommended
    'jsdoc/require-returns': 0,
    'jsdoc/require-returns-check': 1, // Recommended
    'jsdoc/require-returns-description': 1, // Recommended
    'jsdoc/require-returns-type': 0,
    'jsdoc/require-throws': 1,
    'jsdoc/require-yields': 1, // Recommended
    'jsdoc/require-yields-check': 1, // Recommended
    "jsdoc/tag-lines": ["error", "never", {
      "startLines": 1
    }],
    'jsdoc/valid-types': 1, // Recommended
    'tsdoc/syntax': 'warn',
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc' /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
          caseInsensitive: true /* ignore case. Options: [true, false] */
        },
        groups: ['builtin', 'external', 'parent', 'sibling', 'index']
      }
    ]
  }
}
