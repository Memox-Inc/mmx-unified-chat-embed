(function () {
    window.initChatWidget = function ({ rootId, url }) {
      const root = document.getElementById(rootId);
      const iframe = document.createElement("iframe");
      iframe.src = url;
      iframe.style = `
      width: 100vw;
      height: 100vh;
      border: none;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
    `;
      root.appendChild(iframe);
    };
  })();
  