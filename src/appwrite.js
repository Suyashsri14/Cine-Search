/* eslint-disable no-undef */
import { Client, Databases, ID, Query } from 'appwrite'

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client().setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT).setProject(PROJECT_ID);

const databases = new Databases(client)

export const updateSearchCount = async (searchTerm, movie) => {

  // 1. USE APPWRITE SDK TO CHECK IF THE SEARCHTERM EXISTS IN THE DATABASE
  try {
    const results = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('searchTerm', searchTerm)
    ])

    // 2. IF IT DOES, UPDATE THE COUNT IN THE DATABASE
    if (results.documents.length > 0) {
      const doc = results.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1
      })
    }
    // 3. IF IT DOESN'T, CREATE A NEW DOC WITH THE SEARCH TERM AND COUNT AS 1
    else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      })
    }
  } catch (error) {
    console.error(error);
  }
}