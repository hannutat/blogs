module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jest/globals": true,
        "cypress/globals" : true
    },
    "extends": [ 
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react", "jest", "cypress"
    ],
    "rules": {
        "indent": [
            "warn",
            4  
        ],
        "linebreak-style": [
            "warn",
            "unix"
        ],
        "quotes": [
            "warn",
            "double"
        ],
        "semi": [
            "warn",
            "always"
        ],
        "eqeqeq": "warn",
        "no-trailing-spaces": "warn",
        "object-curly-spacing": [
            "warn", "always"
        ],
        "arrow-spacing": [
            "warn", { "before": true, "after": true }
        ],
        "no-console": 0,
        "react/prop-types": 0
    },
    "settings": {
      "react": {
        "version": "detect"
      }
    }
  }