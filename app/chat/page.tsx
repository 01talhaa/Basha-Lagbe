"use client"

import { useEffect, useMemo, useState } from "react"

type Message = {
	id: string
	senderId: string
	senderName: string
	text: string
	createdAt: string
}

type Conversation = {
	id: string
	title: string
	participants: { id: string; name: string }[]
	messages: Message[]
}

function formatTime(iso?: string) {
	if (!iso) return ""
	const d = new Date(iso)
	return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export default function Page() {
	// mock current user (replace with actual session in integration)
	const currentUser = useMemo(() => ({ id: "u1", name: "You" }), [])

	const [conversations, setConversations] = useState<Conversation[]>(() => [
		{
			id: "c1",
			title: "Apartment 12A - Owner: Alice",
			participants: [
				{ id: "u1", name: "You" },
				{ id: "u2", name: "Alice (owner)" },
			],
			messages: [
				{
					id: "m1",
					senderId: "u2",
					senderName: "Alice (owner)",
					text: "Hi! Are you available for a viewing tomorrow?",
					createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
				},
			],
		},
		{
			id: "c2",
			title: "Booking inquiry - Bob",
			participants: [
				{ id: "u1", name: "You" },
				{ id: "u3", name: "Bob (renter)" },
			],
			messages: [
				{
					id: "m2",
					senderId: "u3",
					senderName: "Bob (renter)",
					text: "Hello, I have a question about the deposit.",
					createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
				},
			],
		},
	])

	const [activeConversationId, setActiveConversationId] = useState<string | null>(
		conversations[0]?.id ?? null
	)
	const [input, setInput] = useState("")

	useEffect(() => {
		if (!activeConversationId && conversations.length) {
			setActiveConversationId(conversations[0].id)
		}
	}, [activeConversationId, conversations])

	const activeConversation = conversations.find((c) => c.id === activeConversationId) || null

	function handleSelectConversation(id: string) {
		setActiveConversationId(id)
	}

	useEffect(() => {
		let es: EventSource | null = null
		if (activeConversation) {
			es = new EventSource(`/api/chat/stream?conversationId=${activeConversation.id}`)
			es.onmessage = (ev) => {
				try {
					const data = JSON.parse(ev.data)
					const msg: Message = {
						id: String(data._id || data.id),
						senderId: data.sender?._id || data.sender,
						senderName: data.sender?.name || "",
						text: data.text,
						createdAt: data.createdAt || new Date().toISOString(),
					}
					setConversations((prev) =>
						prev.map((conv) => (conv.id === activeConversation.id ? { ...conv, messages: [...conv.messages, msg] } : conv))
					)
				} catch (e) {
					console.warn("Failed to parse SSE message", e)
				}
			}
			es.onerror = () => {
				// close on error
				try {
					es?.close()
				} catch {}
			}
		}

		return () => {
			try {
				es?.close()
			} catch {}
		}
	}, [activeConversation?.id])

	async function handleSend() {
		if (!input.trim() || !activeConversation) return

		const payload = { conversationId: activeConversation.id, text: input.trim() }

		// Optimistic local id for immediate UI
		const tempMsg: Message = {
			id: "t" + Math.random().toString(36).slice(2, 9),
			senderId: currentUser.id,
			senderName: currentUser.name,
			text: input.trim(),
			createdAt: new Date().toISOString(),
		}

		setConversations((prev) =>
			prev.map((conv) => (conv.id === activeConversation.id ? { ...conv, messages: [...conv.messages, tempMsg] } : conv))
		)
		setInput("")

		try {
			const res = await fetch("/api/chat/send", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			})
			if (res.ok) {
				const serverMsg = await res.json()
				// replace the temp message with server message (by matching text & createdAt roughly)
				setConversations((prev) =>
					prev.map((conv) => {
						if (conv.id !== activeConversation.id) return conv
						const msgs = conv.messages.map((m) => (m.id === tempMsg.id ? { ...m, id: String(serverMsg._id), createdAt: serverMsg.createdAt } : m))
						return { ...conv, messages: msgs }
					})
				)
			}
		} catch (e) {
			console.warn("Send failed", e)
		}
	}

	return (
		<div className="flex h-screen bg-gray-50">
			<aside className="w-80 border-r bg-white flex-shrink-0">
				<div className="p-4 border-b">
					<h2 className="text-lg font-semibold">Conversations</h2>
				</div>
				<div className="overflow-auto h-full">
					{conversations.map((c) => (
						<button
							key={c.id}
							onClick={() => handleSelectConversation(c.id)}
							className={`w-full text-left p-3 border-b hover:bg-gray-50 flex justify-between items-start ${
								c.id === activeConversationId ? "bg-gray-100" : ""
							}`}
						>
							<div>
								<div className="font-medium">{c.title}</div>
								<div className="text-sm text-gray-600 mt-1 truncate" style={{ maxWidth: 300 }}>
									{c.messages[c.messages.length - 1]?.text}
								</div>
							</div>
							<div className="text-xs text-gray-400">{formatTime(c.messages[c.messages.length - 1]?.createdAt)}</div>
						</button>
					))}
				</div>
			</aside>

			<main className="flex-1 flex flex-col">
				<div className="flex-1 overflow-auto p-4">
					{!activeConversation ? (
						<div className="h-full flex items-center justify-center text-gray-500">No conversation selected</div>
					) : (
						<div className="max-w-3xl mx-auto">
							<div className="mb-4">
								<h3 className="text-xl font-semibold">{activeConversation.title}</h3>
								<div className="text-sm text-gray-500">Participants: {activeConversation.participants.map(p => p.name).join(", ")}</div>
							</div>

							<div className="space-y-4">
								{activeConversation.messages.map((m) => {
									const mine = m.senderId === currentUser.id
									return (
										<div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
											<div className={`rounded-lg p-3 max-w-[70%] ${mine ? "bg-blue-600 text-white" : "bg-white border"}`}>
												<div className="text-sm">{m.text}</div>
												<div className="text-xs text-gray-300 mt-1 text-right">{formatTime(m.createdAt)}</div>
											</div>
										</div>
									)
								})}
							</div>
						</div>
					)}
				</div>

				<div className="p-4 border-t bg-white">
					<div className="max-w-3xl mx-auto flex gap-2">
						<input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder={activeConversation ? "Write a message..." : "Select a conversation to start"}
							className="flex-1 rounded-md border px-3 py-2"
							disabled={!activeConversation}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault()
									handleSend()
								}
							}}
						/>
						<button
							onClick={handleSend}
							disabled={!activeConversation || !input.trim()}
							className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
						>
							Send
						</button>
					</div>
				</div>
			</main>
		</div>
	)
}

