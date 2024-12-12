// Package_Service.jsx
const API_URL = 'http://localhost:8080/rest/packagePlan';

export const fetchPlans = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
};

export const addOrUpdatePlan = async (plan, editingPlanID) => {
    const method = editingPlanID ? 'PUT' : 'POST';
    const url = editingPlanID ? `${API_URL}/${editingPlanID}` : API_URL;

    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...plan,
            price: parseFloat(plan.price),
            duration: parseInt(plan.duration, 10),
        }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
};

export const deletePlan = async (planID) => {
    const response = await fetch(`${API_URL}/${planID}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Network response was not ok');
};