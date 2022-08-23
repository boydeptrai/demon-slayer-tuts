const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const url = "https://kimetsu-no-yaiba.fandom.com/wiki/Kimetsu_no_Yaiba_Wiki";

const app = express();
app.use(bodyParser.json({limit: "50mb"}));
app.use(cors());
app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 50000,

    })
);

// ROUTES
// GET ALL CHARACTERS
app.get("/v1",(req,resp) =>{
    const thumbnails = [];
    try {
        axios(url).then((res) =>{
            const html = res.data;
            const $ = cheerio.load(html);
            $(".portal",html).each(function(){
                const name = $(this).find("a").attr("title");
                const url = $(this).find("a").attr("href");
                const image = $(this).find("a > img").attr("data-src");
                thumbnails.push({
                    name: name,
                    url: "http://localhost:8000/v1" + url.split("/wiki")[1],
                    image: image
                })
            });
            resp.status(200).json(thumbnails);
        });
    } catch (error) {
        resp.status(500).json(error);
    }
});

// RUN PORT
app.listen(8000,() =>{
    console.log("Server is running...")
})

