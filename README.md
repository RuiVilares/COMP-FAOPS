# PROJECT TITLE: Finite Automata Operations
## GROUP: 2FAOPS
```
NAME1: António Ramadas, NR1: 201303568, GRADE1: 20.0, CONTRIBUTION1: 25%

NAME2: Guilherme Pinto, NR2: 201305803, GRADE2: 20.0, CONTRIBUTION2: 25%

NAME3: José Pedro Teles, NR3: 201305101, GRADE3: 20.0, CONTRIBUTION3: 25%

NAME4: Rui Vilares, NR4: 201207046, GRADE4: 20.0, CONTRIBUTION4: 25%
```
###SUMMARY

The developed project consists in a single webpage application with the intention to provide to the user the result from a operation between multiple finite automatas.

The final product must be able to upload multiple DOT files, each one containing a finite automata, and process an operation given by the user. The program should alert the user with a success message or an error alert, if any mistake on the input data was detected.

The development of a web application is ideal for this project, improving the interaction with the user and offering the best visual output, using the [GraphViz](http://www.graphviz.org/), an open source graph visualization framework, with the features we required.





Este projeto inclui a definição de uma **DSL** ( _Domain-Specific Language_ ) para análise, interpretação e cálculo de expressões relativas a operações entre autómatos finitos (FA's).

A aplicação consiste numa única página web, de design e utilização simples.

//inserir print de pagina web

Os Autómatos Finitos usados nas expressões devem ser inseridos com recurso ao _upload_ de ficheiros DOT, segundo o formato especificado na imagem que se segue:

![Example of DOT file] [dotFile]

Recorrendo à framework [GraphViz](http://www.graphviz.org/), necessitamos de definir um padrão de modo a distinguir estados iniciais e estados finais dos restantes estados intermédios. Para tal, estabelecemos que estados finais serão distinguidos com '**shape=**triangle' e estados finais com '**color=**red'






FAOPS: Operations with Finite Automata (an alternative can be to consider an embedded DSL for Java)
This project includes the definition of a DSL to specify expressions consisting of operations over finite automata (FAs).
The FAs used in the expressions shall be input using dot files. The framework shall perform the operations in the expression.
The DSL shall include a way to specify the dumping of the resultant FA as a dot file. 
The operations to be considered are: x (multiply), . (concatenate), not (complement), rev (reverse), int (intersection), and + (union).

FA A = new(“A.dot”);
FA B = new(“B.dot”);
FA C = not(A int B);
C.dump(“dot”);


[dotFile]: https://github.com/RuiVilares/COMP-FAOPS/blob/Guilherme/extra/readmeResources/dotFile.PNG
