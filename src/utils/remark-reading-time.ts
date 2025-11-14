import getReadingTime, { type ReadTimeResults } from 'reading-time';
import { toString } from 'mdast-util-to-string';
import { strings, type Languages } from './lang';
import { read } from 'fs';

export function remarkReadingTime() {
  return function (tree: any, { data }: any) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    data.astro.frontmatter.readingTime = readingTime.minutes;
  };
}

export function getReadingTimeText(lang: Languages, minutes: number) {
  console.log(lang)
  return `${strings[lang]['time.reading_time']}: ${Math.ceil(minutes)} ${strings[lang]['time.minutes']}`;
};