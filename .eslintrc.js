module.exports = {
    root: true,
    env: {
        node: true,
        es2022: true
    },
    overrides: [
        {
            files: ["*.ts"],
            parser: "@typescript-eslint/parser",
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true
                },
                project: "./tsconfig.json"
            },
            plugins: ["@typescript-eslint"],
            extends: [
                "eslint:recommended",
                "plugin:@typescript-eslint/recommended",
                "plugin:@typescript-eslint/recommended-requiring-type-checking",
                "prettier"
            ],
            rules: {
                eqeqeq: 2,
                "no-else-return": 2,
                "@typescript-eslint/array-type": 2,
                "@typescript-eslint/consistent-type-assertions": 2,
                "@typescript-eslint/consistent-type-definitions": [2, "interface"],
                "@typescript-eslint/consistent-type-imports": "error",
                "@typescript-eslint/member-ordering": [
                    2,
                    {
                        default: ["static-field", "instance-field", "constructor", "instance-method"]
                    }
                ],
                "@typescript-eslint/naming-convention": [
                    2,
                    {
                        selector: "default",
                        format: ["camelCase"]
                    },
                    {
                        selector: "variable",
                        format: ["camelCase", "UPPER_CASE"]
                    },
                    {
                        selector: "variable",
                        types: ["function"],
                        format: ["camelCase", "PascalCase"]
                    },
                    {
                        selector: "variable",
                        modifiers: ["global", "const"],
                        types: ["boolean", "string", "number"],
                        format: ["UPPER_CASE"]
                    },
                    {
                        selector: "typeLike",
                        format: ["PascalCase"]
                    },
                    {
                        selector: ["interface", "typeAlias"],
                        format: ["PascalCase"],
                        custom: {
                            regex: "^I[A-Z][a-z]",
                            match: false
                        }
                    }
                ],
                "@typescript-eslint/no-empty-function": 0,
                "@typescript-eslint/no-explicit-any": 2,
                "@typescript-eslint/no-floating-promises": 0,
                "@typescript-eslint/no-non-null-assertion": 0,
                "@typescript-eslint/no-require-imports": 2,
                "@typescript-eslint/no-unused-vars": 0,
                "@typescript-eslint/prefer-optional-chain": 2,
                "@typescript-eslint/prefer-readonly": 2,
                "@typescript-eslint/prefer-regexp-exec": 0,
                "@typescript-eslint/restrict-template-expressions": 0,
                "@typescript-eslint/switch-exhaustiveness-check": 2,

                "no-constant-condition": 0,
                "no-restricted-syntax": [
                    "error",
                    {
                        selector: "TSEnumDeclaration",
                        message: "Use union type instead"
                    }
                ]
            }
        }
    ]
};
