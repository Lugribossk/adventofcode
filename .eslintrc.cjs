module.exports = {
    root: true,
    env: {
        node: true,
        es2024: true
    },
    overrides: [
        {
            files: ["*.ts"],
            parser: "@typescript-eslint/parser",
            plugins: ["@typescript-eslint"],
            extends: [
                "eslint:recommended",
                "plugin:@typescript-eslint/recommended-type-checked",
                "plugin:@typescript-eslint/stylistic-type-checked",
                "prettier"
            ],
            parserOptions: {
                project: true,
                ecmaVersion: 2024,
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true
                }
            },
            rules: {
                eqeqeq: 2,
                "no-else-return": 2,
                "@typescript-eslint/array-type": 2,
                "@typescript-eslint/consistent-type-assertions": 2,
                "@typescript-eslint/consistent-type-definitions": [2, "type"],
                "@typescript-eslint/consistent-type-imports": [
                    2,
                    {
                        prefer: "type-imports",
                        fixStyle: "inline-type-imports"
                    }
                ],
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
                "@typescript-eslint/prefer-nullish-coalescing": 0,

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
