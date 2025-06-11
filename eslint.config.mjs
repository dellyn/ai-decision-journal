import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "src/pages/**",
              from: "src/app/**",
              message: "Pages cannot import from app layer"
            },
            {
              target: "src/widgets/**",
              from: ["src/pages/**", "src/app/**"],
              message: "Widgets cannot import from pages or app layers"
            },
            {
              target: "src/features/**",
              from: ["src/widgets/**", "src/pages/**", "src/app/**", "src/features/**"],
              message: "Features cannot import from widgets, pages, app layers, or other features"
            },
            {
              target: "src/entities/**",
              from: ["src/features/**", "src/widgets/**", "src/pages/**", "src/app/**"],
              message: "Entities cannot import from features, widgets, pages, or app layers"
            },
            {
              target: "src/shared/**",
              from: ["src/entities/**", "src/features/**", "src/widgets/**", "src/pages/**", "src/app/**"],
              message: "Shared cannot import from any other layers"
            }
          ]
        }
      ]
    }
  }
];

export default eslintConfig;
