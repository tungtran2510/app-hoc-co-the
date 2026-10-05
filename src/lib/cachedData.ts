import 'server-only';
import { revalidateTag, unstable_cache } from 'next/cache';
import {
  getBlocksByPage,
  getAllPageSlugMap,
  getLearningBlocksByPages,
  getPageBySlug,
  getPagesByTopic,
  getPagesByTopics,
  getSettings,
  getTopicBySlug,
  getTopicsWithCounts,
} from './data';

const cacheOptions = { revalidate: 300, tags: ['qbiz-public-data'] };

export function invalidatePublicContentCache() {
  revalidateTag('qbiz-public-data');
}

// These values are public learning content. Cache across serverless instances;
// all admin mutations invalidate the shared tag so edits remain prompt.
export const getCachedSettings = unstable_cache(getSettings, ['public-settings-v1'], cacheOptions);
export const getCachedTopicsWithCounts = unstable_cache(getTopicsWithCounts, ['public-topics-counts-v1'], cacheOptions);
export const getCachedTopicBySlug = unstable_cache(getTopicBySlug, ['public-topic-by-slug-v1'], cacheOptions);
export const getCachedPageBySlug = unstable_cache(getPageBySlug, ['public-page-by-slug-v1'], cacheOptions);
export const getCachedAllPageSlugMap = unstable_cache(getAllPageSlugMap, ['public-page-slug-map-v1'], cacheOptions);
export const getCachedPagesByTopic = unstable_cache(getPagesByTopic, ['public-pages-by-topic-v1'], cacheOptions);
export const getCachedPagesByTopics = unstable_cache(getPagesByTopics, ['public-pages-by-topics-v1'], cacheOptions);
export const getCachedBlocksByPage = unstable_cache(getBlocksByPage, ['public-blocks-by-page-v1'], cacheOptions);
export const getCachedLearningBlocksByPages = unstable_cache(getLearningBlocksByPages, ['public-learning-blocks-by-pages-v2'], cacheOptions);
