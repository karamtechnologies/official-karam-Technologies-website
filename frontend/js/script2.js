//  hamburger menu
 
 function toggleMenu() {
      document.getElementById("mobileMenu").classList.toggle("active");
    }

    // contact form sending to owner 

(function () {
  emailjs.init("MlU6Lgl9xi2nVCPBi");
})();

// ✅ Handle BOTH forms
document.querySelectorAll("form").forEach((form) => {

  // Skip if not your forms
  if (!form.id || (form.id !== "contactForm" && form.id !== "BottomForm")) return;

  // Fields (SAFE selection inside form)
  const fields = {
    name: {
      el: form.querySelector("[name='name']"),
      validate: (val) => val.trim().length >= 3,
      message: "Name must be at least 3 letters"
    },
    email: {
      el: form.querySelector("[name='email']"),
      validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      message: "Enter a valid email"
    },
    phone: {
      el: form.querySelector("[name='phone']"),
      validate: (val) => val === "" || /^[6-9]\d{9}$/.test(val.replace(/\s+/g, "")),
      message: "Enter valid Indian phone number"
    },
    service: {
      el: form.querySelector("[name='service']"),
      validate: (val) => val !== "",
      message: "Please select / enter service"
    },
    message: {
      el: form.querySelector("[name='message']"),
      validate: (val) => val.trim().length >= 5,
      message: "Message must be at least 5 characters"
    }
  };

  // Validate field
  // function validateField(field) {
  //   const value = field.el.value;
  //   const errorDiv = field.el.parentElement.querySelector(".error-text");

  //   if (field.validate(value)) {
  //     field.el.classList.remove("input-error");
  //     field.el.classList.add("input-success");
  //     if (errorDiv) errorDiv.classList.remove("active");
  //     return true;
  //   } else {
  //     field.el.classList.add("input-error");
  //     field.el.classList.remove("input-success");
  //     if (errorDiv) {
  //       errorDiv.textContent = field.message;
  //       errorDiv.classList.add("active");
  //     }
  //     return false;
  //   }
  // }
function validateField(field) {
  const value = field.el.value;

  // ✅ Find or create error div dynamically
  let errorDiv = field.el.nextElementSibling;

  if (!errorDiv || !errorDiv.classList.contains("error-text")) {
    errorDiv = document.createElement("div");
    errorDiv.className = "error-text";
    field.el.parentNode.insertBefore(errorDiv, field.el.nextSibling);
  }

  if (field.validate(value)) {
    field.el.classList.remove("input-error");
    field.el.classList.add("input-success");
    errorDiv.textContent = "";
    errorDiv.classList.remove("active");
    return true;
  } else {
    field.el.classList.add("input-error");
    field.el.classList.remove("input-success");
    errorDiv.textContent = field.message;
    errorDiv.classList.add("active");
    return false;
  }
}
  // Live validation
  Object.values(fields).forEach(field => {
    field.el.addEventListener("input", () => validateField(field));
  });

  // Submit
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;

    Object.values(fields).forEach(field => {
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) return;

    // EmailJS
    const parameters = {
      from_name: fields.name.el.value.trim(),
      email: fields.email.el.value.trim(),
      phone: fields.phone.el.value.trim(),
      service: fields.service.el.value.trim(),
      message: fields.message.el.value.trim()
    };

    const btn = form.querySelector("button");
    btn.disabled = true;
    btn.innerText = "Sending...";

    emailjs.send("service_gqm6w2f", "template_2awrjy3", parameters)
      .then(() => {
        alert("✅ Message sent successfully! ");
        alert("We'll reach out you within 24 hours, 🤝 Karam Technologies!");

        form.reset();
        btn.disabled = false;
        btn.innerText = "Send Message";

        Object.values(fields).forEach(f => {
          f.el.classList.remove("input-success");
        });
      })
      .catch((error) => {
        alert("❌ Failed to send message");
        console.log(error);
        btn.disabled = false;
        btn.innerText = "Send Message";
      });

  });

});

