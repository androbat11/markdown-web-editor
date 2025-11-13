import index from "./shell/index.html";

const port: number = 3000;
(function initServer(port: number){
    return Bun.serve({
        port: port,
        routes: {
            // Opens a server with the entry point HTML
            "/": index,
        },
        development: {
            hmr: true,
            console: true,
        }
    })
})(port)


console.log("Server running at http://localhost:3000");
