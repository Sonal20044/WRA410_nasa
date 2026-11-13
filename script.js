// NASA's Astronomy Picture of the Day API
// per_page=1 gets the most recent picture
const url = 'https://science.nasa.gov/wp-json/wp/v2/apod-basic?per_page=1';
const outputContainer = document.querySelector('.container');

apiApp();

async function apiApp() {
    try {
        const jsonData = await getData(url);
        // The API sends back an array, so we use the first item.
        const picture = Array.isArray(jsonData) ? jsonData[0] : jsonData;
        if (!picture) throw new Error('No picture found');

        const newHtml = processData(picture);
        outputContainer.innerHTML = newHtml;
    } catch (error) {
        outputContainer.textContent = 'Sorry, the NASA picture could not load. Try refreshing the page.';
        console.error(error);
    }
}

function processData(data) {
    const photoOrLink = data.media_type === 'image' && data.hdurl
        ? `<img src="${data.hdurl}" alt="${data.alt || data.title}">`
        : `<p><a href="${data.permalink}" target="_blank" rel="noopener noreferrer">See this entry on NASA's website</a></p>`;

    return `
        <h1>NASA Picture of the Day</h1>
        <p class="subtitle">A little look at space, straight from NASA.</p>
        <h2>${data.title}</h2>
        <p class="date">${data.date}</p>
        ${photoOrLink}
        <div class="explanation">${data.explanation || 'No explanation available today.'}</div>
        <p class="source"><a href="${data.permalink}" target="_blank" rel="noopener noreferrer">View original on NASA</a></p>
    `;
}

async function getData(dataUrl) {
    const response = await fetch(dataUrl);
    if (!response.ok) throw new Error(`NASA API error: ${response.status}`);
    return await response.json();
}
