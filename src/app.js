import * as Yup from 'yup';
import onChange from 'on-change';
import { subscribe, render } from './view.js';
import i18next from 'i18next';


const state = {
  form: {
    isError: null,
    message: '',
  },
  feeds: [],
};

const watchedState = onChange(state, render)

const validateUrl = async (url) => {
  try {
    Yup.string().trim().required().url().notOneOf(watchedState.feeds).validate(url);
    return true
  } catch {
    return false
  }
};

export const onSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target)
  // console.log(formData.get('url'))
  const url = formData.get('url')
  const isValid = await validateUrl(url);
  if (isValid) {
    watchedState.form.isError = false;
    watchedState.form.message = 'RSS успешно загружен';
    watchedState.feeds.push(url);
    //отправляем запрос на url
  } else {
    watchedState.form.isError = true;
    watchedState.form.message = 'Ссылка должна быть валидным URL'
  }
}

export const app = () => {
  subscribe();
}

// const formSchema = object().shape({
//   inputValue: string()
//     .url(t("urlIncorrect"))
//     .required(t("notEmpty"))
//     .notOneOf(loadedFeeds, t("urlExist")),
// });

// const submit = document.querySelector('[type="submit"]');

// const inputValue = document.querySelector(".form-control");
// inputValue.addEventListener("input");
