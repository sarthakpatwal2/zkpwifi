import React, { useState } from "react";
import axios from "axios";

export default function PasswordCheck() {
    const [password, setPassword] = useState("");
    const [result, setResult] = useState(null);

    const handleCheckPassword = async () => {
        try {
            const response = await axios.post("http://localhost:4000/api/checkPassword", { password });
            setResult(response.data.success ? "Password is correct!" : "Password is incorrect.");
        } catch (error) {
            setResult("Error verifying password.");
        }
    };

    return (
        <div className="p-4 border rounded shadow-lg">
            <h2 className="text-xl font-bold mb-2">Password Check</h2>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="border p-2 rounded w-full mb-4"
            />
            <button
                onClick={handleCheckPassword}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
                Verify Password
            </button>
            {result && <p className="mt-4 text-sm">{result}</p>}
        </div>
    );
}
