#!/usr/bin/env node

/**
 * TeamSpec Init CLI
 * Bootstrap TeamSpec 2.0 Feature Canon operating model in any repository
 */

const { run } = require('../lib/cli');

run(process.argv.slice(2));
