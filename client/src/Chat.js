import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks'
import React from 'react';
import { messagesQuery, addMessageMutation, messageAddedSubscriptions } from './graphql/queries';
import MessageInput from './MessageInput';
import MessageList from './MessageList';

const Chat = ({ user }) => {
  const {data} = useQuery(messagesQuery)
  const [addMessage] = useMutation(addMessageMutation)
  const messages = data ? data.messages : []

  useSubscription(messageAddedSubscriptions, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      client.writeData({
        data: {
          messages: [...messages, subscriptionData.data.messageAdded]
        }
      })
    }
  })

  const handleSend = async text => {
    await addMessage({variables: {input: {text}}})
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Chatting as {user}</h1>
        <MessageList user={user} messages={messages} />
        <MessageInput onSend={handleSend} />
      </div>
    </section>
  )
}

export default Chat;
