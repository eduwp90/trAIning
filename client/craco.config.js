const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#3D348B",
              "@link-color": "#66f3fa",
              "@success-color": "#7678ED",
              "@warning-color": "#F18701",
              "@error-color": "#F35B04",
              "@font-size-base": "14px",
              "@heading-color": "#F7B801",
              "@text-color": "#3D348B",
              "@text-color-secondary": "#F35B04",
              "@disabled-color": "rgba(0, 0, 0, 0.25)",
              "@border-radius-base": "15px",
              "@border-color-base": "#66f3fa",
              "@box-shadow-base":
                "0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)"
            },
            javascriptEnabled: true
          }
        }
      }
    }
  ]
};
