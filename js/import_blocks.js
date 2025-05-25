export function include_layout(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data})
        .catch(error => console.log(error));
}