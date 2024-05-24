(() => {
  const App = {
    elements: {
      user: sessionStorage.getItem("user")
        ? JSON.parse(sessionStorage.getItem("user"))
        : null,
      userName: document.getElementById("nav-user-name"),
      form: document.getElementById("send"),
      allowEdit: document.getElementById("allowEdit"),
      BD: localStorage.getItem("BD")
        ? JSON.parse(localStorage.getItem("BD"))
        : { BD: [] },
      profile: document.getElementById("profile"),
    },
    init() {
      App.methods.validateSession();
      App.bindEvents();
      console.log(App.elements["user"]);
      document.getElementById("name").value = App.elements["user"].name;
      document.getElementById("user").value = App.elements["user"].user;
      App.elements["userName"].textContent = App.elements["user"].name;
    },
    bindEvents() {
      App.elements["form"].addEventListener("click", App.handlers.onSubmit);
      App.elements["allowEdit"].addEventListener(
        "click",
        App.handlers.allowEdit
      );
      App.elements["profile"].addEventListener(
        "click",
        App.handlers.goToProfile
      );
    },
    handlers: {
      onSubmit(e) {
        // e.preventDefault();
        const item = {
          name: document.getElementById("name").value,
          user: document.getElementById("user").value,
          pass: App.methods.encryptPass(document.getElementById("pass").value),
        };
        const confirmPass = App.methods.encryptPass(
          document.getElementById("confirmPass").value
        );
        if (App.methods.formValidation(item)) {
          App.methods.addToLocalBD(item, confirmPass);
        } else {
          alert("Llene todos los campos");
        }
      },
      goToProfile() {
        window.location.href = "profile.html";
      },
      allowEdit() {
        const confirm = document.getElementById("confirm-pass");
        const name = document.getElementById("name");
        const user = document.getElementById("user");
        const pass = document.getElementById("pass");
        confirm.style.display = "flex";
        name.disabled = false;
        user.disabled = false;
        pass.disabled = false;
        App.elements["form"].style.visibility = "visible";
      },
    },
    templates: {},
    methods: {
      validateSession() {
        if (!sessionStorage.getItem("validToken")) {
          window.location.href = "index.html";
        }
      },
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
      updateItemById(array, id, updates) {
        const index = array.findIndex((item) => item.id === id);
        if (index !== -1) {
          array[index] = { ...array[index], ...updates };
          return array;
        }
        alert("Error intente nuevamente");
      },
      addToLocalBD(i, confirmPass) {
        if (App.elements["user"].pass === confirmPass) {
          const id = App.elements["user"].id;
          const user = { ...i, id: id };
          App.elements["BD"].BD = App.methods.updateItemById(
            App.elements["BD"].BD,
            id,
            user
          );
          console.log(App.elements["BD"].BD);
          localStorage.setItem("BD", JSON.stringify(App.elements["BD"]));
        } else {
          alert(
            "Introdujo la contraseña actual incorrecta, intente nuevamente"
          );
        }
      },
    },
  };
  App.init();
})();
