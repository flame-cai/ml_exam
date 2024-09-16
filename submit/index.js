// index.js
export default function load_ipython_extension() {
    // Register a new command to handle the download
    window.addEventListener('message', function(event) {
        if (event.data.type === 'DOWNLOAD_NOTEBOOK') {
            const notebookPath = event.data.notebookPath;
            fetch(notebookPath)
                .then(response => response.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'notebook.ipynb'; // Name of the downloaded file
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                })
                .catch(error => console.error('Error downloading notebook:', error));
        }
    });
}
