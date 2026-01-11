#!/usr/bin/env node

/**
 * TeamSpec Init CLI
 * Bootstrap TeamSpec 4.0 Product-Canon operating model in any repository
 */

const { run } = require('../lib/cli');

run(process.argv.slice(2));
