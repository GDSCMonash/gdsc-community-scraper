import puppeteer, { Browser, ElementHandle, Page } from "puppeteer";

async function getProperty(element: ElementHandle, property: string): Promise<string> {
    const propertyHandle = await element.getProperty(property);
    return await propertyHandle.jsonValue() as string;
}

async function getHandle(
    page: ElementHandle<Element> | Page,
    selector: string
): Promise<ElementHandle<Element>> {
    return (await page.$(selector)) as ElementHandle<Element>;
}

// An interface for the return object of getEventDetails

interface EventDetails {
    title: string;
    description: string;
    link: string;
    image: string;
}

async function getEventDetails(container: ElementHandle<Element>): Promise<EventDetails> {
    // conainers --------------------------------------------------
    const titleContainer = await getHandle(container, "h4");
    const descriptionContainer = await getHandle(container, "p");
    const linkContainer = await getHandle(container, "a");
    const imageContainer = await getHandle(container, "img");
    // ------------------------------------------------------------

    // values -----------------------------------------------------
    const title = await getProperty(titleContainer, "textContent");
    // prettier-ignore
    const description = await getProperty(descriptionContainer, "textContent");
    const link = await getProperty(linkContainer, "href");
    const image = await getProperty(imageContainer, "src");
    // ------------------------------------------------------------

    return { title, description, link, image };
}

async function main(): Promise<void> {
    const browser: Browser = await puppeteer.launch();
    const page: Page = await browser.newPage();
    await page.goto("https://gdsc.community.dev/monash-university/");

    const upcomingEventsContainers: ElementHandle<Element>[] = await page.$$(
        ".panel-body.clearfix"
    );

    const upcomingEventDetails = Promise.all(
        upcomingEventsContainers.map(async (container) =>
            getEventDetails(container)
        )
    );

    console.log(await upcomingEventDetails);

    await browser.close();
}

await main();
