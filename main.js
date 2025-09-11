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
// Mobile dropdown functionality for InessCoach menu - FIXED VERSION
function toggleMobileDropdown(element) {
	const dropdownItem = element.closest(".mobile-dropdown-item");
	const dropdownContent = dropdownItem.querySelector(".mobile-dropdown-content");
	const dropdownArrow = dropdownItem.querySelector(".mobile-dropdown-arrow");

	// Prevent the event from bubbling up
	event.preventDefault();
	event.stopPropagation();

	// Toggle active class on the dropdown item
	dropdownItem.classList.toggle("active");

	// Toggle active class on the dropdown content
	dropdownContent.classList.toggle("active");

	// Rotate arrow
	if (dropdownItem.classList.contains("active")) {
		dropdownArrow.style.transform = "rotate(180deg)";
	} else {
		dropdownArrow.style.transform = "rotate(0deg)";
	}

	// Don't close the mobile menu when clicking InessCoach
	return false;
}

// Close mobile dropdown when clicking on a link inside it
document.addEventListener("DOMContentLoaded", function () {
	const mobileDropdownLinks = document.querySelectorAll(".mobile-dropdown-content a");

	mobileDropdownLinks.forEach((link) => {
		link.addEventListener("click", function () {
			// Close the mobile menu
			const mobileMenu = document.querySelector(".mobile-menu");
			const navContainer = document.querySelector(".nav-container");

			mobileMenu.classList.remove("active");
			document.body.style.overflow = "auto";
			navContainer.style.display = "flex";

			// Close the dropdown
			const dropdownItem = this.closest(".mobile-dropdown-item");
			const dropdownContent = dropdownItem.querySelector(".mobile-dropdown-content");
			const dropdownArrow = dropdownItem.querySelector(".mobile-dropdown-arrow");

			dropdownItem.classList.remove("active");
			dropdownContent.classList.remove("active");
			dropdownArrow.style.transform = "rotate(0deg)";
		});
	});

	// Animation delays for mobile menu items
	const mobileMenuItems = document.querySelectorAll(".mobile-menu-links > a, .mobile-dropdown-item");
	mobileMenuItems.forEach((item, index) => {
		item.style.transitionDelay = `${0.4 + index * 0.1}s`;
	});

	// Fix for direct clicking on InessCoach to open dropdown immediately
	const mobileDropdownToggle = document.querySelector(".mobile-dropdown-toggle");
	if (mobileDropdownToggle) {
		mobileDropdownToggle.addEventListener("click", function (e) {
			toggleMobileDropdown(this);
		});
	}
});
