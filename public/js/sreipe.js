import axios from "axios";
import { showAlert } from "./alerts";
var stripe = Stripe(
	"pk_test_51PWYVQLikGg1LmtwYhkjuXISMSaZpOdiY3PPoubpL4rldif1OMRx5Zqe07sBYcHOGhBBClzU2uF4sug478gxm9fX00RWJJDhtR"
);

export const bookTour = async (tourId) => {
	try {
		// 1) Get checkout sessoion frim API
		const session = await axios(
			`http://localhost:3000/api/bookings/checkout-session/${tourId}`
		);
		console.log("session :>> ", session);

		// 2) Create checkout form + credit card
		await stripe.redirectToCheckout({
			sessionId: session.data.session.id,
		});
	} catch (error) {
		console.log("error :>> ", error);
		showAlert("error", error);
	}
};
