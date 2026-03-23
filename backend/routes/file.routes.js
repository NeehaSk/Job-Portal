import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ===== GET FILE BY ID =====
router.get("/:fileId", async (req, res) => {
    try {
        const { fileId } = req.params;
        const bucket = req.app.locals.bucket;

        if (!bucket) {
            return res.status(500).json({ message: "Bucket not initialized" });
        }

        const _id = new mongoose.Types.ObjectId(fileId);

        // Check if file exists
        const files = await bucket.find({ _id }).toArray();
        if (files.length === 0) {
            return res.status(404).json({ message: "File not found" });
        }

        const file = files[0];
        res.set("Content-Type", file.contentType);

        const downloadStream = bucket.openDownloadStream(_id);
        downloadStream.pipe(res);

        downloadStream.on("error", (err) => {
            console.error("Download error:", err);
            res.status(500).json({ message: "Error downloading file" });
        });

    } catch (error) {
        console.error("File route error:", error);
        res.status(400).json({ message: "Invalid file ID or error" });
    }
});

export default router;
