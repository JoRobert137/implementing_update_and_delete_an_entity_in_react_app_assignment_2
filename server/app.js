import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import crypto from "node:crypto";

const PORT = process.env.SECONDARY_PUBLIC_PORT || 8000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Custom logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    });
    next();
});

app.use(cors());
app.use(express.json());

// Function to read data from db.json
const loadData = (key) => {
    try {
        const dbPath = path.resolve(__dirname, "db.json");
        if (!fs.existsSync(dbPath)) return {};
        const data = JSON.parse(fs.readFileSync(dbPath, "utf8"));
        return key ? data[key] || [] : data;
    } catch (error) {
        console.error("Error loading data:", error);
        return {};
    }
};

// Function to write data to db.json
const saveData = (key, data) => {
    try {
        const dbPath = path.resolve(__dirname, "db.json");
        const existingData = loadData();
        const newData = { ...existingData, [key]: data };
        fs.writeFileSync(dbPath, JSON.stringify(newData, null, 2));
        return data;
    } catch (error) {
        console.error("Error saving data:", error);
        return {};
    }
};

// Get all doors
app.get("/doors", (_, res) => {
    const doorsData = loadData("doors");
    res.json(doorsData);
});

// Get a specific door by ID
app.get("/doors/:id", (req, res) => {
    const doorsData = loadData("doors");
    const door = doorsData.find((door) => String(door.id) === String(req.params.id));

    if (door) {
        return res.json(door);
    }
    res.status(404).json({ message: "Door not found" });
});

// Add a new door
app.post("/doors", (req, res) => {
    const doorsData = loadData("doors");
    const newDoor = { id: crypto.randomUUID(), ...req.body };
    doorsData.push(newDoor);
    saveData("doors", doorsData);
    res.status(201).json(newDoor);
});

// Update an existing door
app.put("/doors/:id", (req, res) => {
    const doorsData = loadData("doors");
    const doorIndex = doorsData.findIndex((door) => String(door.id) === String(req.params.id));

    if (doorIndex !== -1) {
        delete req.body.id; // Prevent updating ID
        doorsData[doorIndex] = { ...doorsData[doorIndex], ...req.body };
        saveData("doors", doorsData);
        return res.json(doorsData[doorIndex]);
    }

    res.status(404).json({ message: "Door not found" });
});

// Delete a door
app.delete("/doors/:id", (req, res) => {
    const doorsData = loadData("doors");
    const doorIndex = doorsData.findIndex((door) => String(door.id) === String(req.params.id));

    if (doorIndex !== -1) {
        const deletedDoor = doorsData.splice(doorIndex, 1)[0];
        saveData("doors", doorsData);
        return res.json(deletedDoor);
    }

    res.status(404).json({ message: "Door not found" });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
