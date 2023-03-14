// const fs = require("fs");
// const puppeteer = require("puppeteer");

// async function run() {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto("https://gdsc.community.dev/monash-university/");

//   const event_time = await page.evaluate(() =>
//     Array.from(
//       document.querySelectorAll(
//         "#upcoming-events .event-list .date.general-body--color"
//       ),
//       (element) => element.textContent
//     )
//   );

//   const event_title = await page.evaluate(() =>
//     Array.from(
//       document.querySelectorAll(".row.event h4"),
//       (element) => element.textContent
//     )
//   );
//   // console.log(event_title);

//   const event_tags = await page.evaluate(() =>
//     Array.from(
//       document.querySelectorAll(".react-tags-root span"),
//       (element) => element.textContent
//     )
//   );
//   console.log(event_tags);

//   const event_descp = await page.evaluate(() =>
//     Array.from(
//       document.querySelectorAll(".description.general-body--color"),
//       (element) => element.textContent
//     )
//   );
//   // console.log(event_descp);

//   numEvents = event_time.length;
//   events = new Array(numEvents);

//   for (i = 0; i < numEvents; i++) {
//     events[i] = {
//       time: event_time[i].replace(/\s\s+/g, " ").trim(),
//       title: event_title[i].trim(),
//       tags: event_tags[i],
//       descp: event_descp[i].trim(),
//     };
//   }

//   console.log(events);

//   await browser.close();
// }

// run();

const fs = require("fs");
const puppeteer = require("puppeteer");

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://gdsc.community.dev/monash-university/");

  const [
    eventTimeElements,
    eventTitleElements,
    eventTagElements,
    eventDescElements,
  ] = await Promise.all([
    page.$$eval(
      "#upcoming-events .event-list .date.general-body--color",
      (elements) => elements.map((element) => element.textContent.trim())
    ),
    page.$$eval(".row.event h4", (elements) =>
      elements.map((element) => element.textContent.trim())
    ),
    page.$$eval(".react-tags-root span", (elements) =>
      elements.map((element) => element.textContent.trim())
    ),
    page.$$eval(".description.general-body--color", (elements) =>
      elements.map((element) => element.textContent.trim())
    ),
  ]);

  const events = eventTimeElements.map((time, index) => ({
    time: time.replace(/\s\s+/g, " ").trim(),
    title: eventTitleElements[index],
    tags: eventTagElements[index],
    descp: eventDescElements[index],
  }));

  console.log(events);

  await browser.close();
}

run();
