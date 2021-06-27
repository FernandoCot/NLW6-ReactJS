// Images
import logoImg from '../assets/images/logo.svg';

// Components
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';

// Other
import '../styles/room.scss';
import { useRoom } from '../hooks/useRoom';
import { useParams } from 'react-router-dom';

type RoomParams = {
  id: string;
}

export const AdminRoom = () => {
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title, questions } = useRoom(roomId);

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined>Encerrar sala</Button>
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
            />
          ))}
        </div>
      </main>
    </div>
  );
}
