// ✅ Handle BOTH forms
document.querySelectorAll("form").forEach((form) => {

  // ✅ Skip other forms
  if (
    !form.id ||
    (form.id !== "contactForm" && form.id !== "BottomForm")
  ) return;

  // ✅ Fields Configuration with Custom CSS Hook Classes
  const fields = {
    name: {
      el: form.querySelector("[name='name']"),
      validate: (val) => val.trim().length >= 3,
      message: "Name must be at least 3 letters",
      cssClass: "name-error" // 🔥 Hook for your specific Name CSS
    },
    email: {
      el: form.querySelector("[name='email']"),
      validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      message: "Enter a valid email",
      cssClass: "email-error" // 🔥 Hook for your specific Email CSS
    },
    phone: {
      el: form.querySelector("[name='phone']"),
      validate: (val) =>
        val === "" || /^[6-9]\d{9}$/.test(val.replace(/\s+/g, "")),
      message: "Enter valid Indian phone number",
      cssClass: "phone-error" // 🔥 Hook for your specific Phone CSS
    },
    service: {
      el: form.querySelector("[name='service']"),
      validate: (val) => val.trim() !== "",
      message: "Please enter service",
      cssClass: "service-error" // 🔥 Hook for your specific Service CSS
    },
    message: {
      el: form.querySelector("[name='message']"),
      validate: (val) => val.trim().length >= 5,
      message: "Message must be at least 5 characters",
      cssClass: "message-error" // 🔥 Hook for your specific Message CSS
    }
  };

  // ✅ Single Validation Logic Engine
  function validateField(field) {
    // Fail-safe if element is missing from HTML template
    if (!field.el) return true;

    const value = field.el.value;
    let errorDiv = field.el.nextElementSibling;

    // Create error div dynamically if missing
    if (!errorDiv || !errorDiv.classList.contains("error-text")) {
      errorDiv = document.createElement("div");
      
      // 🔥 Assigns both general error wrapper and your explicit field class
      errorDiv.className = `error-text ${field.cssClass}`;

      field.el.parentNode.insertBefore(errorDiv, field.el.nextSibling);
    }

    // ✅ VALID STATE
    if (field.validate(value)) {
      field.el.classList.remove("input-error");
      field.el.classList.add("input-success");
      errorDiv.textContent = "";
      errorDiv.classList.remove("active");
      return true;
    }
    // ❌ INVALID STATE
    else {
      field.el.classList.add("input-error");
      field.el.classList.remove("input-success");
      errorDiv.textContent = field.message;
      errorDiv.classList.add("active");
      return false;
    }
  }

  // ✅ Live Input Typing Validation
  Object.values(fields).forEach((field) => {
    if (field.el) {
      field.el.addEventListener("input", () => {
        validateField(field);
      });
    }
  });

  // ✅ FORM SUBMIT TRIGGER
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    let isValid = true;

    // Run verification sequentially across active inputs
    Object.values(fields).forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    // Halt transmission if flags return failed
    if (!isValid) {
      alert("❌ Please fill the form correctly!");
      return;
    }

    // Capture Button Element State
    const btn = form.querySelector("button");
    const originalText = btn.innerText;
    btn.disabled = true;
    btn.innerText = "Sending...";

    // Construct Payload Body mapping
    const formData = {
      name: fields.name.el ? fields.name.el.value.trim() : "",
      email: fields.email.el ? fields.email.el.value.trim() : "",
      phone: fields.phone.el ? fields.phone.el.value.trim() : "",
      service: fields.service.el ? fields.service.el.value.trim() : "",
      message: fields.message.el ? fields.message.el.value.trim() : ""
    };

    try {
      // POST Request execution to remote Render engine
      const response = await fetch(
        "https://onrender.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      // Gracefully capture explicit 404 / 500 status blocks before json parse failures
      if (!response.ok) {
        throw new Error(`HTTP Error Status: ${response.status}`);
      }

      const result = await response.json();

      // ✅ TRANSMISSION SUCCESSFUL
      if (result.success) {
        alert("✅ Message sent successfully!");
        alert("We'll reach out within 24 hours 🤝");
        form.reset();

        // Reset styling indicators across layout inputs
        Object.values(fields).forEach((f) => {
          if (!f.el) return;
          f.el.classList.remove("input-success");
          f.el.classList.remove("input-error");
          const errorDiv = f.el.nextElementSibling;
          if (errorDiv && errorDiv.classList.contains("error-text")) {
            errorDiv.textContent = "";
            errorDiv.classList.remove("active");
          }
        });
      } else {
        alert(`❌ Failed to send message: ${result.message || 'Unknown error'}`);
      }

    } catch (error) {
      console.error("Frontend Submission Error Trace:", error);
      alert(`❌ Error submitting form: ${error.message}. Please check your connection or try again later.`);
    } finally {
      // ✅ RESTORE BUTTON STATE
      btn.disabled = false;
      btn.innerText = originalText;
    }
  });

});
