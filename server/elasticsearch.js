if (process.env.NODE_ENV !== 'test') {

  const elasticsearch = require('elasticsearch');

  const elasticClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'info',
  });

  const indexName = 'randomindex';

  /**
  * Delete an existing index
  */
  const deleteIndex = () =>
    elasticClient.indices.delete({
      index: indexName,
    });

  /**
  * create the index
  */
  const initIndex = () =>
    elasticClient.indices.create({
      index: indexName,
    });

  /**
  * check if the index exists
  */
  const indexExists = () =>
    elasticClient.indices.exists({
      index: indexName,
    });

  const initMapping = () =>
    elasticClient.indices.putMapping({
      index: indexName,
      type: 'document',
      body: {
        properties: {
          title: { type: 'string' },
          content: { type: 'string' },
          suggest: {
            type: 'completion',
            analyzer: 'simple',
            search_analyzer: 'simple',
            payloads: true,
          },
        },
      },
    });

  const addDocument = document =>
    elasticClient.index({
      index: indexName,
      type: 'document',
      body: {
        title: document.title,
        content: document.content,
        suggest: {
          input: document.title.split(' '),
          output: document.title,
          payload: document.metadata || {},
        },
      },
    });

  const getSuggestions = input =>
    elasticClient.suggest({
      index: indexName,
      type: 'document',
      body: {
        docsuggest: {
          text: input,
          completion: {
            field: 'suggest',
            fuzzy: true,
          },
        },
      },
    });


  module.exports = {
    deleteIndex,
    initIndex,
    indexExists,
    initMapping,
    addDocument,
    getSuggestions,
  };
}