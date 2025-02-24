const config = (() => {
    return {
      "VUE_APP_MEILISEARCH_HOST": process.env.VUE_APP_MEILISEARCH_HOST,
      "VUE_APP_MEILISEARCH_API_KEY": process.env.VUE_APP_MEILISEARCH_API_KEY,
    };
  })();