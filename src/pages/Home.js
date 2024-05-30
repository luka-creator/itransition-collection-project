import React, { useEffect, useState } from 'react';
import { getLatestItems } from '../firebase/services/items';
import { getTopCollections, getCollection } from '../firebase/services/collections';
import { getUser } from '../firebase/services/users'; 
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();
  const [latestItems, setLatestItems] = useState([]);
  const [topCollections, setTopCollections] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await getLatestItems();
        const collections = await getTopCollections();

        const itemsWithDetails = await Promise.all(items.map(async item => {
          const collection = await getCollection(item.collectionId);
          const user = await getUser(item.userId);
          return {
            ...item,
            collectionName: collection ? collection.name : 'Unknown Collection',
            userEmail: user ? user.email : 'Unknown User',
          };
        }));

        setLatestItems(itemsWithDetails);
        setTopCollections(collections);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container pb-5" >
      {error && <div className="alert alert-danger">{t('error')}: {error}</div>}
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <section>
            <h2 className="mb-3">{t('latestItems')}</h2>
            <ul className="list-group mb-5">
              {latestItems.map(item => (
                <li key={item.id} className="list-group-item mb-2">
                  <Link to={`/items/${item.id}`}>{item.name}</Link> ({t('collection')}: {item.collectionName}, {t('author')}: {item.userEmail})
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="mb-3">{t('topCollections')}</h2>
            <ul className="list-group">
              {topCollections.map(collection => (
                <li key={collection.id} className="list-group-item mb-2">
                  <Link to={`/collections/${collection.id}`}>{collection.name}</Link> ({t('items')}: {collection.itemCount})
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
