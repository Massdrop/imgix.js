'use strict';

var util = require('./util.js'),
    widths = require('./targetWidths.js');

/*
 * This functions have been copied over from ImgixTag and modified to accommodate
 * parameters and support for watermarks. ImgixTag could be refactored to utilize
 * these functions.
 */
function getBaseUrlWithoutQuery(baseUrl) {
  return baseUrl.split('?')[0];
};

function extractBaseParams(baseUrl) {
  var lastQuestion = baseUrl.lastIndexOf('?'),
      paramString = baseUrl.substr(lastQuestion + 1),
      splitParams = paramString.split('&'),
      params = {};

  for (var i = 0, splitParam; i < splitParams.length; i++) {
    splitParam = splitParams[i].split('=');

    params[splitParam[0]] = splitParam[1];
  }

  return params;
};

function buildSrcsetPair(baseUrlWithoutQuery, baseParams, targetWidth) {
  var clonedParams = util.shallowClone(baseParams);
  clonedParams.w = targetWidth;

  if (baseParams.w) {
    if (baseParams.h) {
      clonedParams.h = Math.round(targetWidth * (baseParams.h / baseParams.w));
    }

    // Adjust watermark settings
    if (baseParams.markpad) {
      clonedParams.markpad = Math.round(targetWidth * (baseParams.markpad / baseParams.w));
    }
    if (baseParams.markh) {
      clonedParams.markh = Math.round(targetWidth * (baseParams.markh / baseParams.w));
    }
    if (baseParams.markw) {
      clonedParams.markw = Math.round(targetWidth * (baseParams.markw / baseParams.w));
    }
    if (baseParams.marky) {
      clonedParams.marky = Math.round(targetWidth * (baseParams.marky / baseParams.w));
    }
    if (baseParams.markx) {
      clonedParams.markx = Math.round(targetWidth * (baseParams.markx / baseParams.w));
    }
  }

  var url = baseUrlWithoutQuery + '?',
      val,
      params = [];
  for (var key in clonedParams) {
    val = clonedParams[key];
    params.push(key + '=' + val);
  }

  url += params.join('&');

  return url + ' ' + targetWidth + 'w';
};

function srcset(baseUrl, useWindow) {
  var baseUrlWithoutQuery = getBaseUrlWithoutQuery(baseUrl),
    baseParams = extractBaseParams(baseUrl),
    targetWidths = widths(useWindow),
    pairs = [];

  for (var i = 0; i < targetWidths.length; i++) {
    pairs.push(buildSrcsetPair(baseUrlWithoutQuery, baseParams, targetWidths[i]));
  }

  return pairs.join(', ');
};

module.exports = {
  getBaseUrlWithoutQuery: getBaseUrlWithoutQuery,
  extractBaseParams: extractBaseParams,
  buildSrcsetPair: buildSrcsetPair,
  srcset: srcset
};
