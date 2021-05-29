const fs = require('fs');
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");

////////////////////////////////////////////////////
//COMMANDS
/*
nodemon
npm run start
npm run
change "start" script in package.json
to install developer dependency
npm i packageName --save-dev
to install global package

*/


////////////////////////////////////
//File Handeling
//blocking synchronous way
/*
const textIn = fs.readFileSync("final/txt/append.txt",'utf-8');
console.log(textIn);
const textOut = `This is what we know about avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync(`final/txt/output.txt`, textOut);
console.log("File Write");
*/

//Non-Blocking Synchronous way
/*
fs.readFile("final/txt/starst.txt", "utf-8", (error, data) => {
    if (error) return console.log("error");
    fs.readFile(`final/txt/${data}.txt`, "utf-8", (error, data1) => {
        console.log(data1);
        fs.readFile(`final/txt/append.txt`, "utf-8", (error, data2) => {
            console.log(data2);
            fs.writeFile("final/txt/final.txt", `${data1}\n${data2}`,"utf-8", error=>{
                console.log("File Writing Done");
            });
        });
    });
    console.log(data);
}) ;
console.log("Reading File");
*/


////////////////////////////////////
//SERVER

//reading file
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");
const Data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(Data);

const slugs = dataObj.map(el => slugify(el.productName), {lower:true});
console.log(slugs);
console.log(slugify('Fresh Avocodo', {lower:true}));

http.createServer((req, res)=>{
    const {query, pathname} = url.parse(req.url, true);
    //overview page
    if (pathname === "/" || pathname === '/overview'){
        res.writeHead(200, {"Content-Type":"text/html"});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join("");
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        //console.log(output);
        res.end(output);
    }
    //product page
    else if(pathname === '/product'){
        res.writeHead(200, {"Content-Type":"text/html"});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    }
    //api
    else if(pathname === '/api'){
        //res.end("API");
        res.writeHead(200, {"Content-Type":"application/json"});
        res.end(Data);
        //res.end("das");
    }
    //error page
    else{
        res.writeHead(404, {"Content-Type":"text/html"});
        res.end("<h1>Page Not found!!!!!</h1>");
    }
}).listen(8888, "127.0.0.1" , () => {
    console.log("Server Started");
});

console.log("Waiting for users!!!!!!!!")