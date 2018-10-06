#!/usr/bin/env bash

esLintStatus=$($(sh eslint.sh >> /dev/null) || echo "Failed") >> /dev/null

if [ ! -z "${esLintStatus}" ]; then
    echo "Failed to eslint check. Run eslint.sh to see the details"

    exit 1
fi

./prettier.sh