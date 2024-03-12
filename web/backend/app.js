// app.js

// Function to load content based on hash
function loadContent() {
    const hash = window.location.hash.substr(1);
    const contentDiv = document.getElementById('content');

    $.ajax({
        url: "./components/contents/"+hash+".php", // Path to your PHP file
        type: 'GET',
        dataType: 'html',
        success: function(response) {
            contentDiv.innerHTML = response;
        },
        error: function(xhr, status, error) {
            console.error(xhr.responseText);
        }
    });
}

// Event listener for hash change
window.addEventListener('hashchange', loadContent);

// Initial load
loadContent();
