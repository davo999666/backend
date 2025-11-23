import fs from "fs";
import express from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import puppeteer from "puppeteer";

// ---------------------------
// 1️⃣ Swagger setup
// ---------------------------
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My API",
            version: "1.0.0",
            description: "API documentation",
        },
        servers: [{ url: "http://localhost:8080" }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./routes/*.js"], // your route files
};

const swaggerSpec = swaggerJsDoc(options);

// Optional: write JSON file
fs.writeFileSync("swagger.json", JSON.stringify(swaggerSpec, null, 2));
console.log("swagger.json generated!");

// ---------------------------
// 2️⃣ Express + Swagger UI
// ---------------------------
const app = express();

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        swaggerOptions: {
            docExpansion: "full", // <<< expands all endpoints
        },
    })
);

// ---------------------------
// 3️⃣ Start server and generate PDF
// ---------------------------
const server = app.listen(8080, async () => {
    console.log("Swagger UI running at http://localhost:8080/api-docs");

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Go to Swagger UI page
        await page.goto("http://localhost:8080/api-docs", { waitUntil: "networkidle0" });

        // Optional: set viewport for better PDF layout
        await page.setViewport({ width: 1200, height: 800 });

        // Generate PDF
        await page.pdf({
            path: "API_Documentation.pdf",
            format: "A4",
            printBackground: true,
        });

        await browser.close();
        console.log("API_Documentation.pdf generated!");
    } catch (err) {
        console.error("Error generating PDF:", err);
    } finally {
        server.close();
    }
});
