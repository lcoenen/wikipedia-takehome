// Load the table of content when the form is submitted
window.onload = function() {
  document.querySelector('input[type=button]').onclick = queryTableOfContent;

	// Hide the table of content container
  const toc = document.querySelector('#table_of_content');
	toc.style.display = 'none';
};

// Query the API and pass the article to parseTableOfContent
function queryTableOfContent($event) {
  const article = document.querySelector('#article').value;
  const language = document.querySelector('#language').value;

  const rootUri = `https://${language}.wikipedia.org/api/rest_v1/page`;
  const uri = `${rootUri}/html/${encodeURI(article)}`;

  // Target URI (user-facing wikipedia page)
  const canonicalUri = `https://${language}.wikipedia.org/wiki/${encodeURI(
    article,
  )}`;

  fetch(uri, {method: 'get'})
    .then(answer => answer.text())
    .then(html => parseTableOfContent(html, canonicalUri));
}

// Parse the article and re-render the table of content
function parseTableOfContent(html, targetUri) {
  // Empty the table of content
  document.querySelector('#error').style.display = 'none';
  const toc = document.querySelector('#table_of_content');
	toc.style.display = 'none';
  toc.innerHTML = '';

  // Attempt to parse html as a JSON object
  // (which means the page doesn't exists)
  try {
    const answer = JSON.parse(html);
    document.querySelector('#error').style.display = 'block';
  } catch (error) {
    // Create a dummy DOM object to parse
    const node = document.createElement('div');
    node.innerHTML = html;
    const titles = node.querySelectorAll('h2');

    let titleCounter = 0;

    // Render the table of content
    for (title of titles) {
      const titleTarget = `${targetUri}#${encodeURI(title.id)}`;
      addTitle(title.innerText, titleTarget, ++titleCounter, toc);

      let subtitleCounter = 0;
      const subtitles = title.parentNode.querySelectorAll('h3');
      for (subtitle of subtitles) {
        const subtitleTarget = `${targetUri}#${encodeURI(subtitle.id)}`;
        addSubtitle(
          subtitle.innerText,
          subtitleTarget,
          titleCounter,
          ++subtitleCounter,
          toc,
        );
      }
    }

    toc.style.display = 'block';
  }
}

// Add a title to the table of content
function addTitle(content, targetUri, n, toc) {
  const link = document.createElement('a');
  link.innerText = `${n}. ${content}`;
  link.href = targetUri;
	link.className = 'title';
  toc.appendChild(link);
}

// Add a title to the table of content
function addSubtitle(content, targetUri, titleN, n, toc) {
  const link = document.createElement('a');
  link.innerText = `${titleN}.${n}. ${content}`;
  link.href = targetUri;
	link.className = 'subtitle';
  toc.appendChild(link);
}
