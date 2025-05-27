import List from './components/list/List';
import Chat from './components/chat/Chat';

const Messaging = () => {
  return (
    <div className="px-5 min-h-full my-auto py-5 bg-white rounded-lg shadow-2xl flex overflow-hidden">
      <List />
      <Chat />
    </div>
  );
};

export default Messaging;