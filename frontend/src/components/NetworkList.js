import React, { useState, useEffect } from "react";
import axios from "axios";

export default function NetworkList() {
    const [networks, setNetworks] = useState([]);

    useEffect(() => {
        const fetchNetworks = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/networks");
                setNetworks(response.data);
            } catch (error) {
                console.error("Error fetching networks:", error);
            }
        };

        fetchNetworks();
    }, []);

    return (
        <div className="p-4 border rounded shadow-lg">
            <h2 className="text-xl font-bold mb-2">Available Networks</h2>
            {networks.length > 0 ? (
                <ul className="list-disc ml-4">
                    {networks.map((network, index) => (
                        <li key={index}>
                            {network.ssid} - Signal Strength: {network.signal_level}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No networks found.</p>
            )}
        </div>
    );
}
