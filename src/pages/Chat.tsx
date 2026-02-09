import PageTransition from "@/components/layout/PageTransition";
import ChatLayout from "@/components/chat/ChatLayout";

const Chat = () => {
  return (
    <PageTransition className="h-screen">
      <ChatLayout />
    </PageTransition>
  );
};

export default Chat;
