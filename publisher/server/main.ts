import * as Puppeteer from "puppeteer";
import * as express from "express";

export async function setUp() {

    const app = express();
    app.get("/connection_id", (req, res)=>{
        const id = (req.query as {id: string} ).id;
        console.log(id);
    });
    app.post("/on_request", (req,res)=>{

        const body: number[] = [];

        req.on("data", data => {
            body.push(...data);
        });
        req.on("end", () => {
            const ab = new Uint8Array(body);
            console.log(ab);
            res.end()
        });
    });
    app.use("/", express.static("./web/dist"));
    await app.listen(8002);

    const browser = await Puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("http://localhost:8002/");
}

setUp();