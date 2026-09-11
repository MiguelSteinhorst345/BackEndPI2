import app from "./app";
//importa todas as funções do app

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
// faz o servidor esperar as requisições quando abrimos no Thunder Client http://localhosta:3000
    console.log(`Servidor rodando na porta ${PORT}`);
});


// arquivo que inicia o servidor do projeto