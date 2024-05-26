(() => {
  const App = {
    elements: {
      user: sessionStorage.getItem("user")
        ? JSON.parse(sessionStorage.getItem("user"))
        : null,
      userName: document.getElementById("nav-user-name"),
      logout: document.getElementById("log-out"),
      profile: document.getElementById("profile"),
      entrada: document.getElementById("graph-entrada"),
      entradaPer: document.getElementById("entradas-per"),
      gastoPer: document.getElementById("gastos-per"),
      gasto: document.getElementById("graph-gasto"),
      form: document.getElementById("send"),
      table: document.getElementById("table-body"),
      home: document.getElementById("return-home"),
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
      App.templates.calculateGraph(App.elements["dataTable"]);
      console.log(App.elements["dataTable"]);
    },
    bindEvents() {
      App.elements["home"].addEventListener("click", App.handlers.goToHome);
      App.elements["profile"].addEventListener(
        "click",
        App.handlers.goToProfile
      );
      App.elements["form"].addEventListener("click", App.handlers.onSubmit);
      App.elements["logout"].addEventListener("click", App.handlers.logout);
    },
    handlers: {
      goToHome() {
        window.location.href = "home.html";
      },
      logout() {
        sessionStorage.clear();
        window.location.href = "index.html";
      },
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
        App.elements["table"].innerHTML = "";
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
      calculateGraph(data) {
        const totalEntrada = data.reduce((accumulator, d) => {
          if (d.type === "entrada") {
            console.log(d);
            return accumulator + parseInt(d.qty);
          }
          return accumulator;
        }, 0);
        const totalGasto = data.reduce((accumulator, d) => {
          if (d.type === "gasto") {
            return accumulator + parseInt(d.qty);
          }
          return accumulator;
        }, 0);
        const total = data.reduce((accumulator, d) => {
          return accumulator + parseInt(d.qty);
        }, 0);
        const percentageEntrada = (totalEntrada / total) * 100;
        const percentageGasto = (totalGasto / total) * 100;
        App.elements["entradaPer"].textContent = `${percentageEntrada.toFixed(
          2
        )}% - Total en dolares: B./${totalEntrada}`;
        App.elements["gastoPer"].textContent = `${percentageGasto.toFixed(
          2
        )}% - Total en dolares: B./${totalGasto}`;
        App.elements["entrada"].style.width =
          !isNaN(percentageEntrada) && percentageEntrada !== undefined
            ? `${percentageEntrada}%`
            : "0%";
        App.elements["gasto"].style.width =
          !isNaN(percentageGasto) && percentageGasto !== undefined
            ? `${percentageGasto}%`
            : "0%";
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
        document.getElementById("type").value = "";
        document.getElementById("description").value = "";
        document.getElementById("qty").value = "";
        App.methods.validateBD();
        App.templates.populateTable();
        App.templates.calculateGraph(App.elements["dataTable"]);
      },
    },
  };
  App.init();
})();
