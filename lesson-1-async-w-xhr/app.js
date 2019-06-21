(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        const imgRequest = new XMLHttpRequest();
        imgRequest.onload = addImage;
        imgRequest.onerror = function (err) {
            requestError(err, 'image');
        };
        imgRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        imgRequest.setRequestHeader('Authorization', 'Client-ID ca037b1d92e1e4944b690f693f4aafac8410e13dc6f0098445abc89b8846a5fc');
        imgRequest.send();

        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticles;
        articleRequest.onerror = function (err) {
            requestError(err, 'articles');
        };
        articleRequest.open('GET', `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=nTuVk0eUb6nKALA56ypXZjrR6lCwqVGm`);
        articleRequest.send();
    });

    function addImage() {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);

        if (data && data.results && data.results[0]) {
            const firstImage = data.results[0];
            htmlContent = `<figure>
                <img src = "${firstImage.urls.regular}" alt = "${searchedForText}">
                <figcaption> ${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;
        } else {
            htmlContent = '<div class = "error-no-image">No image available</div>';
        }

        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function addArticles() {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);

        if (data.response && data.response.docs && data.response.docs.length > 1) {
            htmlContent = '<ul>' + data.response.docs.map(article => `<li class = "article">
                  <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                  <p>${article.snippet}</p>
              </li>`
            ).join('') + '</ul>';
        } else {
            htmlContent = '<div class = "error-no-articles">No articles available</div>';
        }

        responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    }

    function requestError(e, part) {
        responseContainer.insertAdjacentHTML('beforeend', `<p class = "network-warning error=${part}">Oh no!</p>`);
    }
})();
