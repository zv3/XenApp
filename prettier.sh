#!/usr/bin/env bash

exec ./node_modules/.bin/prettier \
    --config ./.prettierrc \
    --write ./src/**/*.js