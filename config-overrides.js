const { override, fixBabelImports, addLessLoader, useBabelRc } = require('customize-cra');
const path = require('path');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { hack: `true; @import "${path.resolve(__dirname, './src/assets/styles/my-antd-theme.less')}";` }
  }),
  useBabelRc()
);
