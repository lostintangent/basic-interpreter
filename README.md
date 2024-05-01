# Simple BASIC Interpreter

This repository now contains a Node.js project that implements a simple interpreter for BASIC. The interpreter supports executing BASIC programs from a file path provided by the user, interpreting line number prefixed instructions correctly. It supports the following instructions:

- `LET` - Assigns the value of a variable. The assignment expression can be an arbitrary expression that includes variables.
- `PRINT` - Prints a variable or a string constant.
- `IF...THEN` - Evaluates an if expression and then allows printing or goto in the then statement.
- `GOTO` - Jumps to the specified line.
- `END` - Ends the program.

## Running the Interpreter

To run the interpreter with a BASIC program file, use the following command:

```bash
node interpreter.js <path_to_basic_program_file>
```

For example, to execute a sample program, you would run:

```bash
node interpreter.js sample.bas
```

A sample script (`sample.bas`) is included in the repository to demonstrate simple examples of the supported instructions.
