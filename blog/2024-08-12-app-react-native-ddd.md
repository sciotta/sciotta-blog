---
slug: react-native-ddd
title: Desenvolvendo um App com React Native e DDD
author: Thiago Sciotta
author_title: Front End Engineer
author_url: https://github.com/thiagog3
author_image_url: https://avatars.githubusercontent.com/u/1863045?v=4
tags: [react-native, ddd, arquitetura]
image: https://assets.toptal.io/images?url=https%3A%2F%2Fbs-uploads.toptal.io%2Fblackfish-uploads%2Fcomponents%2Fblog_post_page%2F4084346%2Fcover_image%2Fregular_1708x683%2Fcover-cold-dive-into-react-native-a-beginners-tutorial-74999e68e345987346d006d8e8aa373c.png
enableComments: true
---

O desenvolvimento de aplicativos móveis usando React Native oferece agilidade e flexibilidade. No entanto, para garantir que o código seja escalável e fácil de manter, é importante aplicar boas práticas de design de software, como o Domain-Driven Design (DDD).

<!--truncate-->

Neste artigo, vamos explorar como aplicar DDD em um projeto React Native usando TypeScript.

## Estruturando o Projeto com DDD

### 1. **Identificando o Domínio Principal**

Antes de iniciar o desenvolvimento, entenda o domínio do problema que seu aplicativo resolverá. Suponha que estamos criando um app de e-commerce. Neste caso, entidades como "Produto", "Cliente" e "Pedido" seriam essenciais.

### 2. **Camada de Domínio**

Nesta camada, você define as regras de negócio principais, dividindo-as em entidades, value objects, repositórios e serviços de domínio.

**Exemplo de Entidade:**

```typescript
// src/domain/entities/Product.ts
export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public price: number
  ) {}

  changePrice(newPrice: number) {
    if (newPrice <= 0) {
      throw new Error("Price must be greater than zero.");
    }
    this.price = newPrice;
  }
}
```

**Exemplo de Value Object:**

```typescript
// src/domain/value-objects/Address.ts
export class Address {
  constructor(
    public readonly street: string,
    public readonly city: string,
    public readonly postalCode: string
  ) {}
}
```

**Exemplo de Repositório:**

```typescript
// src/domain/repositories/ProductRepository.ts
export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  save(product: Product): Promise<void>;
}
```

**Exemplo de Serviço de Domínio:**

```typescript
// src/domain/services/ProductService.ts
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async updateProductPrice(id: string, newPrice: number): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new Error("Product not found");
    product.changePrice(newPrice);
    await this.productRepository.save(product);
  }
}
```

### 3. **Camada de Aplicação**

Os casos de uso do aplicativo são definidos nesta camada. Eles são os "application services" que orquestram as interações entre as entidades e serviços do domínio.

**Exemplo de Caso de Uso:**

```typescript
// src/application/use-cases/AddProductToCart.ts
import { Cart } from "../entities/Cart";
import { ProductRepository } from "../../domain/repositories/ProductRepository";

export class AddProductToCart {
  constructor(private productRepository: ProductRepository) {}

  async execute(cart: Cart, productId: string): Promise<void> {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new Error("Product not found");
    cart.addProduct(product);
  }
}
```

### 4. **Camada de Infraestrutura**

Esta camada lida com as implementações concretas de persistência, APIs e outras infraestruturas necessárias.

**Exemplo de Implementação de Repositório:**

```typescript
// src/infrastructure/repositories/InMemoryProductRepository.ts
import { ProductRepository } from "../../domain/repositories/ProductRepository";
import { Product } from "../../domain/entities/Product";

export class InMemoryProductRepository implements ProductRepository {
  private products: Product[] = [];

  async findById(id: string): Promise<Product | null> {
    return this.products.find(product => product.id === id) || null;
  }

  async save(product: Product): Promise<void> {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.products[index] = product;
    } else {
      this.products.push(product);
    }
  }
}
```

### 5. **Camada de Interface do Usuário**

Nesta camada, os componentes React Native são definidos. Eles interagem com os casos de uso e exibem os dados para o usuário.

**Exemplo de Componente:**

```typescript
// src/ui/components/ProductCard.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { Product } from '../../domain/entities/Product';

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <View>
      <Text>{product.name}</Text>
      <Text>{product.price}</Text>
      <Button title="Add to Cart" onPress={onAddToCart} />
    </View>
  );
};
```

### 6. **Testes**

Os testes garantem que a lógica de negócio funcione conforme o esperado. Abaixo, vemos um exemplo de teste para o serviço de domínio `ProductService`.

**Exemplo de Teste com Jest:**

```typescript
// src/domain/services/ProductService.test.ts
import { ProductService } from './ProductService';
import { InMemoryProductRepository } from '../../infrastructure/repositories/InMemoryProductRepository';
import { Product } from '../entities/Product';

describe('ProductService', () => {
  it('should update the product price', async () => {
    const productRepository = new InMemoryProductRepository();
    const productService = new ProductService(productRepository);
    const product = new Product('1', 'Test Product', 100);

    await productRepository.save(product);
    await productService.updateProductPrice('1', 200);

    const updatedProduct = await productRepository.findById('1');
    expect(updatedProduct?.price).toBe(200);
  });
});
```

## Próximos passos

Aplicar DDD em um projeto React Native e TypeScript pode parecer complexo inicialmente, mas proporciona um código mais organizado, alinhado com o domínio e mais fácil de manter. Com esta estrutura, seu aplicativo estará melhor preparado para crescer e se adaptar às necessidades do negócio ao longo do tempo.

Em um próximo artigo, disponibilizarei um repositório preparado com um projeto base seguindo esse artigo.
