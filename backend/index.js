const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");
const express = require("express");
const wifi = require("node-wifi");
const cors = require('cors');

wifi.init({ iface: null });

const app = express();
app.use(cors());
app.use(express.json());

const wasmPath = path.join(__dirname, "..", "circom", "passwordCheck_js", "passwordCheck.wasm");
const zkeyPath = path.join(__dirname, "..", "circom", "passwordCheck_final.zkey");
const vKeyPath = path.join(__dirname, "..", "circom", "verification_key.json");

// Function to create a witness
async function generateWitness(input) {
    const witnessFile = path.join(__dirname, "..", "circom", "witness.wtns");

    // Use snarkjs to generate the witness directly
    await snarkjs.wtns.calculate(input, wasmPath, witnessFile);

    return witnessFile;
}

// Function to generate proof
async function generateProof(witness) {
    const { proof, publicSignals } = await snarkjs.groth16.prove(zkeyPath, witness);
    
    console.log("Generated Proof:", proof);
    console.log("Public Signals:", publicSignals);

    return { proof, publicSignals };
}

// Function to verify proof
async function verifyProof(proof, publicSignals) {
    const verificationKey = JSON.parse(fs.readFileSync(vKeyPath));
    return await snarkjs.groth16.verify(verificationKey, publicSignals, proof);
}

// API to check password
async function checkPassword(inputPassword) {
    // Ensure the input values are converted to strings representing integers
    const input = {
        password: BigInt(inputPassword).toString(),       // Convert to BigInt and then to string
        correctPassword: BigInt(1234).toString()          // Convert "1234" to BigInt and then to string
    };

    try {
        const witness = await generateWitness(input);
        const { proof, publicSignals } = await generateProof(witness);

        // Interpret the publicSignals output:
        // If `publicSignals[0]` is "0", the passwords match (assuming your circuit outputs 0 when matching).
        const diffResult = BigInt(publicSignals[0]);

        if (diffResult === BigInt(0)) {
            console.log("Password is correct!");
            return true;
        } else {
            console.log("Password is incorrect.");
            return false;
        }
    } catch (error) {
        console.error("Error during password check:", error);
        return false;
    }
}


// Test the password verification
// (async () => {
//     const userPassword = "1234";
//     const isPasswordCorrect = await checkPassword(userPassword);
    
//     if (isPasswordCorrect) {
//         console.log("Password is correct!");
//     } else {
//         console.log("Password is incorrect.");
//     }
// })();


app.post("/api/checkPassword", async (req, res) => {
    const { password } = req.body;
    // Call your existing checkPassword function here
    const isPasswordCorrect = await checkPassword(password);
    res.json({ success: isPasswordCorrect });
});

// Endpoint to get available networks
app.get('/api/networks', async (req, res) => {
    try {
        const networks = await wifi.scan();
        res.json(networks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch networks' });
    }
});

app.listen(4000, () => console.log("Backend listening on port 4000"));