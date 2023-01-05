import pmap from 'p-map';
import MediaWiki from '../MediaWiki';
import Downloader from '../Downloader';
import { redirectsXId, articleDetailXId } from '../stores';
import { getArticlesByIds, getArticlesByNS } from './mw-api';

export async function getArticleIds(downloader: Downloader, mw: MediaWiki, mainPage?: string, articleIds?: string[], articleIdsToIgnore?: string[]) {
    if (mainPage) {
        await getArticlesByIds([mainPage], downloader);
    }

    if (articleIds) {
        await getArticlesByIds(articleIds, downloader);
    } else {
        await pmap(
            mw.namespacesToMirror,
            (namespace: string) => {
                return getArticlesByNS(mw.namespaces[namespace].num, downloader, articleIdsToIgnore);
            },
            {concurrency: downloader.speed}
        );
    }
}
