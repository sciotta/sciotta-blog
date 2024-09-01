"use strict";(self.webpackChunksciotta_blog=self.webpackChunksciotta_blog||[]).push([[5834],{2696:(e,o,t)=>{t.r(o),t.d(o,{assets:()=>d,contentTitle:()=>a,default:()=>u,frontMatter:()=>i,metadata:()=>s,toc:()=>c});var r=t(4848),n=t(8453);const i={slug:"react-native-ddd",title:"Desenvolvendo um App com React Native e DDD",author:"Thiago Sciotta",author_title:"Front End Engineer",author_url:"https://github.com/thiagog3",author_image_url:"https://avatars.githubusercontent.com/u/1863045?v=4",tags:["react-native","ddd","arquitetura"],image:"https://assets.toptal.io/images?url=https%3A%2F%2Fbs-uploads.toptal.io%2Fblackfish-uploads%2Fcomponents%2Fblog_post_page%2F4084346%2Fcover_image%2Fregular_1708x683%2Fcover-cold-dive-into-react-native-a-beginners-tutorial-74999e68e345987346d006d8e8aa373c.png",enableComments:!0},a=void 0,s={permalink:"/blog/react-native-ddd",editUrl:"https://github.com/thiagog3/sciotta-blog/edit/master/blog/blog/2024-08-12-app-react-native-ddd.md",source:"@site/blog/2024-08-12-app-react-native-ddd.md",title:"Desenvolvendo um App com React Native e DDD",description:"O desenvolvimento de aplicativos m\xf3veis usando React Native oferece agilidade e flexibilidade. No entanto, para garantir que o c\xf3digo seja escal\xe1vel e f\xe1cil de manter, \xe9 importante aplicar boas pr\xe1ticas de design de software, como o Domain-Driven Design (DDD).",date:"2024-08-12T00:00:00.000Z",tags:[{inline:!0,label:"react-native",permalink:"/blog/tags/react-native"},{inline:!0,label:"ddd",permalink:"/blog/tags/ddd"},{inline:!0,label:"arquitetura",permalink:"/blog/tags/arquitetura"}],readingTime:3.44,hasTruncateMarker:!0,authors:[{name:"Thiago Sciotta",title:"Front End Engineer",url:"https://github.com/thiagog3",imageURL:"https://avatars.githubusercontent.com/u/1863045?v=4"}],frontMatter:{slug:"react-native-ddd",title:"Desenvolvendo um App com React Native e DDD",author:"Thiago Sciotta",author_title:"Front End Engineer",author_url:"https://github.com/thiagog3",author_image_url:"https://avatars.githubusercontent.com/u/1863045?v=4",tags:["react-native","ddd","arquitetura"],image:"https://assets.toptal.io/images?url=https%3A%2F%2Fbs-uploads.toptal.io%2Fblackfish-uploads%2Fcomponents%2Fblog_post_page%2F4084346%2Fcover_image%2Fregular_1708x683%2Fcover-cold-dive-into-react-native-a-beginners-tutorial-74999e68e345987346d006d8e8aa373c.png",enableComments:!0},unlisted:!1,nextItem:{title:"Vantagens de Usar CSS-in-JS em Aplica\xe7\xf5es React",permalink:"/blog/vantagens-css-in-js"}},d={authorsImageUrls:[void 0]},c=[{value:"Estruturando o Projeto com DDD",id:"estruturando-o-projeto-com-ddd",level:2},{value:"1. <strong>Identificando o Dom\xednio Principal</strong>",id:"1-identificando-o-dom\xednio-principal",level:3},{value:"2. <strong>Camada de Dom\xednio</strong>",id:"2-camada-de-dom\xednio",level:3},{value:"3. <strong>Camada de Aplica\xe7\xe3o</strong>",id:"3-camada-de-aplica\xe7\xe3o",level:3},{value:"4. <strong>Camada de Infraestrutura</strong>",id:"4-camada-de-infraestrutura",level:3},{value:"5. <strong>Camada de Interface do Usu\xe1rio</strong>",id:"5-camada-de-interface-do-usu\xe1rio",level:3},{value:"6. <strong>Testes</strong>",id:"6-testes",level:3},{value:"Pr\xf3ximos passos",id:"pr\xf3ximos-passos",level:2}];function p(e){const o={code:"code",h2:"h2",h3:"h3",p:"p",pre:"pre",strong:"strong",...(0,n.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(o.p,{children:"O desenvolvimento de aplicativos m\xf3veis usando React Native oferece agilidade e flexibilidade. No entanto, para garantir que o c\xf3digo seja escal\xe1vel e f\xe1cil de manter, \xe9 importante aplicar boas pr\xe1ticas de design de software, como o Domain-Driven Design (DDD)."}),"\n",(0,r.jsx)(o.p,{children:"Neste artigo, vamos explorar como aplicar DDD em um projeto React Native usando TypeScript."}),"\n",(0,r.jsx)(o.h2,{id:"estruturando-o-projeto-com-ddd",children:"Estruturando o Projeto com DDD"}),"\n",(0,r.jsxs)(o.h3,{id:"1-identificando-o-dom\xednio-principal",children:["1. ",(0,r.jsx)(o.strong,{children:"Identificando o Dom\xednio Principal"})]}),"\n",(0,r.jsx)(o.p,{children:'Antes de iniciar o desenvolvimento, entenda o dom\xednio do problema que seu aplicativo resolver\xe1. Suponha que estamos criando um app de e-commerce. Neste caso, entidades como "Produto", "Cliente" e "Pedido" seriam essenciais.'}),"\n",(0,r.jsxs)(o.h3,{id:"2-camada-de-dom\xednio",children:["2. ",(0,r.jsx)(o.strong,{children:"Camada de Dom\xednio"})]}),"\n",(0,r.jsx)(o.p,{children:"Nesta camada, voc\xea define as regras de neg\xf3cio principais, dividindo-as em entidades, value objects, reposit\xf3rios e servi\xe7os de dom\xednio."}),"\n",(0,r.jsx)(o.p,{children:(0,r.jsx)(o.strong,{children:"Exemplo de Entidade:"})}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-typescript",children:'// src/domain/entities/Product.ts\nexport class Product {\n  constructor(\n    public readonly id: string,\n    public name: string,\n    public price: number\n  ) {}\n\n  changePrice(newPrice: number) {\n    if (newPrice <= 0) {\n      throw new Error("Price must be greater than zero.");\n    }\n    this.price = newPrice;\n  }\n}\n'})}),"\n",(0,r.jsx)(o.p,{children:(0,r.jsx)(o.strong,{children:"Exemplo de Value Object:"})}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-typescript",children:"// src/domain/value-objects/Address.ts\nexport class Address {\n  constructor(\n    public readonly street: string,\n    public readonly city: string,\n    public readonly postalCode: string\n  ) {}\n}\n"})}),"\n",(0,r.jsx)(o.p,{children:(0,r.jsx)(o.strong,{children:"Exemplo de Reposit\xf3rio:"})}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-typescript",children:"// src/domain/repositories/ProductRepository.ts\nexport interface ProductRepository {\n  findById(id: string): Promise<Product | null>;\n  save(product: Product): Promise<void>;\n}\n"})}),"\n",(0,r.jsx)(o.p,{children:(0,r.jsx)(o.strong,{children:"Exemplo de Servi\xe7o de Dom\xednio:"})}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-typescript",children:'// src/domain/services/ProductService.ts\nexport class ProductService {\n  constructor(private productRepository: ProductRepository) {}\n\n  async updateProductPrice(id: string, newPrice: number): Promise<void> {\n    const product = await this.productRepository.findById(id);\n    if (!product) throw new Error("Product not found");\n    product.changePrice(newPrice);\n    await this.productRepository.save(product);\n  }\n}\n'})}),"\n",(0,r.jsxs)(o.h3,{id:"3-camada-de-aplica\xe7\xe3o",children:["3. ",(0,r.jsx)(o.strong,{children:"Camada de Aplica\xe7\xe3o"})]}),"\n",(0,r.jsx)(o.p,{children:'Os casos de uso do aplicativo s\xe3o definidos nesta camada. Eles s\xe3o os "application services" que orquestram as intera\xe7\xf5es entre as entidades e servi\xe7os do dom\xednio.'}),"\n",(0,r.jsx)(o.p,{children:(0,r.jsx)(o.strong,{children:"Exemplo de Caso de Uso:"})}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-typescript",children:'// src/application/use-cases/AddProductToCart.ts\nimport { Cart } from "../entities/Cart";\nimport { ProductRepository } from "../../domain/repositories/ProductRepository";\n\nexport class AddProductToCart {\n  constructor(private productRepository: ProductRepository) {}\n\n  async execute(cart: Cart, productId: string): Promise<void> {\n    const product = await this.productRepository.findById(productId);\n    if (!product) throw new Error("Product not found");\n    cart.addProduct(product);\n  }\n}\n'})}),"\n",(0,r.jsxs)(o.h3,{id:"4-camada-de-infraestrutura",children:["4. ",(0,r.jsx)(o.strong,{children:"Camada de Infraestrutura"})]}),"\n",(0,r.jsx)(o.p,{children:"Esta camada lida com as implementa\xe7\xf5es concretas de persist\xeancia, APIs e outras infraestruturas necess\xe1rias."}),"\n",(0,r.jsx)(o.p,{children:(0,r.jsx)(o.strong,{children:"Exemplo de Implementa\xe7\xe3o de Reposit\xf3rio:"})}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-typescript",children:'// src/infrastructure/repositories/InMemoryProductRepository.ts\nimport { ProductRepository } from "../../domain/repositories/ProductRepository";\nimport { Product } from "../../domain/entities/Product";\n\nexport class InMemoryProductRepository implements ProductRepository {\n  private products: Product[] = [];\n\n  async findById(id: string): Promise<Product | null> {\n    return this.products.find(product => product.id === id) || null;\n  }\n\n  async save(product: Product): Promise<void> {\n    const index = this.products.findIndex(p => p.id === product.id);\n    if (index !== -1) {\n      this.products[index] = product;\n    } else {\n      this.products.push(product);\n    }\n  }\n}\n'})}),"\n",(0,r.jsxs)(o.h3,{id:"5-camada-de-interface-do-usu\xe1rio",children:["5. ",(0,r.jsx)(o.strong,{children:"Camada de Interface do Usu\xe1rio"})]}),"\n",(0,r.jsx)(o.p,{children:"Nesta camada, os componentes React Native s\xe3o definidos. Eles interagem com os casos de uso e exibem os dados para o usu\xe1rio."}),"\n",(0,r.jsx)(o.p,{children:(0,r.jsx)(o.strong,{children:"Exemplo de Componente:"})}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-typescript",children:"// src/ui/components/ProductCard.tsx\nimport React from 'react';\nimport { View, Text, Button } from 'react-native';\nimport { Product } from '../../domain/entities/Product';\n\ninterface ProductCardProps {\n  product: Product;\n  onAddToCart: () => void;\n}\n\nexport const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {\n  return (\n    <View>\n      <Text>{product.name}</Text>\n      <Text>{product.price}</Text>\n      <Button title=\"Add to Cart\" onPress={onAddToCart} />\n    </View>\n  );\n};\n"})}),"\n",(0,r.jsxs)(o.h3,{id:"6-testes",children:["6. ",(0,r.jsx)(o.strong,{children:"Testes"})]}),"\n",(0,r.jsxs)(o.p,{children:["Os testes garantem que a l\xf3gica de neg\xf3cio funcione conforme o esperado. Abaixo, vemos um exemplo de teste para o servi\xe7o de dom\xednio ",(0,r.jsx)(o.code,{children:"ProductService"}),"."]}),"\n",(0,r.jsx)(o.p,{children:(0,r.jsx)(o.strong,{children:"Exemplo de Teste com Jest:"})}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-typescript",children:"// src/domain/services/ProductService.test.ts\nimport { ProductService } from './ProductService';\nimport { InMemoryProductRepository } from '../../infrastructure/repositories/InMemoryProductRepository';\nimport { Product } from '../entities/Product';\n\ndescribe('ProductService', () => {\n  it('should update the product price', async () => {\n    const productRepository = new InMemoryProductRepository();\n    const productService = new ProductService(productRepository);\n    const product = new Product('1', 'Test Product', 100);\n\n    await productRepository.save(product);\n    await productService.updateProductPrice('1', 200);\n\n    const updatedProduct = await productRepository.findById('1');\n    expect(updatedProduct?.price).toBe(200);\n  });\n});\n"})}),"\n",(0,r.jsx)(o.h2,{id:"pr\xf3ximos-passos",children:"Pr\xf3ximos passos"}),"\n",(0,r.jsx)(o.p,{children:"Aplicar DDD em um projeto React Native e TypeScript pode parecer complexo inicialmente, mas proporciona um c\xf3digo mais organizado, alinhado com o dom\xednio e mais f\xe1cil de manter. Com esta estrutura, seu aplicativo estar\xe1 melhor preparado para crescer e se adaptar \xe0s necessidades do neg\xf3cio ao longo do tempo."}),"\n",(0,r.jsx)(o.p,{children:"Em um pr\xf3ximo artigo, disponibilizarei um reposit\xf3rio preparado com um projeto base seguindo esse artigo."})]})}function u(e={}){const{wrapper:o}={...(0,n.R)(),...e.components};return o?(0,r.jsx)(o,{...e,children:(0,r.jsx)(p,{...e})}):p(e)}},8453:(e,o,t)=>{t.d(o,{R:()=>a,x:()=>s});var r=t(6540);const n={},i=r.createContext(n);function a(e){const o=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(o):{...o,...e}}),[o,e])}function s(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:a(e.components),r.createElement(i.Provider,{value:o},e.children)}}}]);