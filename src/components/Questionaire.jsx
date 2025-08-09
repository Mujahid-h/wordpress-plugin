import React, { useState, useEffect } from "react";

export default function Questionaire() {
  const [formData, setFormData] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
  });
  const [orderId, setOrderId] = useState("");
  const [orderKey, setOrderKey] = useState("");
  const return_url = "https://palevioletred-gerbil-465258.hostingersite.com";

  // Extract order & key from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setOrderId(params.get("order") || "");
    setOrderKey(params.get("key") || "");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call backend API to check answers and process Woo webhook
      // const response = await fetch("/api/check-answers", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     orderId,
      //     orderKey,
      //     answers: formData,
      //   }),
      // });

      // const data = await response.json();
      // if (data.success) {
      //   // Redirect user back to WooCommerce order received page
      //   window.location.href = `${data.return_url}?order=${orderId}&key=${orderKey}`;
      // } else {
      //   alert("Some answers are incorrect or status not updated.");
      // }
      window.location.href = `${return_url}?order=${orderId}&key=${orderKey}`;
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error occurred. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 max-w-md mx-auto space-y-4 border rounded-lg"
    >
      <h2 className="text-xl font-bold">Answer the following questions:</h2>

      {["q1", "q2", "q3", "q4"].map((q, index) => (
        <div key={q}>
          <p className="mb-1">Question {index + 1}?</p>
          <label className="mr-4">
            <input
              type="radio"
              name={q}
              value="Yes"
              checked={formData[q] === "Yes"}
              onChange={handleChange}
              required
            />{" "}
            Yes
          </label>
          <label>
            <input
              type="radio"
              name={q}
              value="No"
              checked={formData[q] === "No"}
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
