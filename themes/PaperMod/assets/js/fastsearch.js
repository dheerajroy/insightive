import * as params from '@params';

const resList = document.getElementById('searchResults');
const sInput = document.getElementById('searchInput');
const searchBox = document.getElementById('searchbox');
const searchTags = document.getElementById('searchTags');
const searchCount = document.getElementById('searchCount');

let fuse;
let searchIndex = [];
let selectedTag = '';
let currentElement = null;
let firstResult = null;
let lastResult = null;

const defaultFuseOptions = {
    distance: 100,
    threshold: 0.4,
    ignoreLocation: true,
    keys: ['title', 'permalink', 'summary', 'content', 'tags']
};

const buildFuseOptions = () => {
    if (!params.fuseOpts) {
        return defaultFuseOptions;
    }

    return {
        isCaseSensitive: params.fuseOpts.iscasesensitive ?? false,
        includeScore: params.fuseOpts.includescore ?? false,
        includeMatches: params.fuseOpts.includematches ?? false,
        minMatchCharLength: params.fuseOpts.minmatchcharlength ?? 1,
        shouldSort: params.fuseOpts.shouldsort ?? true,
        findAllMatches: params.fuseOpts.findallmatches ?? false,
        keys: params.fuseOpts.keys ?? defaultFuseOptions.keys,
        location: params.fuseOpts.location ?? 0,
        threshold: params.fuseOpts.threshold ?? defaultFuseOptions.threshold,
        distance: params.fuseOpts.distance ?? defaultFuseOptions.distance,
        ignoreLocation: params.fuseOpts.ignorelocation ?? defaultFuseOptions.ignoreLocation
    };
};

const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = window.setTimeout(() => fn(...args), delay);
    };
};

const reset = () => {
    currentElement = null;
    firstResult = null;
    lastResult = null;
    selectedTag = '';
    sInput.value = '';
    resList.innerHTML = '';
    searchCount.textContent = '';
    updateTagSelection();
    sInput.focus();
};

const setActiveResult = (element) => {
    document.querySelectorAll('.focus').forEach((item) => item.classList.remove('focus'));

    if (!element) {
        return;
    }

    element.focus();
    element.parentElement?.classList.add('focus');
    currentElement = element;
};

const updateTagSelection = () => {
    if (!searchTags) {
        return;
    }
    searchTags.querySelectorAll('button').forEach((button) => {
        button.classList.toggle('active', button.dataset.tag === selectedTag);
    });
};

const renderResults = (results) => {
    resList.innerHTML = '';
    if (!Array.isArray(results) || results.length === 0) {
        searchCount.textContent = selectedTag ? `No results for ${selectedTag}` : 'No results yet';
        firstResult = lastResult = currentElement = null;
        return;
    }

    const fragment = document.createDocumentFragment();

    for (const result of results) {
        const li = document.createElement('li');
        const title = document.createElement('span');
        title.textContent = result.item.title;
        title.className = 'search-result-title';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '24');
        svg.setAttribute('height', '24');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        svg.classList.add('feather', 'feather-chevrons-right');
        svg.innerHTML = '<polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline>';

        const link = document.createElement('a');
        link.className = 'entry-link';
        link.href = result.item.permalink;
        link.setAttribute('aria-label', result.item.title);

        li.appendChild(title);
        li.appendChild(svg);
        li.appendChild(link);
        fragment.appendChild(li);
    }

    resList.appendChild(fragment);
    firstResult = resList.firstElementChild;
    lastResult = resList.lastElementChild;
    searchCount.textContent = `${results.length} result${results.length === 1 ? '' : 's'}`;
};

const filterByTag = (results) => {
    if (!selectedTag) {
        return results;
    }
    return results.filter((result) => Array.isArray(result.item.tags) && result.item.tags.includes(selectedTag));
};

const performSearch = () => {
    if (!fuse || !searchIndex || !Array.isArray(searchIndex)) {
        return;
    }

    const query = sInput.value.trim();
    let results = [];

    if (query) {
        const searchOptions = params.fuseOpts?.limit ? { limit: params.fuseOpts.limit } : undefined;
        results = searchOptions ? fuse.search(query, searchOptions) : fuse.search(query);
    } else {
        results = searchIndex.map((item) => ({ item }));
    }

    results = filterByTag(results);
    renderResults(results);
};

const renderTags = (items) => {
    if (!searchTags || !Array.isArray(items) || items.length === 0) {
        return;
    }

    const tags = new Set();
    items.forEach((item) => {
        if (Array.isArray(item.tags)) {
            item.tags.forEach((tag) => tags.add(tag));
        }
    });

    if (tags.size === 0) {
        searchTags.innerHTML = '';
        return;
    }

    const fragment = document.createDocumentFragment();
    const allButton = document.createElement('button');
    allButton.type = 'button';
    allButton.textContent = 'All tags';
    allButton.dataset.tag = '';
    allButton.className = 'search-tag';
    fragment.appendChild(allButton);

    Array.from(tags).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })).forEach((tag) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = tag;
        button.dataset.tag = tag;
        button.className = 'search-tag';
        fragment.appendChild(button);
    });

    searchTags.innerHTML = '';
    searchTags.appendChild(fragment);
    updateTagSelection();
};

const initSearch = async () => {
    if (!sInput || !resList) {
        return;
    }

    sInput.disabled = false;
    sInput.focus();

    try {
        const response = await fetch('../index.json');
        if (!response.ok) {
            throw new Error(`Search index load failed: ${response.status}`);
        }

        const data = await response.json();
        if (data) {
            searchIndex = data;
            fuse = new Fuse(data, buildFuseOptions());
            renderTags(data);
        }
    } catch (error) {
        console.error(error);
    }
};

window.addEventListener('load', initSearch);

sInput?.addEventListener('input', debounce(performSearch, 150));

searchButton?.addEventListener('click', () => {
    sInput?.focus();
    performSearch();
});

searchTags?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-tag]');
    if (!button) {
        return;
    }
    selectedTag = button.dataset.tag || '';
    updateTagSelection();
    performSearch();
});

sInput?.addEventListener('search', () => {
    if (!sInput.value) {
        performSearch();
    }
});

document.addEventListener('keydown', (event) => {
    const { key } = event;
    const active = document.activeElement;
    const isInSearchBox = searchBox?.contains(active);

    if (key === 'Escape') {
        reset();
        return;
    }

    if (!firstResult || !isInSearchBox) {
        return;
    }

    if (key === 'ArrowDown') {
        event.preventDefault();

        if (active === sInput) {
            setActiveResult(firstResult.querySelector('.entry-link'));
        } else if (active?.parentElement !== lastResult) {
            setActiveResult(active?.parentElement?.nextElementSibling?.querySelector('.entry-link'));
        }
    } else if (key === 'ArrowUp') {
        event.preventDefault();

        if (active?.parentElement === firstResult) {
            setActiveResult(sInput);
        } else if (active !== sInput) {
            setActiveResult(active?.parentElement?.previousElementSibling?.querySelector('.entry-link'));
        }
    } else if (key === 'ArrowRight') {
        if (active?.matches?.('.entry-link')) {
            active.click();
        }
    }
});
