#!/usr/bin/env bash

set -e

_eslintStatus=$($(./node_modules/.bin/eslint ./src/ >> /dev/null) || echo "Failed") >> /dev/null

if [[ ! -z "${_eslintStatus}" ]]; then
    echo "Failed to eslint check. Please fix the following issues:"

    ./node_modules/.bin/eslint ./src/

    exit 1
fi

echo "eslint => ok"

exec ./node_modules/.bin/prettier \
    --config ./.prettierrc \
    --write ./src/**/*.js