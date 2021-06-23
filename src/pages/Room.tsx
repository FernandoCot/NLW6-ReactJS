// Core
import { useState, FormEvent, useEffect } from 'react';

// Images
import logoImg from '../assets/images/logo.svg';

// Components
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

// Other
import '../styles/room.scss';
import { useAuth } from '../hooks/useAuth';
import { useParams } from 'react-router-dom';
import { database } from '../services/firebase';

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  },
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}>

type RoomParams = {
  id: string;
}

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  },
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}

export const Room = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const params = useParams<RoomParams>();
  const roomId = params.id;

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
        }
      })

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    })
  }, [roomId]);

  const handleSendQuestion = async (event: FormEvent) => {
    event.preventDefault();

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('You must be logged in!');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);
    setNewQuestion('');
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && (
            <span>{questions.length} Pergunta(s)</span>
          )}
        </div>
        <form onSubmit={handleSendQuestion}>
          <textarea
            value={newQuestion}
            placeholder="O que você quer perguntar?"
            onChange={(event) => setNewQuestion(event.target.value)}
          />
          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt="user.name" />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button>faça seu login.</button></span>
            )}
            <Button
              type="submit"
              disabled={!user}
            >
              Enviar pergunta
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
