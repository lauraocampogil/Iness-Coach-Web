// animation scroll
const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			entry.target.classList.add("show");
		} else {
			entry.target.classList.remove("show");
		}
	});
});

const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((el) => observer.observe(el));
// Tab functionality
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabBtns.forEach((btn) => {
	btn.addEventListener("click", () => {
		// Remove active class from all buttons and contents
		tabBtns.forEach((b) => b.classList.remove("active"));
		tabContents.forEach((content) => content.classList.remove("active"));

		// Add active class to clicked button
		btn.classList.add("active");

		// Show corresponding content
		const targetTab = btn.getAttribute("data-tab");
		document.getElementById(targetTab).classList.add("active");
	});
});
// FAQ functionality
document.addEventListener("DOMContentLoaded", function () {
	const faqItems = document.querySelectorAll(".faq-item");

	faqItems.forEach((item) => {
		const question = item.querySelector(".faq-question");

		question.addEventListener("click", () => {
			// Fermer les autres items ouverts
			faqItems.forEach((otherItem) => {
				if (otherItem !== item && otherItem.classList.contains("active")) {
					otherItem.classList.remove("active");
				}
			});

			// Toggle l'item cliqué
			item.classList.toggle("active");
		});
	});
});
// Service button functionality -> opens email client
document.addEventListener("DOMContentLoaded", function () {
	// Add click tracking for analytics (optional)
	const mailtoLinks = document.querySelectorAll('a[href^="mailto:"]');

	mailtoLinks.forEach((link) => {
		link.addEventListener("click", function (e) {
			// Optional: Track button clicks for analytics
			const serviceType = this.closest(".service-card").querySelector(".service-title").textContent;
			console.log("Service demandé:", serviceType);
		});
	});
});
