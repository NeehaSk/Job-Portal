import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ===== GET FILE BY ID =====
router.get("/:fileId", async (req, res) => {
    try {
        const { fileId } = req.params;

        // 1. Validate ID
        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            return res.status(400).json({ message: "Invalid file ID formation" });
        }

        const bucket = req.app.locals.bucket;
        if (!bucket) {
            return res.status(500).json({ message: "File system storage not initialized" });
        }

        const _id = new mongoose.Types.ObjectId(fileId);

        // 2. Check if file exists
        const files = await bucket.find({ _id }).toArray();
        if (files.length === 0) {
            return res.status(404).json({ message: "File not found in storage" });
        }

        const file = files[0];
        
        // 3. Set Headers for Viewing/Downloading
        res.set("Content-Type", file.contentType || "application/octet-stream");
        // 'inline' allows PDF to open in browser, 'attachment' forces download
        res.set("Content-Disposition", `inline; filename="${file.filename}"`);
        res.set("Cache-Control", "public, max-age=31536000");

        // 4. Stream File
        const downloadStream = bucket.openDownloadStream(_id);
        downloadStream.pipe(res);

        downloadStream.on("error", (err) => {
            console.error("GridFS Stream Error:", err);
            if (!res.headersSent) {
                res.status(500).json({ message: "Error streaming file" });
            }
        });

    } catch (error) {
        console.error("File Route Internal Error:", error);
        res.status(500).json({ message: "Internal server error accessing file" });
    }
});

export default router;
