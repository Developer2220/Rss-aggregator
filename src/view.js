const errorHandler = (elem, err) => {
  const elements = { ...elem }; // to change copy of elem (lint doesnt like it)
  elements.input.classList.replace("is-valid", "is-invalid");
  elements.feedback.classList.replace("text-success", "text-danger");
  elements.feedback.textContent = err;
  elements.input.focus();
};

const finishErrorHandler = (elem, i18Instance) => {
  const elements = { ...elem }; // get copy of elements (linter doesnt like it)
  elements.input.classList.replace("is-invalid", "is-valid");
  elem.feedback.classList.replace("text-danger", "text-success");
  elements.feedback.textContent = i18Instance.t("upload");
  elements.input.focus();
  elements.form.reset();
};



// const renderModalWindow = (elem, posts) => {
//   const elements = { ...elem };
// //   const modalTitle = document.querySelector(".modal-title");
// //   const modalBody = document.querySelector(".modal-body");

//   const result = posts.forEach((post) => {
//     console.log('post', post)
    
//     elements.modalTitle.textContent = 'title';
//     elements.modalBody.textContent = 'description';
// });
// // console.log('result', result)
// return result;
// };


// const renderModalWindow = (elem, posts, postId) => {
//     const elements = { ...elem };
//     // console.log('posts', posts)
//     // Найти нужный пост по его id

//     console.log('posts:', posts);
//     console.log('postId:', postId);
    
//     const post = posts.find((post) => post.id === postId[postId.length - 1]);
//     console.log('post', post)
  
//     if (post) {
//     //   Установить текст заголовка и описания в модальное окно
//       elements.modalTitle.textContent = post.title;
//       elements.modalBody.textContent = post.description;
//     }

//      const postLink = elements.posts.querySelector(`a[data-id="${post.id}"]`);
//   if (postLink) {
//     postLink.classList.replace('fw-bold', 'fw-normal');
//   }
//   };

// if (!state.form.readPosts.includes(post.id)) {
//     state.form.readPosts.push(post.id);
    // a.classList.replace('fw-bold', 'fw-normal');
//   }

const renderModalWindow = (elements, post) => {

    if (!post) {
        console.error('Post not found:', post);
        return;
      }

    // Обновляем заголовок и описание в модальном окне
    elements.modalTitle.textContent = post.title;
    elements.modalBody.textContent = post.description;
  
    // Меняем класс ссылки с 'fw-bold' на 'fw-normal'
    const postLink = elements.posts.querySelector(`a[data-id="${post.id}"]`);
    if (postLink) {
      postLink.classList.replace('fw-bold', 'fw-normal');
    }
  };
  


const makeContainer = (elements, state, title, i18Instance) => {
  elements[title].textContent = "";

  const card = document.createElement("div");
  card.classList.add("card", "border-0");
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  const cardTitle = document.createElement("h2");
  cardTitle.classList.add("card-title", "h4");
  cardTitle.textContent = i18Instance.t(title);
  cardBody.append(cardTitle);
  card.append(cardBody);

  const listGroup = document.createElement("ul");
  listGroup.classList.add("list-group", "border-0", "rounded-0");

  if (title === "feeds") {
    state.form.feeds.forEach((feed) => {
      const listGroupItem = document.createElement("li");
      listGroupItem.classList.add(
        "list-group-item",
        "border-0",
        "border-end-0"
      );
      const h3 = document.createElement("h3");
      h3.classList.add("h6", "m-0");
      h3.textContent = feed.title;
      const p = document.createElement("p");
      p.classList.add("m-0", "small", "text-black-50");
      p.textContent = feed.description;
      listGroupItem.append(h3, p);
      listGroup.append(listGroupItem);
    });
  }
  if (title === "posts") {
    state.form.posts.forEach((post) => {
      const listGroupItem = document.createElement("li");
      listGroupItem.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-start",
        "border-0",
        "border-end-0"
      );

      const a = document.createElement("a");
      const isRead = state.form.readPosts.includes(post.id);
      a.classList.add(isRead ? "fw-normal" : "fw-bold");
      a.setAttribute("data-id", `${post.id}`);
      a.setAttribute("target", "_blank");
      a.setAttribute("href", `${post.link}`);
      a.setAttribute("rel", "noopener noreferrer");
      a.textContent = post.title;

      const button = document.createElement("button");
      button.classList.add("btn", "btn-outline-primary", "btn-sm");
      button.setAttribute("data-id", `${post.id}`);
      button.setAttribute("data-bs-toggle", "modal");
      button.setAttribute("data-bs-target", "#modal");
      button.textContent = i18Instance.t("show");

      //   button.addEventListener('click', () => {
      //     const modalTitle = document.querySelector('.modal-title');
      //     const modalBody = document.querySelector('.modal-body');
      //     modalTitle.textContent = post.title;
      //     modalBody.textContent = post.description;

      // if (!state.form.readPosts.includes(post.id)) {
      //   state.form.readPosts.push(post.id);
      //   a.classList.replace('fw-bold', 'fw-normal');
      // }
      //   });

      listGroupItem.append(a, button);
      listGroup.append(listGroupItem);
    });
  }
  card.append(listGroup);
  elements[title].append(card);
};

const render = (state, elements, i18Instance) => (path, value) => {

  console.log('Path:', path);
  console.log('Value:', value);

  switch (path) {
    case "form.status":
      if (value === "failed") {
        errorHandler(elements, state.form.errors);
      }
      if (value === "sent") {
        finishErrorHandler(elements, i18Instance);
      }
      break;
    case "form.feeds": {
      makeContainer(elements, state, "feeds", i18Instance);
      break;
    }
    case "form.posts": {
      makeContainer(elements, state, "posts", i18Instance);
      break;
    }
    case "form.readPosts": {
    //  let postId = value;
    // renderModalWindow(elements, state.form.posts, postId);

    const postId = value[value.length - 1]; // Получаем последний прочитанный пост
    console.log('postId:', postId);  
      const post = state.form.posts.find((p) => p.id === postId);
      console.log('post:', post);  
      renderModalWindow(elements, post);

      break
    }
    default:
      break;
  }
};

export default render;
