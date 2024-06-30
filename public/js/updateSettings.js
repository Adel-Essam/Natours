import axios from "axios";

import { showAlert } from "./alerts";

// type is either password or data
export const updatesettings = async (data, type) => {
	try {
		const url =
			type === "password" ? "/api/users/updatePassword" : "/api/users/updateMe";
		const res = await axios({
			url,
			method: "PATCH",
			data,
		});
		if (res.data.status === "success") {
			showAlert("success", `${type.toUpperCase()} updated successfully.`);
			window.setTimeout(() => {
				location.reload(true);
			}, 500);
		}
	} catch (error) {
		showAlert("error", error.response.data.message);
	}
};
