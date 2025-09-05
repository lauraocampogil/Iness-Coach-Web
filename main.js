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
