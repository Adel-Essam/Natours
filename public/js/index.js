import "@babel/polyfill";
import { displayMap } from "./mapbox";
import { login, logout } from "./login";
import { updatesettings } from "./updateSettings";
import { bookTour } from "./sreipe";

// DOM ELEMENTS
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logoutBtn = document.querySelector(".nav__el--logout");
const updateUserForm = document.querySelector(".form-user-data");
const passwordForm = document.querySelector(".form-user-password");
const bookBtn = document.getElementById("book-tour");

// DELEGATION
if (mapBox) {
	const locations = JSON.parse(mapBox.dataset.locations);
	displayMap(locations);
}

if (loginForm)
	document.querySelector("form").addEventListener("submit", (e) => {
		e.preventDefault();
		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;
		login(email, password);
	});

if (logoutBtn) logoutBtn.addEventListener("click", logout);

if (updateUserForm)
	updateUserForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const form = new FormData(); // we do it this way so we can add files
		form.append("name", document.getElementById("name").value);
		form.append("email", document.getElementById("email").value);
		form.append("photo", document.getElementById("photo").files[0]);

		updatesettings(form, "data");
	});

if (passwordForm)
	passwordForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		document.querySelector(".btn--save-password").textContent = "Updating..."; // textContent is like innerHTML
		const currentPassword = document.getElementById("password-current").value;
		const password = document.getElementById("password").value;
		const passwordConfirm = document.getElementById("password-confirm").value;
		await updatesettings(
			{ currentPassword, password, passwordConfirm },
			"password"
		);

		document.querySelector(".btn--save-password").textContent = "Save Password";
		document.getElementById("password-current").value = "";
		document.getElementById("password").value = "";
		document.getElementById("password-confirm").value = "";
	});

if (bookBtn)
	bookBtn.addEventListener("click", (e) => {
		e.target.textContent = "Processing...";
		const { tourId } = e.target.dataset;
		bookTour(tourId);
	});
