const gulp = require('gulp');
const gutil = require('gulp-util');
const ftp = require('vinyl-ftp');
const minimist = require('minimist');
const fs = require('fs');
const path = require('path');

function deploy(cb) {
  const args = minimist(process.argv.slice(2), {
    string: ['ev', 'root'],
  });

  const fileName = 'deployrc';
  const extnames = ['.js', '.cjs'];

  let ftpConfigPath;

  extnames.some((extname) => {
    const absolutePath = path.resolve(args.root, fileName + extname);
    const hasConfig = fs.existsSync(absolutePath);
    if (hasConfig) {
      ftpConfigPath = absolutePath;
    }
    return hasConfig;
  });

  if (!ftpConfigPath) {
    console.error('No deployrc found');
    cb();
  }

  const ftpConfig = require(ftpConfigPath);

  const option = ftpConfig.env[args.ev];

  const conn = ftp.create({
    host: option.host,
    user: option.user,
    password: option.password,
    port: option.port,
    parallel: option.parallel || 3,
    log: ftpConfig.log && gutil.log,
  });

  const distPath = path.resolve(args.root, option.distPath);
  const remotePath = option.remotePath;
  const base = path.resolve(args.root, option.base || ftpConfig.base);

  return gulp.src(distPath, { base: base, buffer: false }).pipe(conn.newer(remotePath)).pipe(conn.dest(remotePath));
}

exports.ftpDeploy = deploy;
