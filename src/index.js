import Actioner from './utils/Actioner';
import ModalParams from './utils/ModalParams';
import { setupAxios, getAxios, addAxiosPreferences, getBaseUrl, getHeadersSetter, getRequestInterceptors } from './utils/NetworkManager';
import {
  getErrorDescription,
  getFieldError,
  getFieldsError,
  getNotificationDuration,
  getMessageDuration,
  formatMoney,
  formatDate,
  formatTime,
  formatImageUrl,
  formatInteger,
  formatBooleanSign,
  renderTextField,
  renderNumericField,
  renderObject,

  renderMoney,
  renderData,
  renderTime,
  renderBoolean,
  renderImage,
  TextField,
  TextAreaField,
  NumericField,
  LinkTag,
  massageField,
  UploadField,
  CheckboxField,

  Money,
} from './utils/UIManager';
import FilterSelect from './utils/FilterSelect';
import SimpleSelect from './utils/SimpleSelect';
import TableParams from './utils/TableParams';
import ItemLoader from './utils/ItemLoader';
import Draggable from './utils/Draggable';
import SelectField from './utils/SelectField';

import BaseModel from './models/BaseModel';

import BreadcrumbsNavigator from './components/BreadcrumbsNavigator';
import { expandRoutes, matchRoutes, matchBreadcrumbs, matchRouteParams, matchRouteProperty } from './components/BreadcrumbsNavigator';
import CustomPagination from './components/CustomPagination';
import ErrorContainer from './components/ErrorContainer';
import TabContainer from './components/TabContainer';
import BaseRouteComponent from './components/BaseRouteComponent';
import DetailsContainer from './components/DetailsContainer';
import FiltersContainer from './components/FiltersContainer';
import LightboxContainer from './components/LightboxContainer';
import LoaderContent from './components/LoaderContent';
import CustomReactQuill from './components/CustomReactQuill';
import SiderEditor from './components/SiderEditor';
import renderActions from './components/renderActions';

import BreadcrumbsReducer from './reducers/breadcrumbs';
import SSRReducer from './reducers/ssr';
import HelmetReducer from './reducers/helmet';
import LightboxReducer from './reducers/lightbox';

import { setupBreadcrumbIdentifiers } from './actions/breadcrumbs';
import { setupSSRItems } from './actions/ssr';
import { setupHelmet } from './actions/helmet';
import { openLightbox, dismissLightbox } from './actions/lightbox';

export {
  Actioner,
  ModalParams,
  setupAxios,
  getAxios,
  addAxiosPreferences,
  getBaseUrl,
  getHeadersSetter,
  getErrorDescription,
  getFieldError,
  getFieldsError,
  getNotificationDuration,
  getMessageDuration,
  BaseModel,
  FilterSelect,
  SimpleSelect,
  TableParams,
  formatMoney,
  formatDate,
  formatTime,
  formatImageUrl,
  BreadcrumbsNavigator,
  BreadcrumbsReducer,
  setupBreadcrumbIdentifiers,
  expandRoutes,
  matchRoutes,
  matchBreadcrumbs,
  matchRouteParams,
  matchRouteProperty,
  CustomPagination,
  ItemLoader,
  ErrorContainer,
  BaseRouteComponent,
  TabContainer,
  DetailsContainer,
  FiltersContainer,
  SSRReducer,
  setupSSRItems,
  Draggable,
  LightboxReducer,
  openLightbox,
  dismissLightbox,
  LightboxContainer,
  formatInteger,
  formatBooleanSign,
  LoaderContent,
  CustomReactQuill,
  SiderEditor,
  renderActions,
  HelmetReducer,
  setupHelmet,
  renderTextField,
  renderNumericField,
  renderObject,

  renderMoney,
  renderData,
  renderTime,
  renderBoolean,
  TextField,
  NumericField,
  LinkTag,
  SelectField,
  massageField,
  UploadField,
  renderImage,
  CheckboxField,
  TextAreaField,

  Money,
};

