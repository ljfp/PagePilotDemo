export interface Favorite {
  id: string;
  userId: string;
  bookId: string;
  createdAt: Date;
}

export interface CreateFavorite {
  userId: string;
  bookId: string;
}

export interface FavoriteWithBook {
  id: string;
  userId: string;
  bookId: string;
  createdAt: Date;
  book: {
    id: string;
    title: string;
    summary: string;
    publicationYear: number;
    authorId: string;
    author: {
      id: string;
      name: string;
    };
  };
} 