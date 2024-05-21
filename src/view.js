import { onSubmit } from './app.js';

const input = document.querySelector('.form-control');
const formMessageNode = document.querySelector('.feedback');
const form = document.querySelector('.rss-form');

// const submit = document.querySelector('[type="submit"]');
// inputValue.addEventListener("input");

export const subscribe = () => {
    form.addEventListener('submit', onSubmit);
}

export const render = (path, newValue) => {
    switch(path) {
        case 'form.isError': 
        if (newValue) {
            input.classList.add('is-invalid');
            formMessageNode.classList.remove('text-success');
            formMessageNode.classList.add('text-danger')
        } else {
            input.classList.remove('is-invalid');
            formMessageNode.classList.remove('text-danger');
            formMessageNode.classList.add('text-success');
            form.reset();
            input.focus();
        }
        break
        case 'form.message':
            formMessageNode.innerHTML = newValue;
            break
    }
}