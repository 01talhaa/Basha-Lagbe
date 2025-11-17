// Simple in-memory SSE broadcaster. Works in development or a single-node deployment.
// Not suitable for multi-instance production (use Redis/pubsub or a hosted realtime service).

type Writer = WritableStreamDefaultWriter<Uint8Array>

const convWriters = new Map<string, Set<Writer>>()

export function createStreamForConversation(conversationId: string) {
  const ts = new TransformStream()
  const writer = ts.writable.getWriter()

  let set = convWriters.get(conversationId)
  if (!set) {
    set = new Set()
    convWriters.set(conversationId, set)
  }
  set.add(writer)

  const close = async () => {
    try {
      set?.delete(writer)
      await writer.close()
    } catch (e) {
      // ignore
    }
  }

  return { readable: ts.readable, writer, close }
}

export async function broadcastToConversation(conversationId: string, payload: string) {
  const set = convWriters.get(conversationId)
  if (!set) return

  const data = `data: ${payload}\n\n`
  const encoded = new TextEncoder().encode(data)

  for (const writer of Array.from(set)) {
    try {
      await writer.write(encoded)
    } catch (e) {
      // if writing failed, remove writer
      try {
        set.delete(writer)
        await writer.close()
      } catch {}
    }
  }
}
