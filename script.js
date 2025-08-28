document.addEventListener("DOMContentLoaded", () => {
  console.log("External JS loaded!");

  // ✅ Click handlers for cards
  const cards = {
    "location-card": () =>
      window.open(
        "https://www.google.com/maps?q=Shashank+Dental+Clinic,+Sharavathi+Nagar,+Shimogga",
        "_blank"
      ),
    "mail-card": () =>
      (window.location.href = "mailto:drniranjanmurthy2410@gmail.com"),
    "call-card": () => (window.location.href = "tel:9845651302"),
    "instagram-card": () =>
      window.open("https://www.instagram.com/dentalclinic448", "_blank"),
  };

  Object.entries(cards).forEach(([id, handler]) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", handler);
  });

  // ✅ Scroll to booking form on "Book Now" button click
  const bookNowBtn = document.querySelector(".nav-btn");
  if (bookNowBtn) {
    bookNowBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const formSection = document.getElementById("booking");
      if (formSection) {
        formSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // ✅ Booking form submission
  const form = document.getElementById("booking-form");
  const confirmationMessage = document.getElementById("confirmation-message");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // collect form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch("http://localhost:3000/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          confirmationMessage.style.color = "green";
          confirmationMessage.style.display = "block";
          confirmationMessage.textContent =
            result.message || "✅ Booking submitted successfully!";
          form.reset();
        } else {
          confirmationMessage.style.color = "red";
          confirmationMessage.style.display = "block";
          confirmationMessage.textContent =
            result.error || "❌ Failed to submit booking.";
        }
      } catch (error) {
        confirmationMessage.style.color = "red";
        confirmationMessage.style.display = "block";
        confirmationMessage.textContent =
          "⚠️ Error submitting booking. Please try again later.";
        console.error("Booking error:", error);
      }
    });
  }
});
