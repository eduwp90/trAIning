const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#2A9D8F",
              "@link-color": "#F4A261",
              "@success-color": "#264653",
              "@warning-color": "#E76F51",
              "@error-color": "#E76F51",
              "@font-size-base": "14px",
              "@heading-color": "#2A9D8F",
              "@text-color": "#747678",
              "@text-color-secondary": "#54585c",
              "@disabled-color": "rgba(0, 0, 0, 0.25)",
              "@border-radius-base": "5px",
              "@border-color-base": "#2A9D8F",
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
