import React, { useEffect, useState } from 'react';
import { getCollections, addCollection, updateCollection, deleteCollection } from '../../firebase/services/collections';
import { deleteItemsByCollectionId } from '../../firebase/services/items';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';
import { useTranslation } from 'react-i18next'; 

const CATEGORIES = ['Books', 'Signs', 'Silverware', 'Other'];

const UserCollections = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [newCollectionCategory, setNewCollectionCategory] = useState(CATEGORIES[0]);
  const [newCollectionImage, setNewCollectionImage] = useState(null);
  const [editingCollectionId, setEditingCollectionId] = useState(null);
  const [editingCollectionName, setEditingCollectionName] = useState('');
  const [editingCollectionDescription, setEditingCollectionDescription] = useState('');
  const [editingCollectionCategory, setEditingCollectionCategory] = useState(CATEGORIES[0]);
  const [editingCollectionImage, setEditingCollectionImage] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const collectionsData = await getCollections();
        const userCollections = collectionsData.filter(collection => collection.userId === user.uid);
        setCollections(userCollections);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCollections();
  }, [user.uid]);

  const handleAddCollection = async () => {
    try {
      let imageUrl = '';
      if (newCollectionImage) {
        const storageRef = ref(storage, `images/${newCollectionImage.name}`);
        const snapshot = await uploadBytes(storageRef, newCollectionImage);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const newCollection = {
        name: newCollectionName,
        description: newCollectionDescription,
        category: newCollectionCategory,
        imageUrl,
        userId: user.uid,
      };
      const collectionId = await addCollection(newCollection);
      setCollections([...collections, { ...newCollection, id: collectionId }]);
      setNewCollectionName('');
      setNewCollectionDescription('');
      setNewCollectionCategory(CATEGORIES[0]);
      setNewCollectionImage(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditCollection = async () => {
    try {
      let imageUrl = editingCollectionImage;
      if (editingCollectionImage instanceof File) {
        const storageRef = ref(storage, `images/${editingCollectionImage.name}`);
        const snapshot = await uploadBytes(storageRef, editingCollectionImage);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const updatedCollection = {
        name: editingCollectionName,
        description: editingCollectionDescription,
        category: editingCollectionCategory,
        imageUrl,
      };
      await updateCollection(editingCollectionId, updatedCollection);
      setCollections(collections.map(collection => (
        collection.id === editingCollectionId ? { ...collection, ...updatedCollection } : collection
      )));
      setEditingCollectionId(null);
      setEditingCollectionName('');
      setEditingCollectionDescription('');
      setEditingCollectionCategory(CATEGORIES[0]);
      setEditingCollectionImage(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    try {
      await deleteItemsByCollectionId(collectionId);
      await deleteCollection(collectionId);
      setCollections(collections.filter(collection => collection.id !== collectionId));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-3">{t('yourCollections')}</h2>
      {error && <div className="alert alert-danger">{t('error')}: {error}</div>}
      <ul className="list-group">
        {collections.map(collection => (
          <li key={collection.id} className="list-group-item mb-3">
            <h3 className="mb-2">{collection.name}</h3>
            <div className="mb-2"><ReactMarkdown>{collection.description}</ReactMarkdown></div>
            <p className="mb-2">{t('category')}: {collection.category}</p>
            {collection.imageUrl && <img src={collection.imageUrl} alt={collection.name} className="img-thumbnail" style={{maxWidth: '200px'}} />}
            <div className="mt-2">
              <Link to={`/collections/${collection.id}`} className="btn btn-primary mr-2">{t('viewCollection')}</Link>
              <button onClick={() => {
                setEditingCollectionId(collection.id);
                setEditingCollectionName(collection.name);
                setEditingCollectionDescription(collection.description);
                setEditingCollectionCategory(collection.category);
                setEditingCollectionImage(collection.imageUrl);
              }} className="btn btn-secondary mr-2">{t('edit')}</button>
              <button onClick={() => handleDeleteCollection(collection.id)} className="btn btn-danger">{t('delete')}</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <h3 className="mb-3">{t('addNewCollection')}</h3>
        <input
          type="text"
          placeholder={t('name')}
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
        />
        <textarea
          placeholder={t('description')}
          value={newCollectionDescription}
          onChange={(e) => setNewCollectionDescription(e.target.value)}
        />
        <select
          value={newCollectionCategory}
          onChange={(e) => setNewCollectionCategory(e.target.value)}
        >
          {CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <input
          type="file"
          onChange={(e) => setNewCollectionImage(e.target.files[0])}
        />
        <button onClick={handleAddCollection} className="btn btn-primary mt-2">{t('add')}</button>
      </div>
      {editingCollectionId && (
        <div className="mt-5">
          <h3 className="mb-3">{t('editCollection')}</h3>
          <input
            type="text"
            placeholder={t('name')}
            value={editingCollectionName}
            onChange={(e) => setEditingCollectionName(e.target.value)}
          />
          <textarea
            placeholder={t('description')}
            value={editingCollectionDescription}
            onChange={(e) => setEditingCollectionDescription(e.target.value)}
          />
          <select
            value={editingCollectionCategory}
            onChange={(e) => setEditingCollectionCategory(e.target.value)}
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <input
            type="file"
            onChange={(e) => setEditingCollectionImage(e.target.files[0])}
          />
          <button onClick={handleEditCollection} className="btn btn-primary mt-2 mr-2">{t('save')}</button>
          <button onClick={() => setEditingCollectionId(null)} className="btn btn-secondary mt-2">{t('cancel')}</button>
        </div>
      )}
    </div>
  );
};

export default UserCollections;
