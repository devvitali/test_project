import RNFetchBlob from 'rn-fetch-blob';

export const download = url => (
  new Promise((resolve, reject) => {
    RNFetchBlob
      .config({ fileCache: true })
      .fetch('GET', url)
      .then(res => RNFetchBlob.fs.readStream(res.path(), 'utf8'))
      .then((ifStream) => {
        let data = '';
        ifStream.open();
        ifStream.onData(chunk => data = chunk);
        ifStream.onEnd(() => resolve(data));
        ifStream.onError(reject);
      })
      .catch(reject);
  })
);
