import React, { useEffect, useState } from 'react';

function WiFiDisplay() {
    const [networks, setNetworks] = useState([]);

    useEffect(() => {
        async function fetchNetworks() {
            try {
                const response = await fetch('http://localhost:4000/api/networks');
                const data = await response.json();
                setNetworks(data);
            } catch (error) {
                console.error("Error fetching networks:", error);
            }
        }
        fetchNetworks();
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 w-full max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">Available WiFi Networks</h1>
            <ul className="space-y-2">
                {networks.map((network, index) => (
                    <li key={index} className="bg-gray-50 p-3 rounded-lg shadow-md flex justify-between items-center">
                        <span className="font-medium text-lg text-gray-800">{network.ssid || 'Unknown Network'}</span>
                        <span className={`ml-4 text-sm font-semibold ${
                            network.signal_level > -50 ? 'text-green-500' : 'text-yellow-500'
                        }`}>
                            {network.signal_level > -50 ? 'Strong' : 'Weak'}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default WiFiDisplay;
