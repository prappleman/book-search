export const getSavedBookIds = () => {
  console.log('Retrieving saved book IDs from localStorage');
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books'))
    : [];

  console.log('Saved book IDs:', savedBookIds);
  return savedBookIds;
};

export const saveBookIds = (bookIdArr) => {
  console.log('Saving book IDs to localStorage:', bookIdArr);
  if (bookIdArr.length) {
    localStorage.setItem('saved_books', JSON.stringify(bookIdArr));
    console.log('Book IDs saved');
  } else {
    localStorage.removeItem('saved_books');
    console.log('No book IDs to save, cleared localStorage');
  }
};

export const removeBookId = (bookId) => {
  console.log('Removing book ID from localStorage:', bookId);
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books'))
    : null;

  if (!savedBookIds) {
    console.log('No saved book IDs found');
    return false;
  }

  console.log('Current saved book IDs:', savedBookIds);
  const updatedSavedBookIds = savedBookIds.filter((savedBookId) => savedBookId !== bookId);
  localStorage.setItem('saved_books', JSON.stringify(updatedSavedBookIds));
  console.log('Updated saved book IDs:', updatedSavedBookIds);

  return true;
};