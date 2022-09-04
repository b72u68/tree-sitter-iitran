module.exports = grammar({
  name: "iitran",
  extras: ($) => [/[ \t\r\n]/, $.comment],
  word: ($) => $.identifier,
  rules: {
    program: ($) => seq(repeat($.declaration), repeat($._statement)),
    _type: (_) => choice("INTEGER", "CHARACTER", "LOGICAL"),
    declaration: ($) =>
      seq($._type, seq($.identifier, repeat(seq(",", $.identifier)))),
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
    closed_else_clause: ($) => seq("ELSE", field("body", $._closed_statement)),
    while_closed_statement: ($) =>
      seq(
        "WHILE",
        field("condition", $._expression),
        field("body", $._closed_statement)
      ),
    do_statement: ($) => seq("DO", repeat($._statement), "END"),
    stop_statement: (_) => seq("STOP"),
    _open_statement: ($) =>
      choice(
        alias($.if_open_statement, $.if_statement),
        alias($.ifelse_open_statement, $.if_statement),
        alias($.while_open_statement, $.while_statement)
      ),
    if_open_statement: ($) =>
      seq(
        "IF",
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
    open_else_clause: ($) => seq("ELSE", field("body", $._open_statement)),
    while_open_statement: ($) =>
      seq(
        "WHILE",
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
        prec.left(6, seq($._expression, choice("*", "/"), $._expression)),
        prec.left(5, seq($._expression, choice("+", "-"), $._expression))
      ),
    logical_operator: ($) =>
      choice(
        prec.left(
          3,
          seq(
            field("left", $._expression),
            field("operator", "AND"),
            field("right", $._expression)
          )
        ),
        prec.left(
          2,
          seq(
            field("left", $._expression),
            field("operator", "OR"),
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
      seq(field("operator", "NOT"), field("argument", $._expression)),
    type_conversion: ($) =>
      seq(
        field("operator", choice("CHAR", "LG", "INT")),
        field("argument", $._expression)
      ),
    identifier: (_) => /[a-zA-Z][a-zA-Z0-9_]*/,
    _constant: ($) => choice($.character, $.number),
    character: (_) => /'[a-zA-Z]'/,
    number: (_) => /-?[0-9]+/,
    comment: (_) => token(seq("$", /.*/)),
  },
});
