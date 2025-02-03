"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunktester"] = self["webpackChunktester"] || []).push([["src_bootstrap_js"],{

/***/ "./src/App.js":
/*!********************!*\
  !*** ./src/App.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ \"../.yarn/cache/@babel-runtime-npm-7.26.7-685f05ad2c-c7a661a683.zip/node_modules/@babel/runtime/helpers/esm/slicedToArray.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"webpack/sharing/consume/default/react/react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _components_WebsiteRenderer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/WebsiteRenderer */ \"./src/components/WebsiteRenderer.js\");\n\n\n\nfunction App() {\n  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null),\n    _useState2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(_useState, 2),\n    selectedComponent = _useState2[0],\n    setSelectedComponent = _useState2[1];\n  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]),\n    _useState4 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(_useState3, 2),\n    componentList = _useState4[0],\n    setComponentList = _useState4[1];\n\n  // Load component list when remote module is ready\n  react__WEBPACK_IMPORTED_MODULE_1___default().useEffect(function () {\n    __webpack_require__.e(/*! import() */ \"webpack_container_remote_WebsiteRemote_widgets\").then(__webpack_require__.t.bind(__webpack_require__, /*! WebsiteRemote/widgets */ \"webpack/container/remote/WebsiteRemote/widgets\", 23)).then(function (module) {\n      setComponentList(Object.keys(module[\"default\"]));\n    });\n  }, []);\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(\"div\", {\n    style: {\n      padding: '20px'\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(\"h1\", {\n    style: {\n      fontSize: '24px',\n      fontWeight: 'bold',\n      marginBottom: '20px'\n    }\n  }, \"Component Tester\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_components_WebsiteRenderer__WEBPACK_IMPORTED_MODULE_2__[\"default\"], null));\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);\n\n//# sourceURL=webpack://tester/./src/App.js?");

/***/ }),

/***/ "./src/bootstrap.js":
/*!**************************!*\
  !*** ./src/bootstrap.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"webpack/sharing/consume/default/react/react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ \"../.yarn/__virtual__/react-dom-virtual-7f0b11fd89/0/cache/react-dom-npm-18.2.0-dd675bca1c-ca5e7762ec.zip/node_modules/react-dom/client.js\");\n/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./App */ \"./src/App.js\");\n\n\n\nreact_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot(document.getElementById('root')).render(/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().StrictMode), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_App__WEBPACK_IMPORTED_MODULE_2__[\"default\"], null)));\n\n//# sourceURL=webpack://tester/./src/bootstrap.js?");

/***/ }),

/***/ "./src/components/BlockRenderer.js":
/*!*****************************************!*\
  !*** ./src/components/BlockRenderer.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ BlockRenderer)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ \"../.yarn/cache/@babel-runtime-npm-7.26.7-685f05ad2c-c7a661a683.zip/node_modules/@babel/runtime/helpers/esm/slicedToArray.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"webpack/sharing/consume/default/react/react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nvar loadRemoteComponent = function loadRemoteComponent(module) {\n  var remote = 'WebsiteRemote';\n  console.log('here');\n  return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.lazy)(function () {\n    return new Promise(function (resolve, reject) {\n      console.log('window[remote]', window[remote]);\n      if (!window[remote]) {\n        return reject(new Error(\"Remote \".concat(remote, \" not found\")));\n      }\n      window[remote].get(module).then(function (factory) {\n        return resolve(factory());\n      })[\"catch\"](reject);\n    });\n  });\n};\nfunction BlockRenderer(props) {\n  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null),\n    _useState2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(_useState, 2),\n    Component = _useState2[0],\n    setComponent = _useState2[1];\n  console.log('props', props);\n  var component = props.block.getBlockComponent();\n\n  // Load component list when remote module is ready\n  // useEffect(() => {\n  //     import('WebsiteRemote/widgets').then((module) => {\n  //         const component = module.default[component];\n\n  //         console.log('module.default', component, module.default['Hero']);\n  //         if (component) {\n  //             console.log('component', component);\n  //             setComponent(component);\n  //         }\n  //     });\n  // }, [component]);\n\n  console.log('Component', component);\n\n  // const Widget = lazy(() => import('WebsiteRemote/widgets/Hero'));\n\n  // console.log('widgets', Widget);\n\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(react__WEBPACK_IMPORTED_MODULE_1__.Suspense, {\n    fallback: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(\"p\", null, \"Loading...\")\n  }, Component ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(Component, props) : null);\n\n  // loadRemoteComponent(module);\n\n  // useEffect(() => {\n  //     loadRemoteComponent(module);\n  //     // .then(setComponent)\n  //     // .catch((error) => console.error(`Failed to load ${module} from ${remote}`, error));\n  // }, [module]);\n\n  // if (!Component) return fallback || <p>Loading {module}...</p>;\n}\n\n//# sourceURL=webpack://tester/./src/components/BlockRenderer.js?");

/***/ }),

/***/ "./src/components/PageRenderer.js":
/*!****************************************!*\
  !*** ./src/components/PageRenderer.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ PageRenderer)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"webpack/sharing/consume/default/react/react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _BlockRenderer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BlockRenderer */ \"./src/components/BlockRenderer.js\");\n\n\nfunction PageRenderer(props) {\n  var page = uniweb.activeWebsite.activePage;\n  if (!page) {\n    return null;\n  }\n  var blocks = page.blocks;\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, blocks.map(function (block, index) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n      key: index\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_BlockRenderer__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n      block: block\n    }));\n  }));\n}\n\n//# sourceURL=webpack://tester/./src/components/PageRenderer.js?");

/***/ }),

/***/ "./src/components/WebsiteRenderer.js":
/*!*******************************************!*\
  !*** ./src/components/WebsiteRenderer.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ WebsiteRenderer)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"webpack/sharing/consume/default/react/react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _PageRenderer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PageRenderer */ \"./src/components/PageRenderer.js\");\n\n\nfunction WebsiteRenderer(props) {\n  var website = uniweb.activeWebsite;\n  if (!website) {\n    return null;\n  }\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_PageRenderer__WEBPACK_IMPORTED_MODULE_1__[\"default\"], null);\n}\n\n//# sourceURL=webpack://tester/./src/components/WebsiteRenderer.js?");

/***/ }),

/***/ "../.yarn/__virtual__/react-dom-virtual-7f0b11fd89/0/cache/react-dom-npm-18.2.0-dd675bca1c-ca5e7762ec.zip/node_modules/react-dom/client.js":
/*!*************************************************************************************************************************************************!*\
  !*** ../.yarn/__virtual__/react-dom-virtual-7f0b11fd89/0/cache/react-dom-npm-18.2.0-dd675bca1c-ca5e7762ec.zip/node_modules/react-dom/client.js ***!
  \*************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n\nvar m = __webpack_require__(/*! react-dom */ \"webpack/sharing/consume/default/react-dom/react-dom\");\nif (false) {} else {\n  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;\n  exports.createRoot = function(c, o) {\n    i.usingClientEntryPoint = true;\n    try {\n      return m.createRoot(c, o);\n    } finally {\n      i.usingClientEntryPoint = false;\n    }\n  };\n  exports.hydrateRoot = function(c, h, o) {\n    i.usingClientEntryPoint = true;\n    try {\n      return m.hydrateRoot(c, h, o);\n    } finally {\n      i.usingClientEntryPoint = false;\n    }\n  };\n}\n\n\n//# sourceURL=webpack://tester/../.yarn/__virtual__/react-dom-virtual-7f0b11fd89/0/cache/react-dom-npm-18.2.0-dd675bca1c-ca5e7762ec.zip/node_modules/react-dom/client.js?");

/***/ }),

/***/ "../.yarn/cache/@babel-runtime-npm-7.26.7-685f05ad2c-c7a661a683.zip/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js":
/*!**************************************************************************************************************************************!*\
  !*** ../.yarn/cache/@babel-runtime-npm-7.26.7-685f05ad2c-c7a661a683.zip/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js ***!
  \**************************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ _arrayLikeToArray)\n/* harmony export */ });\nfunction _arrayLikeToArray(r, a) {\n  (null == a || a > r.length) && (a = r.length);\n  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];\n  return n;\n}\n\n\n//# sourceURL=webpack://tester/../.yarn/cache/@babel-runtime-npm-7.26.7-685f05ad2c-c7a661a683.zip/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js?");

/***/ }),

/***/ "../.yarn/cache/@babel-runtime-npm-7.26.7-685f05ad2c-c7a661a683.zip/node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js":
/*!************************************************************************************************************************************!*\
  !*** ../.yarn/cache/@babel-runtime-npm-7.26.7-685f05ad2c-c7a661a683.zip/node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js ***!
  \************************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ _arrayWithHoles)\n/* harmony export */ });\nfunction _arrayWithHoles(r) {\n  if (Array.isArray(r)) return r;\n}\n\n\n//# sourceURL=webpack://tester/../.yarn/cache/@babel-runtime-npm-7.26.7-685f05ad2c-c7a661a683.zip/node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js?");

/***/ }),

/***/ "../.yarn/cache/@babel-runtime-npm-7.26.7-685f05ad2c-c7a661a683.zip/node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js":
/*!******************************************************************************************************************************************!*\
  !*** ../.yarn/cache/@babel-runtime-npm-7.26.7-685f05ad2c-c7a661a683.zip/node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js ***!
  \******************************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ _iterableToArrayLimit)\n/* harmony export */ });\nfunction _iterableToArrayLimit(r, l) {\n  var t = null == r ? null : \"undefined\" != typeof Symbol && r[Symbol.iterator] || r[\"@@iterator\"];\n  if (null != t) {\n    var e,\n      n,\n      i,\n      u,\n      a = [],\n      f = !0,\n      o = !1;\n    try {\n      if (i = (t = t.call(r)).next, 0 === l) {\n        if (Object(t) !== t) return;\n        f = !1;\n      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);\n    } catch (r) {\n      o = !0, n = r;\n    } finally {\n      try {\n        if (!f && null != t[\"return\"] && (u = t[\"return\"](), Object(u) !== u)) return;\n      } finally {\n        if (o) throw n;\n      }\n    }\n    return a;\n  }\n}\n\n\n//# sourceURL=webpack://tester/../.yarn/cache/@babel-runtime-npm-7.26.7-685f05ad2c-c7a661a683.zip/node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js?");

/***/ }),

/***/ "../.yarn/cache/@babel-runtime-npm-7.26.7-685f05ad2c-c7a661a683.zip/node_modules/@babel/runtime/helpers/esm/nonIterableRest.js":
/*!*************************************************************************************************************************************!*\
  !*** ../.yarn/cache/@babel-runtime-npm-7.26.7-685f05ad2c-c7a661a683.zip/node_modules/@babel/runtime/helpers/esm/nonIterableRest.js ***!
  \*************************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ _nonIterableRest)\n/* harmony export */ });\nfunction _nonIterableRest() {\n  throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\");\n}\n\n\n//# sourceURL=webpack://tester/../.yarn/cache/@babel-runtime-npm-7.26.7-685f05ad2c-c7a661a683.zip/node_modules/@babel/runtime/helpers/esm/nonIterableRest.js?");

/***/ }),

/***/ "../.yarn/cache/@babel-runtime-npm-7.26.7-685f05ad2c-c7a661a683.zip/node_modules/@babel/runtime/helpers/esm/slicedToArray.js":
/*!***********************************************************************************************************************************!*\
  !*** ../.yarn/cache/@babel-runtime-npm-7.26.7-685f05ad2c-c7a661a683.zip/node_modules/@babel/runtime/helpers/esm/slicedToArray.js ***!
  \***********************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ _slicedToArray)\n/* harmony export */ });\n/* harmony import */ var _arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithHoles.js */ \"../.yarn/cache/@babel-runtime-npm-7.26.7-685f05ad2c-c7a661a683.zip/node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js\");\n/* harmony import */ var _iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArrayLimit.js */ \"../.yarn/cache/@babel-runtime-npm-7.26.7-685f05ad2c-c7a661a683.zip/node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js\");\n/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ \"../.yarn/cache/@babel-runtime-npm-7.26.7-685f05ad2c-c7a661a683.zip/node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js\");\n/* harmony import */ var _nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableRest.js */ \"../.yarn/cache/@babel-runtime-npm-7.26.7-685f05ad2c-c7a661a683.zip/node_modules/@babel/runtime/helpers/esm/nonIterableRest.js\");\n\n\n\n\nfunction _slicedToArray(r, e) {\n  return (0,_arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(r) || (0,_iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(r, e) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(r, e) || (0,_nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"])();\n}\n\n\n//# sourceURL=webpack://tester/../.yarn/cache/@babel-runtime-npm-7.26.7-685f05ad2c-c7a661a683.zip/node_modules/@babel/runtime/helpers/esm/slicedToArray.js?");

/***/ }),

/***/ "../.yarn/cache/@babel-runtime-npm-7.26.7-685f05ad2c-c7a661a683.zip/node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js":
/*!************************************************************************************************************************************************!*\
  !*** ../.yarn/cache/@babel-runtime-npm-7.26.7-685f05ad2c-c7a661a683.zip/node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js ***!
  \************************************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ _unsupportedIterableToArray)\n/* harmony export */ });\n/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ \"../.yarn/cache/@babel-runtime-npm-7.26.7-685f05ad2c-c7a661a683.zip/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js\");\n\nfunction _unsupportedIterableToArray(r, a) {\n  if (r) {\n    if (\"string\" == typeof r) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(r, a);\n    var t = {}.toString.call(r).slice(8, -1);\n    return \"Object\" === t && r.constructor && (t = r.constructor.name), \"Map\" === t || \"Set\" === t ? Array.from(r) : \"Arguments\" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(r, a) : void 0;\n  }\n}\n\n\n//# sourceURL=webpack://tester/../.yarn/cache/@babel-runtime-npm-7.26.7-685f05ad2c-c7a661a683.zip/node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js?");

/***/ })

}]);