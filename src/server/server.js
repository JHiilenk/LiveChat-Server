// Compatibility shim: Render or older deploys may run `node src/server/server.js`.
// This forwards execution to the new `app/server.js` entrypoint.
try {
  require('../../app/server.js');
} catch (err) {
  console.error('Failed to start app/server.js from legacy shim:', err);
  process.exit(1);
}
