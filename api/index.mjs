import {html} from "lit"
import {readableFrom} from "@lit-labs/ssr/lib/readable.js";
import {render} from "@lit-labs/ssr/lib/render-with-global-dom-shim.js";

const template = req => html`<h1>Hello, from ${req.url} I'm now an Edge Function!</h1>`

export const config = {
    runtime: 'edge',
};

export default (req) => {
    return new Response(readableFrom(render(template(req)), true));
};
