import React, { useState } from "react";

export default function Questionaire() {
  const [formData, setFormData] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Example API call
      // const response = await fetch("https://api.example.com/submit", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(formData),
      // });

      // if (!response.ok) {
      //   throw new Error("API request failed");
      // }

      // const data = await response.json();
      // console.log("Success:", data);
      console.log("Here is the form Data: ", formData);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error submitting the form.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 max-w-md mx-auto space-y-4 border rounded-lg"
    >
      <h2 className="text-xl font-bold">Survey</h2>

      {["q1", "q2", "q3", "q4"].map((questionKey, index) => (
        <div key={questionKey}>
          <p className="mb-1">Question {index + 1}?</p>
          <label className="mr-4">
            <input
              type="radio"
              name={questionKey}
              value="Yes"
              checked={formData[questionKey] === "Yes"}
              onChange={handleChange}
              required
            />{" "}
            Yes
          </label>
          <label>
            <input
              type="radio"
              name={questionKey}
              value="No"
              checked={formData[questionKey] === "No"}
              onChange={handleChange}
              required
            />{" "}
            No
          </label>
        </div>
      ))}

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
}
