// scheduler.js
// Runs crawler daily using node-schedule and triggers parser to generate markdown.

const schedule = require('node-schedule');
const { exec } = require('child_process');

// Schedule: every day at 03:00 UTC (05:00 Jerusalem time)
const job = schedule.scheduleJob('0 3 * * *', () => {
  console.log('🔄 Running competitor crawler...');
  // Execute crawler.js – it will write markdown directly.
  exec('node crawler.js', { cwd: __dirname }, (err, stdout, stderr) => {
    if (err) {
      console.error('Crawler error:', err);
    } else {
      console.log(stdout);
      console.error(stderr);
      // Optionally you could trigger further processing here.
    }
  });
});

console.log('🕒 Scheduler started – next run at', job.nextInvocation());
