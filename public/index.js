class ChatBot {
  static init({ orgId }) {
    const iframe = document.createElement("iframe");
    const apiHost = "http://as84c4084sc4o8w8g80cs8wo.95.216.217.154.sslip.io/"
    iframe.src = `${apiHost}/?orgId=${orgId}`;
    iframe.style = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 350px;
          height: 500px;
          border: none;
          z-index: 9999;
        `;
    document.body.appendChild(iframe);
  }
}

// Make available both as ESM and global variable
export default ChatBot;
if (typeof window !== "undefined") window.ChatBot = ChatBot;
