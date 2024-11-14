import { useChat } from 'ai/react'
import { useEffect, useRef } from 'react'

export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: '/api/chat'
    })

    const chatContainer = useRef<HTMLDivElement>(null)

    function scroll() {
        const { offsetHeight, scrollHeight, scrollTop } = chatContainer.current as HTMLDivElement
        if (scrollHeight >= scrollTop + offsetHeight) {
            chatContainer.current?.scrollTo(0, scrollHeight + 200)
        }
    }

    useEffect(() => {
        scroll()
    },[messages])

    function renderResponse() {
        return (
            <div>
                {messages.map((m, index) => (
                    <div key={m.id} className={`chat-line ${m.role === 'user' ? 'user-chat' : 'ai-chat'}`}>
                        <div>
                            <p className='message'>{m.content}</p>
                            {index < messages.length - 1 && (
                                <div>da</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div ref={chatContainer}>
            {renderResponse()}
            <form onSubmit={handleSubmit}>
                <input type="text" name='input-field' placeholder='Diga alguma coisa' onChange={handleInputChange} value={input}/>
                <button type='submit'>Enviar</button>
            </form>
        </div>
    )
}