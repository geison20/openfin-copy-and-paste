import { FastifyInstance, FastifyPluginOptions } from "fastify";
import path from "path";
import fs from "node:fs/promises";

const SCHEMA_DIR = path.join(__dirname, "../../../json-schemas");

async function router(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    fastify.get("/schemas", async (req, res) => {
        try {
            const files = await fs.readdir(SCHEMA_DIR);
            const jsonFiles = files.filter(file => file.endsWith(".json"));

            const readFilesPromises = jsonFiles.map(async (file) => {
                const filePath = path.join(SCHEMA_DIR, file);
                const data = await fs.readFile(filePath, 'utf8');
                return JSON.parse(data);
            });

            const jsonResponse = await Promise.all(readFilesPromises);

            return res.code(200).send(jsonResponse);
        } catch (error) {
            req.log.error(error); // Log the error
            return res.code(500).send({ error: 'Internal Server Error' });
        }
    });
}

export default router;
