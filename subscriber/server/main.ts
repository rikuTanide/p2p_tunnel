import * as express from "express";
import * as expressWs from "express-ws";
const app = expressWs(express()).app;

app.get("/", (req, res) => {
    res.write("hello");
    res.end();
});

app.listen(8000);