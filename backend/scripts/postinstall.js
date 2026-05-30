if (!process.env.VERCEL) {
  try {
    require('child_process').execSync('npx playwright install chromium', { stdio: 'inherit' });
  } catch (e) {
    // playwright install failed — non-fatal
  }
}
