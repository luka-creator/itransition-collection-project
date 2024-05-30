import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItem, updateItem, deleteItem } from '../firebase/services/items';
import { getCollection } from '../firebase/services/collections';
import { addComment, getCommentsByItemId } from '../firebase/services/interactions/comments';
import { addLike, removeLike, hasUserLikedItem, getLikesByItemId } from '../firebase/services/interactions/likes';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const ItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [item, setItem] = useState(null);
  const [collection, setCollection] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const [editingItemName, setEditingItemName] = useState('');
  const [editingItemDescription, setEditingItemDescription] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const itemData = await getItem(id);
        setItem(itemData);
        setEditingItemName(itemData.name);
        setEditingItemDescription(itemData.description);

        const collectionData = await getCollection(itemData.collectionId);
        setCollection(collectionData);

        const commentsData = await getCommentsByItemId(id);
        setComments(commentsData);

        const likesData = await getLikesByItemId(id);
        setLikes(likesData);

        if (user) {
          const liked = await hasUserLikedItem(id, user.uid);
          setUserHasLiked(liked);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchItem();
  }, [id, user]);

  const handleEditItem = async () => {
    try {
      const updatedItem = {
        name: editingItemName,
        description: editingItemDescription,
      };
      await updateItem(id, updatedItem);
      setItem({ ...item, ...updatedItem });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteItem = async () => {
    try {
      await deleteItem(id);
      navigate('/user'); 
      alert(t('itemHasBeenDeleted'));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddComment = async () => {
    try {
      if (newComment.trim() === '') return;
      const commentData = {
        itemId: id,
        userId: user.uid,
        text: newComment,
      };
      const commentId = await addComment(commentData);
      setComments([...comments, { id: commentId, ...commentData, createdAt: new Date() }]);
      setNewComment('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleLike = async () => {
    try {
      if (userHasLiked) {
        await removeLike(id, user.uid);
        setLikes(likes.filter(like => like.userId !== user.uid));
      } else {
        await addLike({ itemId: id, userId: user.uid });
        setLikes([...likes, { itemId: id, userId: user.uid }]);
      }
      setUserHasLiked(!userHasLiked);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <div className="alert alert-danger">{t('error')}: {error}</div>;
  }

  if (!item || !collection) {
    return <div>{t('loading')}</div>;
  }

  return (
    <div className="container pb-5">
      <h1>{item.name}</h1>
      <p>{item.description}</p>
      {user && (user.isAdmin || user.uid === item.userId) && (
          <div className="row justify-content-center">
            <div className="col-12 col-md-6">
              <h3>{t('editItem')}</h3>
              <input
                type="text"
                className="form-control"
                placeholder={t('name')}
                value={editingItemName}
                onChange={(e) => setEditingItemName(e.target.value)}
              />
              <input
                type="text"
                className="form-control"
                placeholder={t('description')}
                value={editingItemDescription}
                onChange={(e) => setEditingItemDescription(e.target.value)}
              />
              <button className="btn btn-primary mt-2" onClick={handleEditItem}>{t('saveItem')}</button>
              <button className="btn btn-danger mt-2" onClick={handleDeleteItem}>{t('deleteItem')}</button>
            </div>
          </div>
       )}

      <section>
        <h3 className="text-center">{t('comments')}</h3>
        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            <ul className="list-group">
              {comments.map(comment => (
                <li key={comment.id} className="list-group-item mb-2">{comment.text}</li>
              ))}
            </ul>
            {user && (
              <div>
                <textarea
                  className="form-control"
                  placeholder={t('addComment')}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button className="btn btn-primary mt-2" onClick={handleAddComment}>{t('addComment')}</button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-center">{t('likes')}</h3>
        <p className="text-center">{likes.length} {likes.length === 1 ? t('like') : t('likes')}</p>
        {user && (
          <div className="text-center">
            <button className="btn btn-primary" onClick={handleToggleLike}>
              {userHasLiked ? t('unlike') : t('like')}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ItemPage;
