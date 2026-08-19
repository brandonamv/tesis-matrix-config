export const validCharacters = "0123456789+-*/()^. ";

export const isValidFormula = (formula: string, variables: string, values: Record<string, number>) => {
  if (!formula) return false;
  let balance = 0;
  for (const char of formula) {
    if (!validCharacters.includes(char) && !variables.includes(char)) return false;
    if (char === '(') balance++;
    if (char === ')') balance--;
    if (balance < 0) return false;
  }

  if (balance !== 0) return false;

  const cleanFormula = formula.replace(/\s+/g, '');
  if (cleanFormula.length === 0) return false;

  if (/\/0+(?!\d|\.)/.test(cleanFormula)) return false;

  const isOperator = (c: string) => "+-*/^".includes(c);
  const isVariable = (c: string) => variables.includes(c);
  const isNumberPart = (c: string) => "0123456789.".includes(c);
  const isOperand = (c: string) => isVariable(c) || isNumberPart(c);

  for (let i = 0; i < cleanFormula.length - 1; i++) {
    const current = cleanFormula[i];
    const next = cleanFormula[i + 1];

    if (isOperator(current)) {
      if (!isOperand(next) && next !== '(') return false;
    } else if (isVariable(current)) {
      if (!isOperator(next) && next !== ')') return false;
    } else if (isNumberPart(current)) {
      if (!isNumberPart(next) && !isOperator(next) && next !== ')') return false;
    } else if (current === '(') {
      if (!isOperand(next) && next !== '(' && next !== '-') return false;
    } else if (current === ')') {
      if (!isOperator(next) && next !== ')') return false;
    }
  }

  const firstChar = cleanFormula[0];
  const lastChar = cleanFormula[cleanFormula.length - 1];

  if (isOperator(firstChar) && firstChar !== '-') return false;
  if (isOperator(lastChar) || lastChar === '(') return false;

  try {
    // 1. Reemplazo de símbolos:
    // En matemáticas usamos '^' para elevar a una potencia (ej: v^2).
    // Sin embargo, JavaScript usa '**' para la potencia.
    // Esta expresión regular (/\^/g) busca todos los símbolos '^' en la fórmula 
    // y los reemplaza por '**' para que JavaScript pueda calcularla.
    const jsFormula = cleanFormula.replace(/\^/g, '**');

    // 2. Creación de una función matemática dinámica:
    // "new Function" toma código en formato de texto y lo convierte en una función real.
    // Le estamos diciendo: "Crea una función que recibe 'v', 'c', 't', 'p' y retorna el cálculo de la fórmula".
    // Esto es completamente seguro porque previamente bloqueamos cualquier
    // letra o símbolo extraño, permitiendo SOLO números, matemáticas y v,c,t,p.
    const evaluator = new Function('v', 'c', 't', 'p', `return ${jsFormula};`);

    // 3. Ejecutar la función para probar si se rompe matemáticamente:
    // Le pasamos los valores que el usuario ingresó en el formulario para (v, c, t, p).
    // Si la fórmula es, por ejemplo, "1 / (v-c)", intentará calcularlo usando los números reales.
    // El "?? 1" significa: si el valor no existe por algún motivo, usa "1" por defecto.
    const result = evaluator(values.v ?? 1, values.c ?? 1, values.t ?? 1, values.p ?? 1);

    // 4. Revisión de errores fatales de matemáticas (División por cero):
    // Si alguien intenta dividir 1 entre 0 (ej: si v=2 y c=2 en la fórmula "1/(v-c)"), 
    // JavaScript no hace crash, sino que el resultado da un valor llamado "Infinity" o "NaN".
    // La función Number.isFinite() verifica que el resultado sea un número normal.
    // Si da Infinity o NaN, esto será falso, e invalidamos la fórmula previniendo el error.
    if (!Number.isFinite(result)) {
      return false;
    }
  } catch (e) {
    // Si JavaScript falla al intentar ejecutar la función (ej: por una sintaxis incompleta
    // que pasó las pruebas anteriores como "v*+2"), simplemente marcamos la fórmula como inválida.
    return false;
  }

  return true;
};
