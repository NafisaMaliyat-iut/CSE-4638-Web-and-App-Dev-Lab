// utils/auth.js

export const handleSubmit = async (formData, apiRoute) => {
  try {
    const response = await fetch(apiRoute, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return { error: 'An error occurred' };
  }
};
