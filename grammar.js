module.exports = grammar({
  name: "iitran",

  extras: ($) => [/[ \t\r\n]/, $.comment],

  word: ($) => $.identifier,

  rules: {
    program: ($) => seq(repeat($.declaration), repeat($._statement)),

    declaration: ($) => seq($._type, $._identifier_list),

    _type: (_) =>
      choice(
        "INTEGER",
        "CHARACTER",
        "LOGICAL",
        "integer",
        "character",
        "logical"
      ),

    _identifier_list: ($) =>
      seq(
        field("name", $.identifier),
        repeat(seq(",", field("name", $.identifier)))
      ),

    _statement: ($) => choice($._closed_statement, $._open_statement),

    _closed_statement: ($) =>
      choice(
        alias($._expression, $.expression_statement),
        alias($.ifelse_closed_statement, $.if_statement),
        alias($.while_closed_statement, $.while_statement),
        $.do_statement,
        $.stop_statement
      ),

    ifelse_closed_statement: ($) =>
      seq(
        "IF",
        field("condition", $._expression),
        field("consequence", $._closed_statement),
        field("alternative", alias($.closed_else_clause, $.else_clause))
      ),

    closed_else_clause: ($) =>
      seq(choice("ELSE", "else"), field("body", $._closed_statement)),

    while_closed_statement: ($) =>
      seq(
        "WHILE",
        field("condition", $._expression),
        field("body", $._closed_statement)
      ),

    do_statement: ($) =>
      seq(choice("DO", "do"), repeat($._statement), choice("END", "end")),
    stop_statement: (_) => choice("STOP", "stop"),

    _open_statement: ($) =>
      choice(
        alias($.if_open_statement, $.if_statement),
        alias($.ifelse_open_statement, $.if_statement),
        alias($.while_open_statement, $.while_statement)
      ),

    if_open_statement: ($) =>
      seq(
        choice("IF", "if"),
        field("condition", $._expression),
        field("consequence", $._statement)
      ),

    ifelse_open_statement: ($) =>
      seq(
        "IF",
        field("condition", $._expression),
        field("consequence", $._closed_statement),
        field("alternative", alias($.open_else_clause, $.else_clause))
      ),

    open_else_clause: ($) =>
      seq(choice("ELSE", "else"), field("body", $._open_statement)),

    while_open_statement: ($) =>
      seq(
        choice("WHILE", "while"),
        field("condition", $._expression),
        field("body", $._open_statement)
      ),

    _expression: ($) =>
      choice(
        $.identifier,
        $._constant,
        $._binary_expression,
        $._unary_expression,
        $.parenthesized_expression
      ),

    parenthesized_expression: ($) => seq("(", $._expression, ")"),

    _binary_expression: ($) =>
      choice(
        $.binary_operator,
        $.logical_operator,
        $.comparison_operator,
        $.assignment
      ),

    binary_operator: ($) =>
      choice(
        prec.left(
          6,
          seq(
            field("left", $._expression),
            field("operator", choice("*", "/")),
            field("right", $._expression)
          )
        ),
        prec.left(
          5,
          seq(
            field("left", $._expression),
            field("operator", choice("+", "-")),
            field("right", $._expression)
          )
        )
      ),

    logical_operator: ($) =>
      choice(
        prec.left(
          3,
          seq(
            field("left", $._expression),
            field("operator", choice("AND", "and")),
            field("right", $._expression)
          )
        ),
        prec.left(
          2,
          seq(
            field("left", $._expression),
            field("operator", choice("OR", "or")),
            field("right", $._expression)
          )
        )
      ),

    comparison_operator: ($) =>
      prec.left(
        4,
        seq(
          field("left", $._expression),
          field("operator", choice("<", "<=", ">", ">=", "#", "=")),
          field("right", $._expression)
        )
      ),

    assignment: ($) =>
      prec.right(
        1,
        seq(
          field("left", $._expression),
          field("operator", "<-"),
          field("right", $._expression)
        )
      ),

    _unary_expression: ($) =>
      prec(7, choice($.unary_operator, $.not_operator, $.type_conversion)),

    unary_operator: ($) =>
      seq(field("operator", "~"), field("argument", $._expression)),

    not_operator: ($) =>
      seq(
        field("operator", choice("NOT", "not")),
        field("argument", $._expression)
      ),

    type_conversion: ($) =>
      seq(
        field("operator", choice("CHAR", "LG", "INT", "char", "lg", "int")),
        field("argument", $._expression)
      ),

    identifier: (_) => /[a-zA-Z][a-zA-Z0-9_]*/,
    _constant: ($) => choice($.character, $.number),
    character: (_) => /'[a-zA-Z]'/,
    number: (_) => /-?[0-9]+/,
    comment: (_) => token(seq("$", /.*/)),
  },
});
