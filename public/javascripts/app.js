const keyAttractions = () => {
    let li = document.createElement('li');
    li.textContent = document.getElementById('keyAttractions').value;
    let ul = document.getElementById('attractions');
    ul.append(li);
}

const addAttraction = () => {
    const submit = document.getElementById('submit');
    submit.addEventListener('click', keyAttractions)
}

addAttraction();