import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import render from './view.js';
import ru from './locales/ru.js';
import parser from './parser.js';

const getAxiosResponse = (link) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`);

const updatePosts = (state) => {
  const existPosts = state.form.posts;
  const oldPosts = _.cloneDeep(existPosts);
  const url = state.form.field;

  getAxiosResponse(url)
    .then((response) => {
      // console.log('response', response)

      const data = parser(response.data.contents);

      console.log('data', data)
      const newPosts = data.posts;
      console.log('newPosts', newPosts)
    //   newPosts.forEach((newPost) => {
    //     const foundPosts = !oldPosts.find((oldPost) => oldPost.link === newPost.link);

    //     if (foundPosts) {
    //       state.form.posts.push(newPost);
    //     }
    //   });
    // })

    return Promise.all(newPosts.map((newPost) => {
      const foundPosts = !oldPosts.find((oldPost) => oldPost.link === newPost.link);

      if (foundPosts) {
        state.form.posts.push(newPost);
      }
    }));
  })
    .catch((error) => {
      console.error('Ошибка при обновлении постов:', error.message); 
    })
    .then(() => {
      setTimeout(() => updatePosts(state), 5000);
    });
};

const isValidRSS = (rssData) => {
  try {
    const parserData = new DOMParser();
    const xmlDoc = parserData.parseFromString(rssData, 'text/xml');
    return xmlDoc.querySelector('rss') !== null;
  } catch (e) {
    return false;
  }
};

const app = () => {
  // step 1: get DOM elements
  const elements = {
    form: document.querySelector('form'),
    buttonSubmit: document.querySelector('button[type="submit"]'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'), // a message at the bottom of input
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
  };

  // step 2: init state
  const initialState = {
    form: {
      field: '',
      status: 'filling',
      valid: 'valid',
      addedLinks: [], // save already addded links
      errors: null,
      feeds: [],
      posts: [],
      readPosts: [], // save already read posts
    },
  };

  // step 3: init i18Next
  const i18Instance = i18next.createInstance();
  const defaultLang = 'ru';
  i18Instance.init({
    lng: defaultLang,
    resources: { // get from /locales/ru.js
      ru,
    },
  })

  // step 4: set locale "notOneOf()" for using links were already added
    .then(() => {
      yup.setLocale({
        mixed: {
          notOneOf: i18Instance.t('addedLink'),
        },
        string: {
          url: i18Instance.t('invalidLink'),
        },
      });

      // step 5: watch for state
      const watchedState = onChange(initialState, render(initialState, elements, i18Instance));

      const addFeeds = (id, title, description, state) => {
        state.form.feeds.push({ id, title, description });
      };

      const addPosts = (feedId, posts, state) => {
        const result = posts.map((post) => ({
          feedId,
          id: _.uniqueId(),
          title: post.title,
          description: post.description,
          link: post.link,
        }));
        state.form.posts = result.concat(watchedState.form.posts);
      };

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        watchedState.form.status = 'sending';
        const formData = new FormData(e.target);
        const value = formData.get('url'); // get value in input

        yup
          .string()
          .trim()
          .url(i18Instance.t('errors.invalidLink')) // instead of message of error - message from locales/ru.js
          .notOneOf(watchedState.form.addedLinks, i18Instance.t('errors.addedLink'))
          .validate(value) // check validation
          .then((url) => getAxiosResponse(url)) // return xmlDocument

          .then((response) => {
            if (!isValidRSS(response.data.contents)) {
              throw new Error(i18Instance.t('errors.notRss')); // If RSS invalid - error
            }
            const parsedRSS = parser(response.data.contents);
            const title = parsedRSS.feed.channelTitle;
            const description = parsedRSS.feed.channelDescription;
            const feedId = _.uniqueId();

            addFeeds(feedId, title, description, watchedState);
            addPosts(feedId, parsedRSS.posts, watchedState);
          })
          .then(() => { // in case - validation
            watchedState.form.valid = 'valid';
            
          // })
          // .then(() => { // add in alreadyAdded when previous success
            watchedState.form.addedLinks.push(value);
            watchedState.form.status = 'sent';
            watchedState.form.field = value;
            console.log('watchedState', watchedState  )
          })
          .catch((error) => {
            watchedState.form.valid = 'invalid';
            // console.log('error.message', error.message)
            if (error.message === 'Network Error') {
              watchedState.form.errors = i18Instance.t('errors.notNetwork');
            } else {
              watchedState.form.errors = error.message;
            }
            watchedState.form.status = 'failed';
          })
          .finally(() => {
            watchedState.form.status = 'filling';
          });
      });
      updatePosts(watchedState);
    });
};

export default app;
