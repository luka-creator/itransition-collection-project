import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCollection } from '../firebase/services/collections';
import { getItems, addItem, updateItem, deleteItem } from '../firebase/services/items';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const CollectionPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [collection, setCollection] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItemName, setEditingItemName] = useState('');
  const [editingItemDescription, setEditingItemDescription] = useState('');

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const collectionData = await getCollection(id);
        setCollection(collectionData);
        const itemsData = await getItems();
        const collectionItems = itemsData.filter(item => item.collectionId === id);
        setItems(collectionItems);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCollection();
  }, [id]);

  const handleAddItem = async () => {
    try {
      const newItem = {
        name: newItemName,
        description: newItemDescription,
        collectionId: id,
        userId: user.uid,
      };
      const itemId = await addItem(newItem);
      setItems([...items, { ...newItem, id: itemId }]);
      setNewItemName('');
      setNewItemDescription('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditItem = async () => {
    try {
      const updatedItem = {
        name: editingItemName,
        description: editingItemDescription,
      };
      await updateItem(editingItemId, updatedItem);
      setItems(items.map(item => (
        item.id === editingItemId ? { ...item, ...updatedItem } : item
      )));
      setEditingItemId(null);
      setEditingItemName('');
      setEditingItemDescription('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteItem(itemId);
      setItems(items.filter(item => item.id !== itemId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <div className="alert alert-danger">{t('error')}: {error}</div>;
  }

  if (!collection) {
    return <div>{t('loading')}</div>;
  }

  return (
    <div className="container">
      <h1>{collection.name}</h1>
      <p>{collection.description}</p>
      {collection.imageUrl && <img src={collection.imageUrl} alt={collection.name} className="img-fluid img-thumbnail" style={{ width: '300px', height: '450px', objectFit: 'cover' }} />}
      <h2>{t('items')}</h2>
      <ul className="list-group">
        {items.map(item => (
          <li key={item.id} className="list-group-item">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            {user && (user.isAdmin || user.uid === item.userId) && (
              <>
                <button className="btn btn-secondary" onClick={() => {
                  setEditingItemId(item.id);
                  setEditingItemName(item.name);
                  setEditingItemDescription(item.description);
                }}>{t('editItem')}</button>
                <button className="btn btn-danger" onClick={() => handleDeleteItem(item.id)}>{t('deleteItem')}</button>
              </>
            )}
          </li>
        ))}
      </ul>
      {user && (user.isAdmin || user.uid === collection.userId) && (
        <div className="mt-4">
          <h3>{t('addNewItem')}</h3>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder={t('name')}
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder={t('description')}
            value={newItemDescription}
            onChange={(e) => setNewItemDescription(e.target.value)}
          />
          <button className="btn btn-primary mt-2" onClick={handleAddItem}>{t('addItem')}</button>
        </div>
      )}
      {editingItemId && (
        <div className="mt-4">
          <h3>{t('editItem')}</h3>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder={t('name')}
            value={editingItemName}
            onChange={(e) => setEditingItemName(e.target.value)}
          />
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder={t('description')}
            value={editingItemDescription}
            onChange={(e) => setEditingItemDescription(e.target.value)}
          />
          <button className="btn btn-primary mt-2" onClick={handleEditItem}>{t('saveItem')}</button>
          <button className="btn btn-secondary mt-2" onClick={() => setEditingItemId(null)}>{t('cancel')}</button>
        </div>
      )}
    </div>
  );
};

export default CollectionPage;
