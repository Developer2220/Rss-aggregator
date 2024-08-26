import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import render from './view.js';
import ru from './locales/ru.js';
import parser from './parser.js';

const getAxiosResponse = (link) => axios.get(
  `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
    link,
  )}`,
);

const updatePosts = (state) => {
  const existPosts = state.form.posts;
  const oldPosts = _.cloneDeep(existPosts);
  const urls = state.form.addedLinks;

  const requests = urls.map((url) => getAxiosResponse(url).then((response) => {
    const data = parser(response.data.contents);
    return data.posts;
  }));

  Promise.all(requests)
    .then((allNewPosts) => {
      allNewPosts.flat().forEach((newPost) => {
        const isPostNew = !oldPosts.find(
          (oldPost) => oldPost.link === newPost.link,
        );

        if (isPostNew) {
          newPost.id = _.uniqueId();
          state.form.posts.push(newPost);
        }
      });
    })
    .catch((error) => {
      console.error('Ошибка при обновлении постов:', error.message);
    })
    .finally(() => {
      setTimeout(() => updatePosts(state), 5000);
    });
};

const i18Instance = i18next.createInstance();
const defaultLang = 'ru';

const app = () => {
  const elements = {
    form: document.querySelector('form'),
    buttonSubmit: document.querySelector('button[type="submit"]'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
  };

  const initialState = {
    form: {
      field: '',
      status: 'filling',
      valid: 'valid',
      addedLinks: [],
      errors: null,
      feeds: [],
      posts: [],
      readPosts: [],
    },
  };

  i18Instance
    .init({
      lng: defaultLang,
      resources: {
        ru,
      },
    })

    .then(() => {
      yup.setLocale({
        mixed: {
          notOneOf: i18Instance.t('addedLink'),
        },
        string: {
          url: i18Instance.t('invalidLink'),
        },
      });

      const watchedState = onChange(
        initialState,
        render(initialState, elements, i18Instance),
      );

      const addFeeds = (id, title, description, state) => {
        state.form.feeds.push({ id, title, description });
      };

      const addPosts = (feedId, posts, state) => {
        const result = posts.map((post) => {
          const postId = _.uniqueId();
          return {
            feedId,
            id: postId,
            title: post.title,
            description: post.description,
            link: post.link,
          };
        });
        state.form.posts = result.concat(state.form.posts);
      };

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        watchedState.form.status = 'sending';
        const formData = new FormData(e.target);
        const value = formData.get('url');

        yup
          .string()
          .trim()
          .url(i18Instance.t('errors.invalidLink'))
          .notOneOf(
            watchedState.form.addedLinks,
            i18Instance.t('errors.addedLink'),
          )
          .validate(value)
          .then((url) => getAxiosResponse(url))

          .then((response) => {
            const parsedRSS = parser(response.data.contents);
            const title = parsedRSS.feed.channelTitle;
            const description = parsedRSS.feed.channelDescription;
            const feedId = _.uniqueId();

            addFeeds(feedId, title, description, watchedState);
            addPosts(feedId, parsedRSS.posts, watchedState);
          })
          .then(() => {
            watchedState.form.valid = 'valid';
            watchedState.form.addedLinks.push(value);
            watchedState.form.status = 'sent';
            watchedState.form.field = value;
          })
          .catch((error) => {
            watchedState.form.valid = 'invalid';
            if (error.message === 'Network Error') {
              watchedState.form.errors = i18Instance.t('errors.notNetwork');
            } else if (error.message === 'notRss') {
              watchedState.form.errors = i18Instance.t('errors.notRss');
            } else {
              watchedState.form.errors = error.message;
            }
            watchedState.form.status = 'failed';
          })
          .finally(() => {
            watchedState.form.status = 'filling';
          });
      });

      elements.posts.addEventListener('click', (e) => {
        const idClick = e.target.dataset.id;
        if (idClick) {
          watchedState.form.readPosts.push(idClick);
        }
      });
      updatePosts(watchedState);
    });
};

export { i18Instance };
export default app;
