var express = require('express');
var router = express.Router();
var async = require('async');
var message = require('../config/messages/en');
const { OperationHelper } = require('apac');
var nodeTelegramBotApi = require("node-telegram-bot-api");
let request = require("request");
var config = require('../config/global');
var connection = require('../config/connection');
const BitlyClient = require('bitly').BitlyClient;
// const bitly = new BitlyClient('d10f8d72343ef254f7251780cbdcc0006fda0bb0');
var tall = require('tall').default;
const axios = require('axios');
var textVersion = require("textversionjs");
const cheerio = require('cheerio')
var _ = require('underscore');
var isLoggedInPolicie = require('../policies/isLoggedIn.js');
var isUserAuthenticatedPolicy = require('../policies/isUserAuthenticated.js');
var jwt = require('jsonwebtoken');
const unshort = require('url-unshorten');
var moment = require('moment');

const fs = require("fs");
const Jimp = require("jimp");
const Instagram = require("instagram-web-api");
const FileCookieStore = require("tough-cookie-filestore2");
const imaps = require("imap-simple");
const simpleParser = require("mailparser").simpleParser;
require("dotenv").config();


setInterval( function setup() {
  let sqlsss = "SELECT * FROM post_flags";
  connection.query(sqlsss, function (err, tagChangeRandom) {
    console.log('tagChangeRandom: ', tagChangeRandom[0].tag_switch);
    var a = moment().utcOffset("+05:30").format("HH:mm");
    if(a == "00:58"||a == "04:00"||a == "06:00"||a == "08:00"||a == "10:00"||a == "12:00"||a == "14:00"||a == "16:00"||a == "18:00"||a == "20:00"||a == "22:00"||a == "23:59" ){
      console.log("a");
      instagramLoginFunction();
    }else if(a == "00:59"||a == "04:01"||a == "06:01"||a == "08:01"||a == "10:01"||a == "12:01"||a == "14:01"||a == "16:01"||a == "18:01"||a == "20:01"||a == "22:01"||a == "23:58" ){
      console.log("a");
      instagramLoginFunction();
    }else{
      console.log("b");
    }
    if (err) {
      console.log('err: ', err);
    }
      })
}, 110000)

function getRandomArbitrary(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
 }

const instagramLoginFunction = async () => {
  const client = new Instagram(
    {
      username: 'fashion_.points',
      password: 'S@!E6a6a',
      // cookieStore,
    },
    {
      language: "en-US",
    }
    );
    console.log('client: ', client);
  const instagramPostPictureFunction = async () => {
    await client
      .getPhotosByUsername({ username: 'fashionweek' })
      .then((res) => {
        const allCaptions = res.user.edge_owner_to_timeline_media.edges.map(
          (item) => item.node.edge_media_to_caption.edges[0]
          );

        const allCaptionsExisting = allCaptions.filter((caption) => caption);
        return {
          mostRecent:
            allCaptions[allCaptions.length - allCaptionsExisting.length].node
              .text,
          offset: allCaptions.length - allCaptionsExisting.length,
        };
      })
      .then(({ mostRecent, offset }) => {
        return {
          latestNumber: Number(mostRecent.split(" - ")[0]),
          offset: offset,
        };
      })
      .then(({ latestNumber, offset }) => {
         var finalTextValue1 = getRandomArbitrary(1,113129)
         console.log("de",finalTextValue1);
        const updatedNumber = latestNumber + (offset + 1);
        var text = fs.readFileSync("./testv.js");
        var finalTextValue = Number(text.toString('utf-8'))
          axios({
            url: `https://backend.top9deals.com/admin/address/listamznproducts?start=`+finalTextValue1+`&length=20`,
            method: "get",
            headers: {
              "Content-Type": "application/json",
            }
          })
          .then((res) => res.data)
          .then(async ({ data, errors }) => {
            if (errors) {
              console.error(errors);
            }
           var updatedInkyDoodle = await Jimp.read(data.list[1].desk_img)
           .then(image => {
             return data.list[1];
            })
            .catch(err => {
              return data.list[2];
            });
            console.log('updatedInkyDoodle: ', updatedInkyDoodle);

            let  watermark = await Jimp.read('https://top9deals.com/assets/fashion_points_adobespark.png');
            watermark = watermark.resize(75,75);
            if (updatedInkyDoodle) {
              const updatedCaption = ` ${
                updatedInkyDoodle.product_title
              }\n✨https://top9deals.com/products/${updatedInkyDoodle.desk_cate}/${updatedInkyDoodle.desk_sub_cate}/${updatedInkyDoodle.desk_mini_sub_cate}/${updatedInkyDoodle.id} ✨\n.\n.\n.\n.\n
              #fashion #fashionstyle #fashionlover #instafashion #casualstyle #casualoutfits #casuallook #summerstyles #outfitstyle  #styleinfluencer #trendylook #summerfashion #dailyoutfit #fashionpoint #fashionzone #offerzone #offerpoint #fashionhub #offerhub`;

                  Jimp.read(updatedInkyDoodle.desk_img)
                  .then((lenna) => {
                  return lenna
                    .composite(watermark, 0, 0, {
                      mode: Jimp.BLEND_SOURCE_OVER,
                      opacityDest: 1,
                      opacitySource: 0.6
                    })
                    .write(`./${updatedInkyDoodle.desk_sub_cate}.jpg`, async () => {
                      await client
                        .uploadPhoto({
                          photo:`${updatedInkyDoodle.desk_sub_cate}.jpg`,
                          // photo: updatedInkyDoodle.desk_img,
                          caption: updatedCaption,
                          post: "feed", //story
                        })
                        .then(({ media }) => {
                          console.log(
                            `https://www.instagram.com/p/${media.code}/`
                          );
                          fs.writeFileSync('./testv.js', finalTextValue+1)
                          // // Remove Local JPG File
                          fs.unlinkSync(`${updatedInkyDoodle.desk_sub_cate}.jpg`);
                        });
                    });
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          });
      });
  };

  const delayedInstagramPostFunction = async (timeout) => {
    setTimeout(async () => {
      await instagramPostPictureFunction();
    }, timeout);
  };

  try {
    console.log("Logging in...");

    await client.login();

    console.log("Login successful!");

    await delayedInstagramPostFunction(50000);
  } catch (err) {
    console.log("Login failed!");

    if (err.statusCode === 403 || err.statusCode === 429) {
      console.log("Throttled!");

      const delayedLoginFunction = async (timeout) => {
        setTimeout(async () => {
          await client.login().then(() => instagramPostPictureFunction());
        }, timeout);
      };

      await delayedLoginFunction(60000);
    }

    console.log(err);

    // Instagram has thrown a checkpoint error
    if (err.error && err.error.message === "checkpoint_required") {
      const challengeUrl = err.error.checkpoint_url;

      await client.updateChallenge({ challengeUrl, choice: 1 });

      const emailConfig = {
        imap: {
          user: `kajallunagariya1990@gmail.com`,
          password: `S@!E6a6a`,
          host: "imap.gmail.com",
          port: 993,
          tls: true,
          tlsOptions: {
            servername: "imap.gmail.com",
            rejectUnauthorized: false,
          },
          authTimeout: 30000,
        },
      };

      // Connect to email and solve Instagram challenge after delay
      const delayedEmailFunction = async (timeout) => {
        setTimeout(() => {
          imaps.connect(emailConfig).then(async (connection) => {
            return connection.openBox("INBOX").then(async () => {
              // Fetch emails from the last hour
              const delay = 1 * 3600 * 1000;
              let lastHour = new Date();
              lastHour.setTime(Date.now() - delay);
              lastHour = lastHour.toISOString();
              const searchCriteria = ["ALL", ["SINCE", lastHour]];
              const fetchOptions = {
                bodies: [""],
              };
              return connection
                .search(searchCriteria, fetchOptions)
                .then((messages) => {
                  messages.forEach((item) => {
                    const all = _.find(item.parts, { which: "" });
                    const id = item.attributes.uid;
                    const idHeader = "Imap-Id: " + id + "\r\n";
                    simpleParser(idHeader + all.body, async (err, mail) => {
                      if (err) {
                        console.log(err);
                      }

                      console.log(mail.subject);

                      const answerCodeArr = mail.text
                        .split("\n")
                        .filter(
                          (item) =>
                            item && /^\S+$/.test(item) && !isNaN(Number(item))
                        );

                      if (mail.text.includes("Instagram")) {
                        if (answerCodeArr.length > 0) {
                          // Answer code must be kept as string type and not manipulated to a number type to preserve leading zeros
                          const answerCode = answerCodeArr[0];
                          console.log(answerCode);

                          await client.updateChallenge({
                            challengeUrl,
                            securityCode: answerCode,
                          });

                          console.log(
                            `Answered Instagram security challenge with answer code: ${answerCode}`
                          );

                          await client.login();

                          await instagramPostPictureFunction();
                        }
                      }
                    });
                  });
                });
            });
          });
        }, timeout);
      };

      await delayedEmailFunction(40000);
    }
  }
};


module.exports = router;
