const SLEEP_TIME = 200;
const RETRY_TIMES = 3;
const RETRY_STATUS = [408, 503, 504];

function getSleepTime(i = 0) {
  const wTime = Math.min(SLEEP_TIME * 2 ** i);
  return Math.random() * wTime;
}

async function fakeSleep(ms) {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

async function onError(error) {
  const { status } = error.response;
  let { retryCount = 0 } = error.response.config;

  if (RETRY_STATUS.includes(status) && retryCount < RETRY_TIMES) {
    retryCount += 1;
    sleep_ms = getSleepTime(retryCount);
    await fakeSleep(sleep_ms);

    error.config.retryCount = retryCount;
    return await axios(error.config);
  }
}

axios.interceptors.response.use(onError);
