export default (form) => {
  const loadingModal = document.querySelector("#contact .loading");
  const button = form.querySelector("button");

  ["click", "touchstart"].forEach((event) => {
    button.addEventListener(event, async (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      let noEmptyFields, allValid;

      for (let data of formData) {
        noEmptyFields = data[1] != "";
        if (data[0] == "email") {
          const regexp =
            /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
          allValid = regexp.test(data[1]);
        }
      }
      if (noEmptyFields && allValid) {
        const url = location.origin + "/.netlify/functions/mail";
        const params = {
          method: "POST",
          body: JSON.stringify(Object.fromEntries(formData)),
        };

        loadingModal.classList.remove("unshow");
        document.body.classList.add("noScroll");
        const status = (await fetch(url, params)).status;
        document.body.classList.remove("noScroll");
        loadingModal.classList.add("concluded");

        const message =
          status == 200
            ? "Mensagem enviada com sucesso! <br> Em breve entrarei em contato :)"
            : "Ocorreu um erro ao enviar a mensagem. Entre em contato diretamente com gscolombo404@gmail.com";

        const p = document.createElement("p");
        p.classList.add("return-message");
        p.innerHTML = message;

        Array.from(form.children).forEach((child) => (child.disabled = true));
        form.insertAdjacentElement("afterbegin", p);
      }
    });
  });
};
