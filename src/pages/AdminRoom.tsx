// Images
import logoImg from '../assets/images/logo.svg';

// Components
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';

// Images
import deleteImg from '../assets/images/delete.svg';

// Other
import '../styles/room.scss';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';
import { useHistory, useParams } from 'react-router-dom';

type RoomParams = {
  id: string;
}

export const AdminRoom = () => {
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const history = useHistory();
  const { title, questions } = useRoom(roomId);

  const handleEndRoom = async () => {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/');
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm('Tem certeza que deseja deletar essa pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button
              isOutlined
              onClick={handleEndRoom}
            >
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && (
            <span>{questions.length} Pergunta(s)</span>
          )}
        </div>
        <div className="question-list">
          {questions.map((questionInfo) => (
            <Question
              key={questionInfo.id}
              author={questionInfo.author}
              content={questionInfo.content}
            >
              <button
                type="button"
                onClick={() => handleDeleteQuestion(questionInfo.id)}
              >
                <img
                  src={deleteImg}
                  alt="Remover pergunta"
                />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
}
