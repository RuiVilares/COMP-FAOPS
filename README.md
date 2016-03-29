# COMP-FAOPS

FAOPS: Operations with Finite Automata (an alternative can be to consider an embedded DSL for Java)

This project includes the definition of a DSL to specify expressions consisting of operations over finite automata (FAs).
The FAs used in the expressions shall be input using dot files. The framework shall perform the operations in the expression.
The DSL shall include a way to specify the dumping of the resultant FA as a dot file. The operations to be considered are: x
(multiply), . (concatenate), not (complement), rev (reverse), int (intersection), and + (union).
