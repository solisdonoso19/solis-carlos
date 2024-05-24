(() => {
  const App = {
    elements: {
      form: document.getElementById("send"),
      redirectToRegister: document.getElementById("re-register"),
      BD: localStorage.getItem("BD")
        ? JSON.parse(localStorage.getItem("BD"))
        : { BD: [] },
    },
    init() {
      console.log(App.elements["BD"]);
      App.methods.validateSession();
      App.bindEvents();
    },
    bindEvents() {
      App.elements["form"].addEventListener("click", App.handlers.onSubmit);
      App.elements["redirectToRegister"].addEventListener(
        "click",
        App.handlers.redirectToRegister
      );
    },
    handlers: {
      onSubmit(e) {
        e.preventDefault();
        const user = {
          user: document.getElementById("user").value,
          pass: App.methods.encryptPass(document.getElementById("pass").value),
        };
        if (App.methods.formValidation(user)) {
          const u = App.methods.usernameExist(user.user, App.elements["BD"].BD);
          if (!u) {
            alert("Usuario Incorrecto");
          } else {
            App.methods.validatePass(user, u);
          }
        } else {
          alert("Llene todos los campos");
        }
      },
      redirectToRegister() {
        window.location.href = "/register.html";
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
      usernameExist(username, BD) {
        let exist = false;
        BD.forEach((e) => {
          if (e.user === username) {
            exist = e;
          }
        });
        return exist;
      },
      validatePass(user, userBD) {
        if (user.pass === userBD.pass) {
          sessionStorage.setItem("user", JSON.stringify(userBD));
          sessionStorage.setItem("validToken", true);
          window.location.href = "/home.html";
        } else {
          alert("Contraseña Incorrecta");
        }
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
