(() => {
  const App = {
    elements: {
      user: sessionStorage.getItem("user")
        ? JSON.parse(sessionStorage.getItem("user"))
        : null,
      userName: document.getElementById("nav-user-name"),
      profile: document.getElementById("profile"),
      graph: document.getElementById("graph"),
      form: document.getElementById("send"),
      table: document.getElementById("table-body"),
      BD: localStorage.getItem("BD2")
        ? JSON.parse(localStorage.getItem("BD2"))
        : { BD: [] },
      dataTable: [],
    },
    init() {
      App.bindEvents();
      App.methods.validateSession();
      App.elements["userName"].textContent = App.elements["user"].name;
      App.methods.validateBD();
      App.templates.populateTable();
      console.log(App.elements["dataTable"]);
    },
    bindEvents() {
      App.elements["profile"].addEventListener(
        "click",
        App.handlers.goToProfile
      );
      App.elements["form"].addEventListener("click", App.handlers.onSubmit);
    },
    handlers: {
      goToProfile() {
        window.location.href = "profile.html";
      },
      onSubmit(e) {
        e.preventDefault();
        const item = {
          type: document.getElementById("type").value,
          description: document.getElementById("description").value,
          qty: document.getElementById("qty").value,
        };
        if (App.methods.formValidation(item)) {
          App.methods.addToLocalBD(item);
        } else {
          alert("Llene todos los campos");
        }
      },
    },
    templates: {
      populateTable() {
        const data = App.elements["dataTable"];
        if (data.length === 0) {
          App.elements["table"].innerHTML =
            '<tr><td colspan="4"><h1>No hay Datos</h1></td></tr>';
        } else {
          data.forEach((d) => {
            App.elements[
              "table"
            ].innerHTML += `<tr><td>${d.id}</td><td>${d.type}</td><td>${d.description}</td><td>${d.qty}</td></tr>`;
          });
        }
      },
    },
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
      validateBD() {
        if (
          !App.elements["BD"].BD.some(
            (e) => e.userId === App.elements["user"].id
          )
        ) {
          App.elements["BD"].BD.push({
            userId: App.elements["user"].id,
            registers: [],
          });
        }
        const index = App.elements["BD"].BD.findIndex(
          (item) => item.userId === App.elements["user"].id
        );
        App.elements["dataTable"] = App.elements["BD"].BD[index].registers;
      },
      addToLocalBD(i) {
        const index = App.elements["BD"].BD.findIndex(
          (item) => item.userId === App.elements["user"].id
        );
        const id = App.elements["BD"].BD[index].registers.length;
        const register = { ...i, id: id + 1 };
        App.elements["BD"].BD[index].registers.push(register);
        localStorage.setItem("BD2", JSON.stringify(App.elements["BD"]));
      },
    },
  };
  App.init();
})();
