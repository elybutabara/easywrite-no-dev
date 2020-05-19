const certificate = require("./../certificate/certificate.env")
process.env.APPLEID = certificate.APPLEID
process.env.APPLEIDPASS = certificate.APPLEIDPASS
const { notarize } = require('electron-notarize')
const log = require('electron-log')
exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename
  const options = {
    appBundleId: 'es.easywrite.easywrite',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS,
  }

  log.info(options)

  return await notarize(options).catch(function (err) {
    log.error(err)
  });
};
