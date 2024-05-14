const App = {
  init() {
    document
      .getElementById("send")
      .addEventListener("click", this.login.bind(this));
  },

  login(e) {
    e.preventDefault();
    const user = document.getElementById("user").value;
    const pass = document.getElementById("pass").value;

    if (user === "admin" && pass === "0000") {
      this.saveSession();
      this.sendToProfile();
    } else {
      alert("Credenciales incorrectas");
    }
  },

  saveSession() {
    sessionStorage.setItem("session", true);
  },

  sendToProfile() {
    window.location.href = "/profile.html";
  },
};

App.init();
