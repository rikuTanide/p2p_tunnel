import * as express from "express";


function indexHtml(host): string {
 return   `
<!doctype html>
<html lang="ja">
<head>
<meta charset="utf8" />
<title>hello</title>
</head>
<body>
<p>host: ${host}</p>
<form method="post" action="/">
<input type="text" name="text" value="hoge">
<input type="submit" name="submit" value="fuga">
</form>
</body>
</html>
`
}
const app = express();
app.use(express.urlencoded()); //Parse URL-encoded bodies

app.get("/", (req, res)=>{
    res.status(200);
    const host = req.header("host");
    res.send(indexHtml(`${host}`));
});

app.post("/", (req, res) => {
    res.write(JSON.stringify(req.body));
    res.end();
});

app.listen(3000);