const fs = require('fs');
const readline = require('readline');

const variables = {};
let programLines = {};

const evaluateExpression = (expr) => {
    const variableReplaced = expr.split(" ").map((symbol) => {
        if (variables[symbol]) {
            return variables[symbol];
        } else {
            return symbol;
        }
    }).join(" ");
    
    return Function(`return ${variableReplaced}`)();
};

const commands = {
    LET: (args) => {
        const [varName, expr] = args.split('=').map(s => s.trim());
        variables[varName] = evaluateExpression(expr);
    },
    PRINT: (args) => {
        if (args.startsWith('"') && args.endsWith('"')) {
            console.log(args.slice(1, -1));
        } else {
            console.log(variables[args]);
        }
    },
    IF: (args) => {
        const [condition, goto] = args.split('THEN').map(s => s.trim());
        if (evaluateExpression(condition)) {
            const nextLineNumber = goto.split("GOTO")[1].trim();
            return nextLineNumber;
        }
    },
    GOTO: (args) => {
        return parseInt(args, 10);
    },
    END: () => {
        process.exit(0);
    },
    INPUT: async (args) => {
        const question = `Enter value for ${args}: `;
        const answer = await new Promise((resolve) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question(question, (input) => {
                rl.close();
                resolve(input);
            });
        });
        variables[args] = answer;
    }
};

const executeLine = async (lineNumber) => {
    const line = programLines[lineNumber];
    if (!line) return;
    const [command, ...args] = line.split(' ');
    if (commands[command]) {
        const nextLine = await commands[command](args.join(" "), lineNumber);
        if (nextLine) return nextLine;
    }
    const currentLineIndex = Object.keys(programLines).findIndex((index) => index == lineNumber);
    const nextLine = Object.keys(programLines)[currentLineIndex + 1];
    if (nextLine) return nextLine;
};

const loadAndExecute = async (filePath) => {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        const parts = line.split(" ");
        const lineNumber = parseInt(parts.shift(), 10);
        programLines[lineNumber] = parts.join(" ");
    }).on('close', async () => {
        let currentLine = Object.keys(programLines)[0];
        do {
            currentLine = await executeLine(parseInt(currentLine));
        } while (currentLine);
    });
};

const filePath = process.argv[2];
if (!filePath) {
    console.error('Usage: node interpreter.js <file_path>');
    process.exit(1);
}

loadAndExecute(filePath);
