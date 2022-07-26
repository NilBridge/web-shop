const sqlite = require('better-sqlite3');
const db = new sqlite('./database.sqlite', { verbose: console.log });

module.exports = {db};

require('./utils');

