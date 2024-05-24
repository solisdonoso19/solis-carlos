(() => {
  const App = {
    elements: {
      form: document.getElementById("send"),
      redirectToLogin: document.getElementById("re-login"),
      BD: localStorage.getItem("BD")
        ? JSON.parse(localStorage.getItem("BD"))
        : { BD: [] },
    },
    init() {
      App.bindEvents();
      App.methods.validateSession();
    },
    bindEvents() {
      App.elements["form"].addEventListener("click", App.handlers.onSubmit);
      App.elements["redirectToLogin"].addEventListener(
        "click",
        App.handlers.redirectToLogin
      );
    },
    handlers: {
      onSubmit(e) {
        e.preventDefault();
        const item = {
          name: document.getElementById("name").value,
          user: document.getElementById("user").value,
          pass: App.methods.encryptPass(document.getElementById("pass").value),
        };
        if (App.methods.formValidation(item)) {
          App.methods.addToLocalBD(item);
        } else {
          alert("Llene todos los campos");
        }
      },
      redirectToLogin() {
        window.location.href = "/index.html";
      },
    },
    methods: {
      formValidation(i) {
        let isValid = true;
        Object.keys(i).forEach((key) => {
          if (i[key] === "" || i[key] === 0) {
            isValid = false;
          }
        });
        return isValid;
      },
      encryptPass(p) {
        let hash = 0;
        for (let i = 0, len = p.length; i < len; i++) {
          let chr = p.charCodeAt(i);
          hash = (hash << 5) - hash + chr;
          hash |= 0;
        }
        return hash;
      },
      addToLocalBD(i) {
        if (!App.methods.usernameExist(i.user, App.elements["BD"].BD)) {
          id = App.elements["BD"].BD.length;
          user = { ...i, id: id + 1 };
          App.elements["BD"].BD.push(user);
          localStorage.setItem("BD", JSON.stringify(App.elements["BD"]));
          App.handlers.redirectToLogin();
        } else {
          alert("El username ya existe, escoja otro");
        }
      },
      usernameExist(username, BD) {
        let exist = false;
        BD.forEach((e) => {
          if (e.user === username) {
            exist = true;
          }
        });
        return exist;
      },
      validateSession() {
        if (sessionStorage.getItem("validToken")) {
          window.location.href = "/home.html";
        }
      },
    },
  };
  App.init();
})();
