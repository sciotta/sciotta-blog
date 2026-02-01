---
slug: react-server-components
title: React Server Components na Prática
author: Thiago Sciotta
author_title: Front End Engineer
author_url: https://github.com/thiagog3
author_image_url: https://avatars.githubusercontent.com/u/1863045?v=4
tags: [react, frontend, arquitetura, performance]
image: https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200
enableComments: true
---

Depois de anos de evolução no ecossistema React, os **React Server Components (RSC)** chegaram para mudar a forma como pensamos a renderização de aplicações. Não se trata apenas de uma nova feature, mas de uma mudança de paradigma que impacta diretamente a arquitetura e performance das nossas aplicações.

<!--truncate-->

Neste artigo, vamos explorar na prática como os Server Components funcionam, quando utilizá-los e como eles se integram com o modelo mental que já conhecemos do React.

## O Problema que RSC Resolve

Antes de mergulhar na solução, é importante entender o problema. Em aplicações React tradicionais (Client-Side Rendering), todo o JavaScript é enviado para o navegador, processado e então renderizado. Isso inclui:

- Código de componentes que nunca mudam
- Bibliotecas de formatação e validação
- Lógica de fetching de dados

O resultado? Bundles pesados, tempo de carregamento maior e uma experiência de usuário comprometida, especialmente em conexões mais lentas.

## Server Components vs Client Components

A grande sacada dos RSC é dividir os componentes em duas categorias:

### Server Components (padrão)

Executam **apenas no servidor**. Não enviam JavaScript para o cliente, podem acessar diretamente bancos de dados, filesystem e APIs internas.

```tsx
// app/products/page.tsx
// Este é um Server Component por padrão
import { db } from '@/lib/database';

export default async function ProductsPage() {
  // Acesso direto ao banco - sem API intermediária
  const products = await db.products.findMany();

  return (
    <main>
      <h1>Nossos Produtos</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - R$ {product.price}
          </li>
        ))}
      </ul>
    </main>
  );
}
```

### Client Components

Executam no navegador. Necessários para interatividade, hooks como `useState` e `useEffect`, e event handlers.

```tsx
// components/AddToCartButton.tsx
'use client'; // Essa diretiva marca como Client Component

import { useState } from 'react';

interface AddToCartButtonProps {
  productId: string;
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
    setIsLoading(false);
  };

  return (
    <button onClick={handleClick} disabled={isLoading}>
      {isLoading ? 'Adicionando...' : 'Adicionar ao Carrinho'}
    </button>
  );
}
```

## Compondo Server e Client Components

A mágica acontece quando você combina os dois. Um Server Component pode renderizar Client Components, passando dados já processados:

```tsx
// app/products/[id]/page.tsx
import { db } from '@/lib/database';
import { AddToCartButton } from '@/components/AddToCartButton';
import { ProductGallery } from '@/components/ProductGallery';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await db.products.findUnique({
    where: { id: params.id },
    include: { images: true },
  });

  if (!product) {
    return <div>Produto não encontrado</div>;
  }

  return (
    <main>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      
      {/* Client Component para galeria interativa */}
      <ProductGallery images={product.images} />
      
      {/* Client Component para interação */}
      <AddToCartButton productId={product.id} />
    </main>
  );
}
```

> **Importante**: Server Components podem importar e renderizar Client Components, mas o contrário não é possível. Um Client Component não pode importar um Server Component diretamente.

## Padrão de Composição: Children

Quando você precisa de um Server Component dentro de um Client Component, use o padrão de `children`:

```tsx
// components/CartProvider.tsx
'use client';

import { createContext, useContext, useState } from 'react';

const CartContext = createContext({});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState([]);

  return (
    <CartContext.Provider value={{ items, setItems }}>
      {children}
    </CartContext.Provider>
  );
}
```

```tsx
// app/layout.tsx (Server Component)
import { CartProvider } from '@/components/CartProvider';
import { Header } from '@/components/Header'; // Server Component

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <CartProvider>
          <Header /> {/* Server Component renderizado como children */}
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
```

## Quando Usar Cada Um?

Uma dúvida comum é saber quando optar por Server ou Client Components. Aqui vai um guia prático:

**Use Server Components quando:**
- Buscar dados de APIs ou bancos de dados
- Acessar recursos do servidor (filesystem, env vars sensíveis)
- O componente não precisa de interatividade
- Quer reduzir o bundle JavaScript enviado ao cliente

**Use Client Components quando:**
- Precisa de interatividade (onClick, onChange)
- Usa hooks como `useState`, `useEffect`, `useContext`
- Precisa de APIs do browser (localStorage, geolocation)
- Usa bibliotecas que dependem de estado ou efeitos

## Performance na Prática

Para ilustrar o impacto, imagine um dashboard com vários widgets:

```tsx
// app/dashboard/page.tsx
import { SalesChart } from '@/components/SalesChart';      // Client (interativo)
import { RecentOrders } from '@/components/RecentOrders';  // Server (lista estática)
import { StatsCards } from '@/components/StatsCards';      // Server (números)
import { DateFilter } from '@/components/DateFilter';      // Client (filtro interativo)

export default async function DashboardPage() {
  return (
    <main>
      <DateFilter />
      <StatsCards />      {/* Zero JS enviado */}
      <RecentOrders />    {/* Zero JS enviado */}
      <SalesChart />      {/* Só o necessário para o gráfico */}
    </main>
  );
}
```

Neste exemplo, `StatsCards` e `RecentOrders` não enviam nenhum JavaScript para o cliente. Apenas `SalesChart` e `DateFilter` contribuem para o bundle, reduzindo significativamente o tamanho final.

## Streaming e Suspense

RSC trabalha muito bem com Suspense para streaming de conteúdo:

```tsx
import { Suspense } from 'react';
import { ProductList } from '@/components/ProductList';
import { ProductListSkeleton } from '@/components/ProductListSkeleton';

export default function ProductsPage() {
  return (
    <main>
      <h1>Produtos</h1>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList />
      </Suspense>
    </main>
  );
}
```

O HTML é enviado progressivamente conforme os dados ficam disponíveis, melhorando a percepção de velocidade pelo usuário.

## Conclusão

React Server Components representam uma evolução natural na forma como construímos aplicações React. A separação clara entre o que roda no servidor e no cliente nos permite otimizar a experiência do usuário sem sacrificar a produtividade do desenvolvedor.

O modelo mental pode parecer diferente no início, mas uma vez que você internaliza a divisão de responsabilidades, percebe que faz muito sentido: dados e lógica pesada no servidor, interatividade no cliente.

Se você ainda não experimentou RSC, recomendo começar com um projeto Next.js 14+ e ir migrando componentes gradualmente. A curva de aprendizado é suave e os ganhos de performance são significativos.
