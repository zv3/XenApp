#!/usr/bin/env bash

set -e

esLintStatus=$($(./node_modules/.bin/eslint ./src/ >> /dev/null) || echo "Failed") >> /dev/null

if [[ ! -z "${esLintStatus}" ]]; then
    echo "Failed to eslint check. Run eslint.sh to see the details"

    exit 1
fi

echo "eslint => ok"

exec ./node_modules/.bin/prettier \
    --config ./.prettierrc \
    --write ./src/**/*.js