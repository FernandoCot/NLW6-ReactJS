// Core
import { Fragment } from 'react';

// Images
import logoImg from '../assets/images/logo.svg';

// Components
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';

// Images
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

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

  const handleCheckQuestionAsAnswered = async (questionId: string) => {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  const handleHighlightQuestion = async (questionId: string) => {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
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
              isAnswered={questionInfo.isAnswered}
              isHighlighted={questionInfo.isHighlighted}
            >
              {!questionInfo.isAnswered && (
                <Fragment>
                  <button
                    type="button"
                    onClick={() => handleCheckQuestionAsAnswered(questionInfo.id)}
                  >
                    <img
                      src={checkImg}
                      alt="Marcar pergunta como respondida"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHighlightQuestion(questionInfo.id)}
                  >
                    <img
                      src={answerImg}
                      alt="Dar destaque pergunta pergunta"
                    />
                  </button>
                </Fragment>
              )}
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
