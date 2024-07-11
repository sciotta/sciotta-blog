# Smoke Tests

## Definição
Smoke tests, também conhecidos como "sanity tests," são um conjunto básico de testes executados para verificar se as funcionalidades principais de uma aplicação estão funcionando corretamente após uma nova compilação ou uma alteração significativa no código. Eles não são testes exaustivos, mas visam detectar problemas críticos que possam impedir o funcionamento do sistema.

## Posicionamento na Pirâmide de Testes
Smoke tests são geralmente executados antes de testes mais detalhados e podem ser considerados uma camada inicial ou adicional na pirâmide de testes. Eles não têm um lugar fixo na pirâmide tradicional (unitários, integração, e2e), mas podem ser integrados em várias etapas:

1. **Antes dos Testes Unitários**: Smoke tests rápidos podem ser realizados para garantir que a aplicação está em um estado básico funcional antes de iniciar testes unitários detalhados.
2. **Entre Testes de Integração e Testes End-to-End**: Smoke tests podem ser executados após testes de integração e antes dos testes end-to-end para assegurar que os componentes principais do sistema ainda estão funcionando corretamente após a integração de diferentes módulos.
3. **Ciclo de CI/CD**: No contexto de Integração Contínua/Entrega Contínua (CI/CD), smoke tests são frequentemente executados logo após a construção da aplicação para verificar rapidamente a integridade da build antes de executar a suíte completa de testes.

## Objetivo dos Smoke Tests
- **Verificação Rápida**: Assegurar rapidamente que a aplicação não tem falhas críticas que impediriam testes mais detalhados.
- **Feedback Inicial**: Proporcionar feedback rápido aos desenvolvedores sobre a estabilidade da build recente.
- **Confiança**: Garantir que as funcionalidades principais estão funcionando corretamente antes de investir tempo em testes mais abrangentes.

## Exemplos de Smoke Tests
- Verificar se a aplicação inicializa corretamente.
- Confirmar que as principais páginas da web são carregadas sem erros.
- Testar se as principais funcionalidades, como login, podem ser executadas com sucesso.
- Validar que a conexão ao banco de dados é bem-sucedida.

## Resumo
Smoke tests são uma prática crucial para detectar problemas críticos rapidamente e garantir que o sistema está em um estado básico funcional antes de proceder com testes mais detalhados. Eles complementam a pirâmide de testes, posicionando-se como uma camada inicial de verificação rápida e essencial no ciclo de desenvolvimento e deployment.
