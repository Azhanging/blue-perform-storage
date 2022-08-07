const package = require("./package");

//输出源
const output = {
  library: "BluePerformStorage",
  libraryTarget: "umd",
  libraryExport: "default",
};

module.exports = {
  library: {
    name: package.name,
    github: `https://github.com/azhanging/${package.name}`,
    date: `2016-${new Date().getFullYear()}`,
    version: package.version,
    author: package.author,
  },
  webpackConfig: {
    dev: {
      output,
    },
    prod: {
      output,
    },
  },
};
