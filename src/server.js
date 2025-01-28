import http from 'http'

const server = http.createServer(async (request, response) =>{
    const {method, url} = request

    await json(request, response)
})

server.listen(3333)