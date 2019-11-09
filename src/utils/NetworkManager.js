import axios from 'axios';

function getNetwork() {
  global = (typeof (window) === 'undefined') ? global : window;

  global.Network = global.Network || {
    component: null,
    preferences: {},
  };

  return global.Network;
}

export const setupAxios = (component) => {
  getNetwork().component = component;
};

export const addAxiosPreferences = (key, preferences) => {
  getNetwork().preferences[key] = preferences;
};

const addInterceptors = (instance) => {
  if (getNetwork().component) {
    instance.interceptors.response.use((response) => {
      getNetwork().component.hideLoading();
      return response;
    }, (error) => {
      getNetwork().component.hideLoading();
      if (error && error.response) {
        if (error.response.status === 401) {
          if (Network.component.unauthorized) {
            Network.component.unauthorized();
          }
          return Promise.reject(null);
        }

        return Promise.reject(error);
      } else {
        console.log(error);
      }

      return Promise.reject(null);
    });
  }
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
      if (getNetwork().component && getNetwork().component.showLoading) {
        getNetwork().component.showLoading();
      }

      getRequestInterceptors(key)(instance);

      return instance;
    }, (error) => {
      console.log(error);
    });

    addInterceptors(instance);
    resolve(instance);
  });
