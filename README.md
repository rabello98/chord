# chord-framework

O chord-framework é responsável por toda a parte estrutural de rotas do chord-app. Possui dois módulos principais: a parte estrutual ```$chord``` e a parte de rotas ```$route``` que são importados e utilizados pelo chord-app.

O desenvolvimento é feito nos seus módulos principais dentro de ```/src``` e depois o build é gerado com os dois módulo principais para que sejam importados pelo chord-app.

O chord-app se utiliza do webpack para importar injetar esses módulos na aplicação.
