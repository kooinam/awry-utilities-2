import axios from 'axios';

function getNetwork() {
  global = (typeof (window) === 'undefined') ? global : window;

  global.Network = global.Network || {
    onLoadStart: null,
    onLoadEnd: null,
    onUnauthorized: null,
    preferences: {},
  };

  return global.Network;
}

export const setupAxios = (onLoadStart, onLoadEnd, onUnauthorized) => {
  getNetwork().onLoadStart = onLoadStart;
  getNetwork().onLoadEnd = onLoadEnd;
  getNetwork().onUnauthorized = onUnauthorized;
};

export const addAxiosPreferences = (key, preferences) => {
  getNetwork().preferences[key] = preferences;
};

const addInterceptors = (instance) => {
    instance.interceptors.response.use((response) => {
      if (getNetwork().onLoadEnd) {
        getNetwork().onLoadEnd();
      }

      return response;
    }, (error) => {
      if (getNetwork().onLoadEnd) {
        getNetwork().onLoadEnd();
      }

      if (error && error.response) {
        if (error.response.status === 401) {
          if (getNetwork().unauthorized) {
            getNetwork().unauthorized();
          }
          return Promise.reject(null);
        }

        return Promise.reject(error);
      } else {
        console.log(error);
      }

      return Promise.reject(null);
    });
};

export const getBaseUrl = (key) => {
  let baseURL = '/api';
  const preferences = getNetwork().preferences[key];

  if (preferences) {
    baseURL = preferences.baseURL;
  }

  return baseURL;
};

export const getHeadersSetter = (key) => {
  let headersSetter = () => {
    return {};
  };
  const preferences = getNetwork().preferences[key];

  if (preferences && preferences.headersSetter) {
    headersSetter = preferences.headersSetter;
  }

  return headersSetter;
};

export const getRequestInterceptors = (key) => {
  let requestInterceptors = (instance) => {};
  const preferences = getNetwork().preferences[key];

  if (preferences && preferences.requestInterceptors) {
    requestInterceptors = preferences.requestInterceptors;
  }

  return requestInterceptors;
};

export const getAxios = (key) =>
  new Promise((resolve) => {
    const instance = axios.create({
      baseURL: getBaseUrl(key),
    });
    Object.assign(instance.defaults, {
      headers: getHeadersSetter(key)(),
    });

    instance.interceptors.request.use((instance) => {
      if (getNetwork().onLoadStart) {
        getNetwork().onLoadStart();
      }

      getRequestInterceptors(key)(instance);

      return instance;
    }, (error) => {
      console.log(error);
    });

    addInterceptors(instance);
    resolve(instance);
  });
