export function iteratorToStream(iterator) {
    const encoder = new TextEncoder();
    return new ReadableStream({
        async pull(controller) {
            const {value, done} = await iterator.next();
            if (done) return controller.close();
            controller.enqueue(encoder.encode(value));
        },
    });
}
