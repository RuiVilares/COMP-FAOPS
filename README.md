# FAOPS
## Operações com Autómatos Finitos

Foi desenvolvida, no âmbito da unidade curricular de Compiladores, uma aplicação web com o objetivo de disponibilizar ao utilizador o resultado do processamento de operações entre autómatos finitos.

Este projeto inclui a definição de uma **DSL** (_Domain-Specific Language_) 



FAOPS: Operations with Finite Automata (an alternative can be to consider an embedded DSL for Java)
This project includes the definition of a DSL to specify expressions consisting of operations over finite automata (FAs).
The FAs used in the expressions shall be input using dot files. The framework shall perform the operations in the expression.
The DSL shall include a way to specify the dumping of the resultant FA as a dot file. 
The operations to be considered are: x (multiply), . (concatenate), not (complement), rev (reverse), int (intersection), and + (union).

FA A = new(“A.dot”);
FA B = new(“B.dot”);
FA C = not(A int B);
C.dump(“dot”);
