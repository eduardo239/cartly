import type { Review } from './types';

/** Avaliações de clientes que compraram (mock). */
export const REVIEWS_SEED: Review[] = [
  { id: 'r1', productId: 'tenis-volt', author: 'Rafael M.', rating: 5, date: '14/11/2026', text: 'Muito leve e confortável. Usei o dia inteiro na estreia e não senti nada. O violeta é ainda mais bonito pessoalmente.' },
  { id: 'r2', productId: 'tenis-volt', author: 'Camila T.', rating: 4, date: '02/11/2026', text: 'Gostei bastante do acabamento. Calça um pouco justo no começo, então vale pedir meio número acima se você tem o pé largo.' },
  { id: 'r3', productId: 'tenis-volt', author: 'Bruno S.', rating: 5, date: '28/10/2026', text: 'Combina com tudo, como promete a descrição. A entrega chegou antes do prazo.' },
  { id: 'r4', productId: 'tenis-volt', author: 'Letícia P.', rating: 5, date: '19/10/2026', text: 'Já é meu segundo par. A malha respira bem e a sola tem boa tração na chuva.' },
  { id: 'r5', productId: 'tenis-volt', author: 'Diego A.', rating: 3, date: '07/10/2026', text: 'Bonito e leve, mas o cadarço é fino e soltou algumas vezes. No resto, sem reclamações.' },

  { id: 'r6', productId: 'fone-halo', author: 'Paula R.', rating: 5, date: '10/11/2026', text: 'O cancelamento de ruído é impressionante no metrô. A bateria dura a semana de trabalho.' },
  { id: 'r7', productId: 'fone-halo', author: 'Henrique L.', rating: 4, date: '26/10/2026', text: 'Som equilibrado e confortável por horas. Só achei o case um pouco volumoso.' },
  { id: 'r8', productId: 'fone-halo', author: 'Aline C.', rating: 5, date: '15/10/2026', text: 'A conexão com dois aparelhos funciona direitinho. Troco do notebook para o celular sem esforço.' },

  { id: 'r9', productId: 'jaqueta-norte', author: 'Marcos V.', rating: 5, date: '05/11/2026', text: 'Leve, corta bem o vento e dobra pequena na mochila. Serviu certinho no tamanho M.' },
  { id: 'r10', productId: 'jaqueta-norte', author: 'Fernanda G.', rating: 4, date: '21/10/2026', text: 'Ótima para meia-estação. O capuz poderia ser um pouco maior.' },

  { id: 'r11', productId: 'mochila-trama', author: 'Thiago N.', rating: 5, date: '12/11/2026', text: 'Cabe notebook de 15" com folga e aguentou uma chuva forte sem molhar nada.' },
  { id: 'r12', productId: 'mochila-trama', author: 'Julia F.', rating: 4, date: '30/10/2026', text: 'Muito bem acabada. O bolso oculto é ótimo, só falta um bolso lateral para garrafa maior.' },

  { id: 'r13', productId: 'garrafa-fluxo', author: 'Renata B.', rating: 5, date: '08/11/2026', text: 'O gelo ainda estava lá no dia seguinte. A boca larga facilita muito a limpeza.' },
  { id: 'r14', productId: 'garrafa-fluxo', author: 'Gustavo O.', rating: 4, date: '17/10/2026', text: 'Segura bem a temperatura. A tampa é firme, mas pede um pouco de força para abrir.' },

  { id: 'r15', productId: 'caneca-bloco', author: 'Sofia D.', rating: 5, date: '09/11/2026', text: 'Linda e pesadinha na medida. Vai bem na lava-louças e a cor não desbotou.' },
  { id: 'r16', productId: 'caneca-bloco', author: 'Pedro H.', rating: 4, date: '25/10/2026', text: 'A alça quadrada é confortável. Tem ótimo acabamento para o preço.' },

  { id: 'r17', productId: 'camera-foco', author: 'Vitor K.', rating: 5, date: '03/11/2026', text: 'Cabe no bolso do casaco e as fotos saem muito nítidas. A estabilização no vídeo é ótima.' },
  { id: 'r18', productId: 'vaso-duna', author: 'Isabela J.', rating: 5, date: '11/11/2026', text: 'Perfeito para minhas suculentas. A silhueta fica linda na estante.' },
  { id: 'r19', productId: 'luminaria-arco', author: 'Nathalia E.', rating: 4, date: '13/11/2026', text: 'A luz quente deixa a sala aconchegante. O toque na base responde bem.' },
  { id: 'r20', productId: 'relogio-orbita', author: 'André Q.', rating: 5, date: '01/11/2026', text: 'Caixa de 40 mm fica elegante no pulso. A troca da pulseira é simples.' },
];
