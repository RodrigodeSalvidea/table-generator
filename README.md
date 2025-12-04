# Summary

This demo website is a table generator for a larger compiler project. Given an input grammar, it will generate the goto and action tables needed to build a LR(1) parser

# Input Rules
 
* Rules should be separated by one or more line.
* All symbols on the right-hand side should be separated by one or more spaces
* A '->' should separate the left hand side from the right hand side
* The left hand side should contain only one symbol
* The right hand side should contain at least one symbol
* The grammar should contain exactly one goal symbol
* The goal symbol should appear in exactly one rule, on the left hand side
* To express a nonterminal symbol that has multiple expansion rules, write the rules seperately


# Sample Inputs:

Sheep-noise:
```
Goal -> SheepNoise
SheepNoise -> SheepNoise baa
SheepNoise -> baa
```
Parenthesis
```
Goal -> ParenList
ParenList -> ParenList Parens
ParenList -> Parens
Parens -> ( ParenList )
Parens -> ( )
```
Postorder arithmetic:
```
Goal -> Expr
Expr -> Expr Expr Op
Expr -> num
Op -> +
Op -> -
Op -> /
Op -> %
```
