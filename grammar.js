module.exports = grammar({
  name: "iitran",
  extras: ($) => [/[ \t\r\n]/, $.comment],
  word: ($) => $.identifier,
  rules: {
    program: ($) => seq(repeat($.declaration), repeat($._statement)),
    _type: (_) => choice("INTEGER", "CHARACTER", "LOGICAL"),
    declaration: ($) =>
      seq($._type, seq($.identifier, repeat(seq(",", $.identifier)))),
    _statement: ($) => choice($.closed_statement, $.open_statement),
    closed_statement: ($) =>
      choice(
        $._expression,
        field(
          "if_statement",
          seq(
            "IF",
            $._expression,
            $.closed_statement,
            "ELSE",
            $.closed_statement
          )
        ),
        field("do_statement", seq("DO", repeat($._statement), "END")),
        field(
          "while_statement",
          seq("WHILE", $._expression, $.closed_statement)
        ),
        field("stop_statement", seq("STOP"))
      ),
    open_statement: ($) =>
      choice(
        field("if_statement", seq("IF", $._expression, $._statement)),
        field(
          "if_statement",
          seq("IF", $._expression, $.closed_statement, "ELSE", $.open_statement)
        ),
        field("while_statement", seq("WHILE", $._expression, $.open_statement))
      ),
    _expression: ($) =>
      choice(
        $.identifier,
        $._constant,
        $.binary_expression,
        $.unary_expression,
        $.parenthesized_expression
      ),
    parenthesized_expression: ($) => seq("(", $._expression, ")"),
    binary_expression: ($) =>
      choice(
        $.arithmetic_expression,
        $.logical_expression,
        $.comparison_expression,
        $.assignment_expression
      ),
    arithmetic_expression: ($) =>
      choice(
        prec.left(6, seq($._expression, choice("*", "/"), $._expression)),
        prec.left(5, seq($._expression, choice("+", "-"), $._expression))
      ),
    logical_expression: ($) =>
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
    comparison_expression: ($) =>
      prec.left(
        4,
        seq(
          field("left", $._expression),
          field("operator", choice("<", "<=", ">", ">=", "#", "=")),
          field("right", $._expression)
        )
      ),
    assignment_expression: ($) =>
      prec.right(
        1,
        seq(
          field("name", $._expression),
          field("assign", "<-"),
          field("value", $._expression)
        )
      ),
    unary_expression: ($) =>
      prec(
        7,
        choice(
          $.negation_expression,
          $.logical_negation_expression,
          $.type_conversion
        )
      ),
    negation_expression: ($) =>
      seq(field("operator", "~"), field("operand", $._expression)),
    logical_negation_expression: ($) =>
      seq(field("operator", "NOT"), field("operand", $._expression)),
    type_conversion: ($) =>
      seq(
        field("operator", choice("CHAR", "LG", "INT")),
        field("operand", $._expression)
      ),
    identifier: (_) => /[a-zA-Z][a-zA-Z0-9_]*/,
    _constant: ($) => choice($.character, $.number),
    character: (_) => /'[a-zA-Z]'/,
    number: (_) => /-?[0-9]+/,
    comment: (_) => token(seq("$", /.*/)),
  },
});
