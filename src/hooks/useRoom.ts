// Core
import { useState, useEffect } from 'react';

//Other
import { useAuth } from './useAuth';
import { database } from '../services/firebase';

type QuestionProps = {
  id: string;
  author: {
    name: string;
    avatar: string;
  },
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number,
  likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  },
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likes: Record<string, {
    authorId: string;
  }>;
}>

export const useRoom = (roomId: string) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<QuestionProps[]>([]);

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', (room) => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          author: value.author,
          content: value.content,
          isAnswered: value.isAnswered,
          isHighlighted: value.isHighlighted,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
        }
      })

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    })

    return (() => roomRef.off('value'));
  }, [roomId, user?.id]);

  return { questions, title }
}
