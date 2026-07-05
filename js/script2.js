
// ✅ Handle BOTH forms
document.querySelectorAll("form").forEach((form) => {

  // ✅ Skip other forms
  if (
    !form.id ||
    (form.id !== "contactForm" && form.id !== "BottomForm")
  ) return;

  // ✅ Fields
  const fields = {

    name: {
      el: form.querySelector("[name='name']"),
      validate: (val) => val.trim().length >= 3,
      message: "Name must be at least 3 letters"
    },

    email: {
      el: form.querySelector("[name='email']"),
      validate: (val) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      message: "Enter a valid email"
    },

    phone: {
      el: form.querySelector("[name='phone']"),
      validate: (val) =>
        val === "" ||
        /^[6-9]\d{9}$/.test(val.replace(/\s+/g, "")),
      message: "Enter valid Indian phone number"
    },

    service: {
      el: form.querySelector("[name='service']"),
      validate: (val) => val.trim() !== "",
      message: "Please enter service"
    },

    message: {
      el: form.querySelector("[name='message']"),
      validate: (val) => val.trim().length >= 5,
      message: "Message must be at least 5 characters"
    }

  };

  // ✅ Validation Function
  function validateField(field) {

    const value = field.el.value;

    let errorDiv = field.el.nextElementSibling;

    // Create error div dynamically
    if (
      !errorDiv ||
      !errorDiv.classList.contains("error-text")
    ) {

      errorDiv = document.createElement("div");

      errorDiv.className = "error-text";

      field.el.parentNode.insertBefore(
        errorDiv,
        field.el.nextSibling
      );

    }

    // ✅ VALID
    if (field.validate(value)) {

      field.el.classList.remove("input-error");

      field.el.classList.add("input-success");

      errorDiv.textContent = "";

      errorDiv.classList.remove("active");

      return true;

    }

    // ❌ INVALID
    else {

      field.el.classList.add("input-error");

      field.el.classList.remove("input-success");

      errorDiv.textContent = field.message;

      errorDiv.classList.add("active");

      return false;

    }

  }

  // ✅ Live Validation
  Object.values(fields).forEach((field) => {

    if (field.el) {

      field.el.addEventListener("input", () => {

        validateField(field);

      });

    }

  });

  // ✅ FORM SUBMIT
  form.addEventListener("submit", async function (e) {

    e.preventDefault();

    let isValid = true;

    // ✅ Validate all fields
    Object.values(fields).forEach((field) => {

      if (!validateField(field)) {

        isValid = false;

      }

    });

    // ❌ Stop if invalid
    if (!isValid) {

      alert("❌ Please fill the form correctly!");

      return;

    }

    // ✅ Button State
    const btn = form.querySelector("button");

    const originalText = btn.innerText;

    btn.disabled = true;

    btn.innerText = "Sending...";

    // ✅ Form Data
    const formData = {

      name: fields.name.el.value.trim(),

      email: fields.email.el.value.trim(),

      phone: fields.phone.el.value.trim(),

      service: fields.service.el.value.trim(),

      message: fields.message.el.value.trim()

    };

    try {

      // ✅ POST Request to Backend
      const response = await fetch(
        "http://localhost:5000/send-email",
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(formData)

        }
      );

      const result = await response.json();

      // ✅ SUCCESS
      if (result.success) {

        alert("✅ Message sent successfully!");

        alert("We'll reach out within 24 hours 🤝");

        form.reset();

        // Remove all validation styles
        Object.values(fields).forEach((f) => {

          f.el.classList.remove("input-success");

          f.el.classList.remove("input-error");

          const errorDiv = f.el.nextElementSibling;

          if (
            errorDiv &&
            errorDiv.classList.contains("error-text")
          ) {

            errorDiv.textContent = "";

            errorDiv.classList.remove("active");

          }

        });

      }

      // ❌ FAILED
      else {

        alert("❌ Failed to send message");

      }

    }

    // ❌ SERVER / NETWORK ERROR
    catch (error) {

      console.log(error);

      alert("❌ Server error. Please try again later.");

    }

    // ✅ ALWAYS RUN
    finally {

      btn.disabled = false;

      btn.innerText = originalText;

    }

  });

});

