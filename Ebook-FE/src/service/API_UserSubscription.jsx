const API_URL = "http://localhost:8080/rest/userSubscription";

export const fetchUserSubscriptions = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
}

// Hàm gọi API cập nhật User Subscription
export const UpdateUserSubscription = async (userSubscription, userSubscriptionID) => {
    const url = `${API_URL}/${userSubscriptionID}`; // URL có ID của userSubscription
    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: userSubscription.userId,  // Chỉ gửi userId và planId
                planId: userSubscription.planId,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${errorText}`);
        }

        return response.json();
    } catch (error) {
        console.error("Error during fetch operation:", error.message);
        throw error;
    }
};
