// @ts-check

import tseslint from "typescript-eslint";
import eslint from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import stylistic from "@stylistic/eslint-plugin"


// const eslintConfig = [
//     {
//         plugins: {"@stylistic": stylistic, "@next/next": nextPlugin},
//         files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
//         rules: {
//             "@stylistic/indent": ["error", 4],
//             "@stylistic/quotes": [2, "double"],
//         },
//     }
// ];


// ...nextPlugin.configs.recommended
export default tseslint.config({
    files: ["**/*.{mjs,ts,tsx}"],
    extends: [
        eslint.configs.recommended,
        tseslint.configs.recommended,
    ],
    plugins: {"@stylistic": stylistic, "@next/next": nextPlugin},
    rules: {
        "@stylistic/indent": ["error", 4],
        "@stylistic/quotes": [2, "double"],
    },
});
