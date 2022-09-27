export default (form) => {
    const button = form.querySelector("button");
    
    ["click", "touchstart"].forEach(event => {
        button.addEventListener(event, async (e) => {
            e.preventDefault();
            const formData = new FormData(form);

            let noEmptyFields, allValid;

            for (let data of formData) {
                noEmptyFields = data[1] != "";
                if (data[0] == "email") {
                    const regexp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
                    allValid = regexp.test(data[1]);
                }
            }
            if (noEmptyFields && allValid) {
                const url = location.origin + "/.netlify/functions/mail";
                const params = {
                    method: "POST",
                    body: JSON.stringify(Object.fromEntries(formData))
                };

                const res = await fetch(url, params);
            }
        })
    })
}