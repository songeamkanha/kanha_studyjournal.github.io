// Load the marked library
document.addEventListener('DOMContentLoaded', function() {
    // Load marked library
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    document.head.appendChild(script);

    script.onload = function() {
        // Process all markdown content
        const markdownElements = document.querySelectorAll('.markdown-content');
        markdownElements.forEach(element => {
            const markdown = element.textContent;
            element.innerHTML = marked.parse(markdown);
        });
    };
}); 