'use strict'
const path = require('path')

const { Package } = require(path.join(__dirname, '..', 'models'))

class PackageController {
  static async getUserPackages (data) {
    let packages = await Package.query()
      .select('packages.id')
      .join('courses_taken', 'courses_taken.package_id', 'packages.uuid')
      .where('courses_taken.user_id', data.userId)
      .groupBy('packages.id')

    return packages
  }
}

module.exports = {
  PackageController
}
