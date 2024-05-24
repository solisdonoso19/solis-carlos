(() => {
  const App = {
    elements: {
      user: sessionStorage.getItem("user")
        ? JSON.parse(sessionStorage.getItem("user"))
        : null,
      userName: document.getElementById("nav-user-name"),
    },
    init() {
      App.methods.validateSession();
    },
    templates: {},
    methods: {
      validateSession() {
        if (!sessionStorage.getItem("validToken")) {
          window.location.href = "/index.html";
        }
      },
    },
  };
  App.init();
})();
