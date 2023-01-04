const responseTypes = ['string', 'number'];

async function handle(target, {controller, encoder} = {}) {
    if (typeof target === 'function') target = await target(controller);
    if (responseTypes.includes(typeof target)) controller.enqueue(encoder.encode(target));
}

export function iteratorToStream(iterator, {before, after} = {}) {
    const encoder = new TextEncoder();
    return new ReadableStream({
        start: controller => handle(before, {controller, encoder}),
        async pull(controller) {
            const {value, done} = await iterator.next();
            if (done) {
                await handle(after, {controller, encoder});
                return controller.close();
            }
            controller.enqueue(encoder.encode(value));
        },
    });
}

export async function* withAsync(iterable) {
    for (const value of iterable) {
        if (typeof value?.then === 'function') {
            yield* withAsync(await value);
        } else {
            yield value;
        }
    }
}
