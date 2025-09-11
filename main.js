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
// Toggle ebook functionality
function showSection(section) {
	const freeSection = document.getElementById("freeSection");
	const premiumSection = document.getElementById("premiumSection");
	const freeBtn = document.getElementById("freeBtn");
	const premiumBtn = document.getElementById("premiumBtn");
	const toggleSlider = document.getElementById("toggleSlider");

	if (section === "free") {
		freeSection.classList.add("active");
		premiumSection.classList.remove("active");
		freeBtn.classList.add("active");
		premiumBtn.classList.remove("active");
		toggleSlider.classList.remove("premium");
	} else {
		freeSection.classList.remove("active");
		premiumSection.classList.add("active");
		freeBtn.classList.remove("active");
		premiumBtn.classList.add("active");
		toggleSlider.classList.add("premium");
	}
}

// Add smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", function (e) {
		e.preventDefault();
		const target = document.querySelector(this.getAttribute("href"));
		if (target) {
			target.scrollIntoView({
				behavior: "smooth",
			});
		}
	});
});
