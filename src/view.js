
const errorHandler = (elem, err) => {
    const elements = {...elem}// to change copy of elem (lint doesnt like it)
    elements.input.classList.replace('is-valid', 'is-invalid');
    elements.feedback.classList.replace('text-success', 'text-danger');
    elements.feedback.textContent = err;
    elements.input.focus();
    elements.form.reset();
}

const finishErrorHandler = (elem, i18Instance) => {
    const elements = {...elem}; // get copy of elements (linter doesnt like it)
    elements.input.classList.replace('is-invalid', 'is-valid');
    elem.feedback.classList.replace('text-danger', 'text-success');
    elements.feedback.textContent = i18Instance.t('upload');
    elements.input.focus();
    elements.form.reset();
};

const render = (state, elements, i18Instance) => (path, value) => {
    switch(path) {
        case 'form.status':
            if (value === 'failed') {
                errorHandler(elements, state.form.errors);
            }
            if (value === 'sent') {
                finishErrorHandler(elements, i18Instance)
            }
            break;
        case 'form.feeds': {
            makeContainer(elements, state, 'feeds', i18Instance);
            break
            }
            default:
            break;
    }
}

const makeContainer = (elements, state, title,  i18Instance) => {
    elements[title].textContent = '';

    const card = document.createElement('div'); 
    card.classList.add('card', 'border-0');
    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body');
    const cardTitle = document.createElement('h2')
    cardTitle.classList.add( 'card-title', 'h4');
    cardTitle.textContent = i18Instance.t(title);
    cardBody.append(cardTitle);
    card.append(cardBody)
    elements[title].append(card);
    if (title === 'feeds') {
        const listGroup = document.createElement('ul')
        listGroup.classList.add('list-group', 'border-0', 'rounded-0');
        state.form.feeds.forEach((feed) => {
            const listGroupItem = document.createElement('li')
            listGroupItem.classList.add('list-group-item', 'border-0', 'border-end-0');
            const h3 = document.createElement('h3');
            h3.classList.add('h6', 'm-0')
            h3.textContent = feed.title;
            const p = document.createElement('p');
            p.classList.add('m-0', 'small', 'text-black-50')
            p.textContent = feed.description;
            listGroupItem.append(h3, p)
            listGroup.append(listGroupItem);
        })
        card.append(listGroup)
        // if (title === 'posts') {
            
        // }
            
    
    }

   
}

export default render;