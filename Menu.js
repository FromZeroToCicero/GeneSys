function createMenuTemplate(isMac, isDev) {
  return [
    ...(isMac ? [{ role: "appMenu" }] : []),
    {
      role: "fileMenu",
    },
    ...(isDev
      ? [
          {
            label: "Developer",
            submenu: [{ role: "reload" }, { role: "forcereload" }, { type: "separator" }, { role: "toggledevtools" }],
          },
        ]
      : []),
  ];
}

module.exports = { createMenuTemplate };
