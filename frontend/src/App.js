import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WiFiDisplay from './components/WifiDisplay';

function App() {
    const [password, setPassword] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);
    const [loading, setLoading] = useState(false);

    const checkPassword = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:4000/api/checkPassword', { password });
            setIsCorrect(response.data.success);
        } catch (error) {
            console.error("Error checking password:", error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 w-full">
                <WiFiDisplay />
                <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8 mt-8">
                    <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">WiFi Password Checker</h1>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-600 font-semibold">Enter Password for Dummy network:</label>
                        <input
                            id="password"
                            type="password"
                            className="mt-2 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter password to verify"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={checkPassword}
                        disabled={loading}
                        className={`w-full py-2 rounded-md text-white font-semibold transition ${
                            loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                    >
                        {loading ? 'Checking...' : 'Check Password'}
                    </button>

                    {isCorrect !== null && (
                        <div className={`mt-4 text-center font-semibold text-lg ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                            {isCorrect ? 'Password is Correct!' : 'Password is Incorrect.'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
