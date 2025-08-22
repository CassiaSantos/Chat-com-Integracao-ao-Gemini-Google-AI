const { truncateText } = require('../src/utils/textUtils'); // função que quero testar.

//'describe' agrupa testes relacionados. O primeiro argumento é uma descrição do que está sendo testado.
describe('truncateText', () => {

  //'it' (ou 'test') define um caso de teste específico. Na descrição consta o que espero que aconteça.
  it('should return the original text if it is shorter than the max length', () => {
    // dados de teste:
    const shortText = 'Hello World';
    const maxLength = 20;

    // Executo a função com os dados de teste:
    const result = truncateText(shortText, maxLength);

    // Verifico se o resultado é o que esperava:
    expect(result).toBe(shortText);
  });

  it('should return the original text if it is equal to the max length', () => {
    const exactText = '12345';
    const maxLength = 5;
    const result = truncateText(exactText, maxLength);
    expect(result).toBe(exactText);
  });

  it('should truncate the text and add ellipsis if it is longer than the max length', () => {
    const longText = 'This is a long text for testing purposes';
    const maxLength = 20;
    
    // O resultado que esperamos após o corte e a adição de "..."
    const expectedResult = 'This is a long text...';
    
    const result = truncateText(longText, maxLength);
    expect(result).toBe(expectedResult);
  });

  it('should handle an empty string correctly', () => {
    const emptyText = '';
    const maxLength = 10;
    const result = truncateText(emptyText, maxLength);
    expect(result).toBe('');
  });
});