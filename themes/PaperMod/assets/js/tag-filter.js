const tagFilter = document.getElementById('tagFilter');
const postEntries = document.querySelectorAll('.post-entry');

if (tagFilter && postEntries.length > 0) {
    tagFilter.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-tag]');
        if (!button) {
            return;
        }

        const selectedTag = button.dataset.tag;
        tagFilter.querySelectorAll('button[data-tag]').forEach((btn) => {
            btn.classList.toggle('active', btn === button);
        });

        postEntries.forEach((entry) => {
            const tags = entry.dataset.tags ? entry.dataset.tags.split(',') : [];
            if (!selectedTag || tags.includes(selectedTag)) {
                entry.style.display = '';
            } else {
                entry.style.display = 'none';
            }
        });
    });
}
