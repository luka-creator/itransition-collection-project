import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItems } from '../firebase/services/items';
import { getCommentsByText } from '../firebase/services/interactions/comments'; 
import { getCollections } from '../firebase/services/collections';
import { useTranslation } from 'react-i18next';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSearch = async () => {
    try {
      const [items, comments, collections] = await Promise.all([
        getItems(),
        getCommentsByText(query), 
        getCollections()
      ]);

      const filteredItems = items.filter(item => item.name?.toLowerCase().includes(query.toLowerCase()));

      const commentResults = comments.map(comment => {
        const item = items.find(item => item.id === comment.itemId);
        return item ? { type: 'comment', item } : null;
      }).filter(result => result !== null);

      const collectionResults = collections.filter(collection => collection.name?.toLowerCase().includes(query.toLowerCase()));

      const results = [
        ...filteredItems.map(item => ({ type: 'item', item })),
        ...commentResults,
        ...collectionResults.map(collection => ({ type: 'collection', collection }))
      ];

      setResults(results);
    } catch (err) {
      console.error('Error searching items:', err);
    }
  };

  const handleItemClick = (itemId) => {
    navigate(`/items/${itemId}`);
  };

  const handleCollectionClick = (collectionId) => {
    navigate(`/collections/${collectionId}`);
  };

  return (
    <div className="container pb-5">
      <h2>{t('searchItems')}</h2>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder={t('search')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-primary mt-2" onClick={handleSearch}>{t('search')}</button>
        </div>
      </div>
      <ul className="list-group mt-3">
        {results.map((result, index) => (
          <li key={index} className="list-group-item mb-2" style={{cursor: "pointer"}} onClick={() => {
            if (result.type === 'item' || result.type === 'comment') {
              handleItemClick(result.item.id);
            } else if (result.type === 'collection') {
              handleCollectionClick(result.collection.id);
            }
          }}>
            {result.type === 'item' && `${result.item.name} (Item)`}
            {result.type === 'comment' && `${result.item.name} (Comment)`}
            {result.type === 'collection' && `${result.collection.name} (Collection)`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;
