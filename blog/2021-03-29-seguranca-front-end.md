---
slug: seguranca-front-end
title: Segurança no front-end
author: Thiago Sciotta
author_title: Front End Engineer
author_url: https://github.com/thiagog3
author_image_url: https://avatars.githubusercontent.com/u/1863045?v=4
tags: [segurança, front-end]
image: https://www.immuniweb.com/images/blog/web-security-mistakes-cost-millions-dollars.jpg
enableComments: true
---

É importante restringir e se assegurar também através do front-end, informando para o browser o que pode e o que não pode ser feito. Utilizando da declaração de algumas meta-tags e headers de resposta HTTP, conseguimos por exemplo, bloquear a manipulação e injeções de scripts maliciosos que podem, inclusive, roubar dados e capturar informações dos seus usuários através do seu site ou aplicação web. 

<!--truncate-->

Lembrando que essas definições (independente se for meta-tags ou headers) são bloqueadas e/ou tratadas do lado do cliente, ou seja, pelo browser.

A finalidade desse post é ser prático apresentando de forma resumida e em poucas palavras, esses recursos e dissertando um pouco a função de cada uma:

### Strict-Transport-Security
É uma forma de bloqueio a requisições não seguras, forçando o navegador a utilizar conexões seguras. Qualquer requisição feita através da sua aplicação que seja HTTP, será automaticamente redirecionada para HTTPS.
### Content-Security-Policy
Meta tag para especificar a política de requisições de conteúdo na sua aplicação. Resumindo em poucas palavras, é útil para impedir que injetem conteúdos (imagens, scripts e estilos) de fora dos domínios descritos no atributo `content` desta tag.

### X-Frame-Options
É um cabeçalho de resposta HTTP (HTTP response Header), responsável por impedir que sua página seja incorporada em outros sites via `iframe`. Impedindo que tecnicas como `Clickjacking` seja aplicadas a usuários desavisados.

> **Clickjacking** é uma técnica maliciosa que induz um usuário a clicar em algo diferente do que o usuário enxerga, potencialmente revelando informações confidenciais ou assumindo o controle de seu computador enquanto o usuário clica em páginas web aparentemente inofensivas.

> Diferentemente das meta-tags, os **cabeçalhos de respostas** vem no header de resposta da sua página, ou seja,
a implementação não é declarada no conteúdo do HTML e sim controlado e definido pelo servidor HTTP ou proxy reverso que 
entrega seu conteúdo para quem requisitou. Para setá-lo é preciso saber como sua página é entregue e assim adicionar essa
propriedade ao cabeçalho de resposta.

### X-Content-Type-Options
Assim como o `X-Frame-Options`, também é um cabeçalho de respostas (incorporado a resposta do servidor) que serve para arquivos de script e estilo. Impede que esses tipos sejam incorporados no site sem o seu tipo MIME correto.

Este header foi incluído no IE 8 como uma maneira dos desenvolvedores serem capazes de bloquear o [sniffing](https://en.wikipedia.org/wiki/Content_sniffing) de conteúdo que acontecia na época, e podia transformar tipos MIME não executáveis em tipos executáveis.

### Referrer-Policy
Controla quanta informação será passada no header `Referer` quando sua página ou sistema fazer uma requisição. Ou seja, esse header pode impedir, por exemplo, que ao acessar um link externo dentro da sua página saiba qual a sua origem (a sua página).

> Apesar do cabeçalho *Referer* tenha diversos usos inocentes, ele pode ter consequências indesejáveis para segurança e privacidade dos usuários.

> Curiosidade: o cabeçalho Referer é um typo, ou seja é um erro ortográfico, foi mantido como na primeira definição, mas a ortografia correta seria "Referrer". O cabeçalho de política desse campo (Referrer-Policy) não compartilha desse erro.

### Permissions-Policy
Permissions Policy, antes chamada de Feature Policy é um header de resposta e uma política nova para controle de permissões de recursos que sua página pode precisar acessar, como geolocalização, full-screen, sensores e etc.

## Dica final
Por último e não menos importante, quero deixar também um site onde você consegue "escanear" as vulnerabilidades de uma URL,
baseados nesses recursos aqui apresentados: [https://securityheaders.com/](https://securityheaders.com/)

## Conclusão
O foco desse post foi demonstrar com poucas palavras a utilização das técnicas de segurança aplicadas "para o lado do cliente" sem adentrar na aplicação técnica de cada uma. Qualquer dúvida com a implementação, bora trocar uma idéia! :)
