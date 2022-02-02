const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#7678ED",
              "@link-color": "#3D348B",
              "@success-color": "#7678ED",
              "@warning-color": "#f538c9",
              "@error-color": "#f538c9",
              "@font-size-base": "14px",
              "@heading-color": "#f538c9",
              "@text-color": "#3D348B",
              "@text-color-secondary": "#7678ED",
              "@disabled-color": "rgba(0, 0, 0, 0.25)",
              "@border-radius-base": "8px",
              "@border-color-base": "rgba(0, 0, 0, 0.25)",
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
